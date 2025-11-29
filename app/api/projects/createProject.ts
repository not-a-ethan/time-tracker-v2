import { NextRequest, NextResponse } from "next/server";

import { apiAuthCheck } from "@/helpers/authStatus";
import { sql } from "@/utils/postgres";

import { ApiAuth } from "@/type";

export async function POST(req: NextRequest) {
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
    const name: string|null = body["name"];
    const description: string|null = body["description"];
    const color: string|null = body["color"];

    if (name === null || name.trim().length === 0) {
        return NextResponse.json(
            {
                "error": "Projects cant be nameless"
            },
            { status: 400 }
        );
    };

    if (color === null || color.trim().length === 0) {
        return NextResponse.json(
            {
                "error": "Projects need a color"
            },
            { status: 400 }
        );
    };

    // DB stuff
};