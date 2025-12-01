import { NextRequest, NextResponse } from "next/server";

import { apiAuthCheck } from "@/helpers/authStatus";
import { isProjectOwner } from "@/helpers/project/isOwner";
import { sql } from "@/utils/postgres";

import { ApiAuth } from "@/type";

export async function DELETE(req: NextRequest): Promise<NextResponse> {
    const authStatus: ApiAuth = await apiAuthCheck(req);

    if (!authStatus["auth"]) {
        return NextResponse.json(
            {
                "error": "You need to be loged in"
            },
            { status: 403 }
        );
    };

    const body = await req.json();
    const id: number|null = Number(body["id"]);

    if (id === null || Number.isNaN(id) || id <= 0) {
        return NextResponse.json(
            {
                "error": "You need a valid project id"
            },
            { status: 400 }
        );
    };

    // Check project owner,
    if (!(await isProjectOwner(authStatus["userId"], id))) {
        return NextResponse.json(
            {
                "error": "You do not own the project"
            },
            { status: 403 }
        );
    };

    // Delete time entries for project

    try {
        await sql`DELETE FROM timeentries WHERE projectId=${id};`;
    } catch (e) {
        console.error(e);

        return NextResponse.json(
            {
                "error": "Something went wrong deleting time entries"
            },
            { status: 500 }
        );
    };

    // Delete project
    
    try {
        await sql`DELETE FROM projects WHERE id=${id};`;
    } catch (e) {
        console.error(e);

        return NextResponse.json(
            {
                "error": "Somethign went wrong deleting project"
            },
            { status: 500 }
        );
    };

    return NextResponse.json(
        {},
        { status: 200 }
    );
};