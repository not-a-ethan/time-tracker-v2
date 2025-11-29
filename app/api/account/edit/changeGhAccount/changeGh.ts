import { NextRequest, NextResponse } from "next/server";

import { apiAuthCheck } from "@/helpers/authStatus";
import { sql } from "@/utils/postgres";

import { ApiAuth } from "@/type";

export async function PUT(req: NextRequest) {
    const authStatus: ApiAuth = await apiAuthCheck(req);

    if (!authStatus["auth"]) {
        return NextResponse.json(
            {
                "error": "You need to be logged in"
            },
            { status: 403 }
        );
    };


};