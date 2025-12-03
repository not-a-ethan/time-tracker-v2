import { NextRequest, NextResponse } from "next/server";

import { apiAuthCheck } from "@/helpers/authStatus";
import { sql } from "@/utils/postgres";

import { ApiAuth } from "@/type";

export async function PUT(req: NextRequest): Promise<NextResponse> {
    const authStatus: ApiAuth = await apiAuthCheck(req);

    if (!authStatus["auth"]) {
        return NextResponse.json(
            {
                "error": "You need to be logged in"
            },
            { status : 403 }
        );
    };

    const body = await req.json();
    const newName: string|null|undefined = body["name"];

    if (!newName || newName === null || newName === undefined || newName.trim().length === 0) {
        return NextResponse.json(
            {
                "error": "You need a name that is not blank"
            },
            { status: 400 }
        );
    };

    try {
        await sql`UPDATE users SET name=${newName} WHERE id=${authStatus["userId"]};`;
    } catch (e) {
        console.error(e);

        return NextResponse.json(
            {
                "error": "Something went wrong trying to change name"
            },
            { status: 500 }
        );
    };

    return NextResponse.json(
        {},
        { status: 200 }
    );
};