import { NextRequest, NextResponse } from "next/server";

import { apiAuthCheck } from "@/helpers/authStatus";
import { sql } from "@/utils/postgres";
import { isProjectColaborator } from "@/helpers/project/isColaborator";
import { isProjectOwner } from "@/helpers/project/isOwner";

import { ApiAuth, DatabasetimeEntriesTable } from "@/type";

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
    const projectId: number|null|undefined = Number(searchParams.get("projectId"));

    if (projectId === null || projectId === undefined || Number.isNaN(projectId)) {
        try {
            const items: DatabasetimeEntriesTable[] = await sql`SELECT * FROM timeentries WHERE owner=${authStatus["userId"]};`;

            return NextResponse.json(
                {
                    "items": items
                },
                { status: 200 }
            );
        } catch (e) {
            console.error(e);

            return NextResponse.json(
                {
                    "error": "Something went wrong trying to get entries"
                },
                { status: 500 }
            );
        };
    } else if (projectId >= 0) {
        if (!(await isProjectColaborator(authStatus["userId"], projectId) || await isProjectOwner(authStatus["userId"], projectId))) {
            return NextResponse.json(
                {
                    "error": "You do not own or collaberate on that project"
                },
                { status: 403 }
            );
        };

        try {
            const items: DatabasetimeEntriesTable[] = await sql`SELECT * FROM timeentries WHERE projectId=${projectId};`;

            return NextResponse.json(
                {
                    "items": items
                },
                { status: 200 }
            );
        } catch (e) {
            console.error(e);

            return NextResponse.json(
                {
                    "error": "Something went wrong with getting time entries"
                },
                { status: 500 }
            );
        };
    } else {
        return NextResponse.json(
            {
                "error": "You asked for an invalid project Id"
            },
            { status: 400 }
        );
    };
};