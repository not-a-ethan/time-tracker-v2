import { NextRequest, NextResponse } from "next/server";

import { apiAuthCheck } from "@/helpers/authStatus";
import { sql } from "@/utils/postgres";

import { ApiAuth } from "@/type";

export async function POST(req: NextRequest): Promise<NextResponse> {
    const authStatus: ApiAuth = await apiAuthCheck(req);

    if (!authStatus["auth"]) {
        return NextResponse.json(
            {
                "error": "You need to be logged in"
            },
            { status: 403 }
        );
    };

    const body = await req.json();
    const name: string|null|undefined = body["name"];
    const description: string|null|undefined = body["description"];
    const color: string|null|undefined = body["color"];

    if (name === null || name === undefined || name.trim().length === 0) {
        return NextResponse.json(
            {
                "error": "Projects cant be nameless"
            },
            { status: 400 }
        );
    };

    if (color === null || color === undefined || color.trim().length === 0) {
        return NextResponse.json(
            {
                "error": "Projects need a color"
            },
            { status: 400 }
        );
    };

    if (description !== null && description !== undefined && description.trim().length !== 0) {
        try {
            await sql`INSERT INTO projects (name, description, color, owner, collaborators) VALUES (${name}, ${description.trim()}, ${color}, ${authStatus["userId"]}, ${authStatus["userId"]});`;
        } catch (e) {
            console.error(e);

            return NextResponse.json(
                {
                    "error": "Something went wrong creating project"
                },
                { status: 500 }
            );
        };
    } else {
        try {
            await sql`INSERT INTO projects (name, color, owner, collaborators) VALUES (${name}, ${color}, ${authStatus["userId"]}, ${authStatus["userId"]});`;
        } catch (e) {
            console.error(e);

            return NextResponse.json(
                {
                    "error": "Something went wrong creating project"
                },
                { status: 500 }
            );
        };
    };

    return NextResponse.json(
        {},
        { status: 200 }
    );
};