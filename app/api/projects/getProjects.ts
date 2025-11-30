import { NextRequest, NextResponse } from "next/server";

import { apiAuthCheck } from "@/helpers/authStatus";
import { sql } from "@/utils/postgres";

import { ApiAuth, DatabaseProjectsTable } from "@/type";

export async function GET(req: NextRequest): Promise<NextResponse> {
    const authStatus: ApiAuth = await apiAuthCheck(req);

    if (!authStatus["auth"]) {
        return NextResponse.json(
            {
                "error": "You need to be logged in"
            },
            { status: 403 }
        );
    };

    let collaberatorProjects: DatabaseProjectsTable[] = [];

    try {
        collaberatorProjects = await sql`SELECT * FROM projects WHERE collaborators LIKE ${`%${authStatus["userId"]}%`}`;
    } catch (e) {
        console.error(e);

        return NextResponse.json(
            {
                "error": "Something went wronge getting projects"
            },
            { status: 500 }
        );
    };

    return NextResponse.json(
        {
            "projects": collaberatorProjects
        },
        { status: 200 }
    );
};