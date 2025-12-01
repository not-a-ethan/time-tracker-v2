import { NextRequest, NextResponse } from "next/server";

import { apiAuthCheck } from "@/helpers/authStatus";
import { sql } from "@/utils/postgres";

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

    const result: DatabasetimeEntriesTable[] = await sql`SELECT * FROM timeentries WHERE owner=${authStatus["userId"]} AND endtime=NULL;`;

    if (result.length === 0) {
        return NextResponse.json(
            {
                "running": false
            },
            { status: 200 }
        );
    };

    return NextResponse.json(
        {
            "running": true,
            "timeId": result[0]["id"]
        },
        { status: 200 }
    );
};