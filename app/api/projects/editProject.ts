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

    const body = await req.json();

    const projectId: number|null = body["id"];
    const newName: string|null = body["name"];
    const newDescription: string|null = body["description"];
    const newColor: string|null = body["color"];

    if (!projectId || Number.isNaN(projectId) || projectId <= 0) {
        return NextResponse.json(
            {
                "error": "You need a valid project id"
            },
            { status: 400 }
        );
    };

    // VALIDATE THAT USER OWNS PROJECT

    // Allowed values is "name", "desc", "color"
    const types: string[] = [];

    if (newName !== null && newName && newName.trim().length !== 0) {
        types.push("name");
    };

    if (newDescription !== null && newDescription && newDescription.trim().length !== 0) {
        types.push("desc");
    };

    if (newColor !== null && newColor && newColor.trim().length !== 0) {
        types.push("color");
    };

    if (types.length === 0) {
        return NextResponse.json(
            {
                "error": "You need to edit something"
            },
            { status: 400 }
        );
    };

    if (types.includes("name")) {
        // Change name
    };

    if (types.includes("desc")) {
        // Change description
    };

    if (types.includes("color")) {
        // Change color
    };

    return NextResponse.json(
        {},
        { status: 200 }
    );
};