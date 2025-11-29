import { NextRequest, NextResponse } from "next/server";

import { apiAuthCheck } from "@/helpers/authStatus";
import { sql } from "@/utils/postgres";

import { ApiAuth } from "@/type";

export async function DELETE(req: NextRequest) {
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
    // oihaentioewdsuhgnjrswoeikgjm

    // Delete project
    // woeihtngewoisjtmgnoiwesjtmfopewsifrjkm
};