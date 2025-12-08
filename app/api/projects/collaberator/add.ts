import { NextRequest, NextResponse } from "next/server";

import { apiAuthCheck } from "@/helpers/authStatus";

import { sql } from "@/utils/postgres";

import { isProjectOwner } from "@/helpers/project/isOwner";

import { ApiAuth, DatabaseUserTable } from "@/type";
import { isProjectColaborator } from "@/helpers/project/isColaborator";

export async function PUT(req: NextRequest): Promise<NextResponse> {
    const authStatus: ApiAuth = await apiAuthCheck(req);

    if (!authStatus["auth"]) {
        return NextResponse.json(
            {
                "error": "You are not logged in"
            },
            { status: 403 }
        );
    };

    const body = await req.json();
    const id: number|undefined|null = body["id"];
    const username: string|undefined|null = body["username"];

    if (!id || Number.isNaN(id) || id <= 0) {
        return NextResponse.json(
            {
                "error": "You did not give a valid project id"
            },
            { status: 400 }
        );
    };

    if (!username || username.trim().length === 0) {
        return NextResponse.json(
            {
                "error": "You did not give a valid username"
            },
            { status: 400 }
        );
    };

    let userId: number;

    try {
        const users: DatabaseUserTable[] = await sql`SELECT * FROM users WHERE name=${username.trim()};`;

        if (users.length === 0) {
            return NextResponse.json(
                {
                    "error": "No user with that username found"
                },
                { status: 404 }
            );
        };

        userId = users[0]["id"];
    } catch (e) {
        console.error(e);

        return NextResponse.json(
            {
                "error": "Something went wrong getting userr data"
            },
            { status: 500 }
        );
    };

    if ((await isProjectColaborator(userId, id))) {
        return NextResponse.json(
            {
                "error": "User is already a collaberator"
            },
            { status: 400 }
        );
    };

    if (!(await isProjectOwner(authStatus["userId"], id))) {
        return NextResponse.json(
            {
                "error": "You do not own the project"
            },
            { status: 403 }
        );
    };

    let currentCollabs: string[] = []

    try {
        const collabs = (await sql`SELECT collaborators FROM projects WHERE id=${id};`)[0]["collaborators"];
        currentCollabs = collabs.split(",");
    } catch (e) {
        console.error(e);

        return NextResponse.json(
            {
                "error": "Something went wrong getting current collaberators"
            },
            { status: 500 }
        );
    };

    currentCollabs.push(userId.toString());

    try {
        await sql`UPDATE projects SET collaborators=${currentCollabs.join(",")} WHERE id=${id};`;
    } catch (e) {
        console.error(e);

        return NextResponse.json(
            {
                "error": "Something went wrong updating collaborators"
            },
            { status: 500 }
        );
    };

    return NextResponse.json(
        {},
        { status: 200 }
    )
};