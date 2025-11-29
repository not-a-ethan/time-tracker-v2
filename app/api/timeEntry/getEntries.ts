import { NextRequest, NextResponse } from "next/server";

import { apiAuthCheck } from "@/helpers/authStatus";
import { sql } from "@/utils/postgres";

import { ApiAuth } from "@/type";

export async function GET(req: NextRequest) {
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
    const projectId: number= Number(searchParams.get("projectId"));

    if (Number.isNaN(projectId)) {
        // get all entries for user
    } else if (projectId >= 0) {
        // get all for specific project

        // Check if user owns project
    } else {
        return NextResponse.json(
            {
                "error": "You asked for an invalid project Id"
            },
            { status: 400 }
        );
    };
};