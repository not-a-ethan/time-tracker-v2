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

    const searchParams = req.nextUrl.searchParams;
    const id: number|null = Number(searchParams.get("id"));

    if (!id || Number.isNaN(id) || id <= 0) {
        let collaberatorProjects: DatabaseProjectsTable[] = [];

        try {
            collaberatorProjects = await sql`SELECT * FROM projects WHERE collaborators LIKE ${"%" + authStatus["userId"] + "%"}`;
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
    } else {
        let project: DatabaseProjectsTable;

        try {
            const res: DatabaseProjectsTable[] = await sql`SELECT * FROM projects WHERE id=${id};`;

            if (res.length === 0) {
                return NextResponse.json(
                    {
                        "error": "No projects found"
                    },
                    { status: 404 }
                );
            };

            project = res[0];
        } catch (e) {
            console.error(e);

            return NextResponse.json(
                {
                    "error": "Something went wrong getting project data"
                },
                { status: 500 }
            );
        };

        if (project["owner"] !== authStatus["userId"] && project["collaborators"].split(",").includes(authStatus["userId"].toString())) {
            return NextResponse.json(
                {
                    "error": "You are not the owner or collaberator on the project"
                },
                { status: 403 }
            );
        };

        return NextResponse.json(
            {
                "project": project
            },
            { status: 200 }
        );
    };
};