import { NextRequest, NextResponse } from "next/server";

import { apiAuthCheck } from "@/helpers/authStatus";
import { sql } from "@/utils/postgres";

import { ApiAuth } from "@/type";

export async function DELETE(req: NextRequest) {
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
    const project: number|null = body["project"];

    if (project === null || Number.isNaN(project) || project <= 0) {
        return (NextResponse.json(
            {
                "error": "You need a valid project id"
            },
            { status: 400 }
        ));
    };

    
};