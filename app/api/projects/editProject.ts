import { NextRequest, NextResponse } from "next/server";

import { apiAuthCheck } from "@/helpers/authStatus";
import { isProjectColaborator } from "@/helpers/project/isColaborator";
import { sql } from "@/utils/postgres";

import { ApiAuth } from "@/type";

export async function PUT(req: NextRequest): Promise<NextResponse> {
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
    if (!(await isProjectColaborator(authStatus["userId"], projectId))) {
        return NextResponse.json(
            {
                "error": "You are not a colaborater on the project"
            },
            { status: 403 }
        );
    };

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
        try {
            await sql`UPDATE projects SET name=${newName} WHERE id=${projectId};`;
        } catch (e) {
            return NextResponse.json(
                {
                    "error": "Something went wrong changing name. Nothing else was changed"
                },
                { status: 500 }
            );
        };
    };

    if (types.includes("desc")) {
        try {
            await sql`UPDATE projects SET description=${newDescription} WHERE id=${projectId};`;
        } catch (e) {
            return NextResponse.json(
                {
                    "error": "Something went wrong changing descrption. The name was changed (if applicable) and no more."
                }
            )
        }
    };

    if (types.includes("color")) {
        try {
            await sql`UPDATE projects SET color=${newColor} WHERE id=${projectId};`;
        } catch (e) {
            return NextResponse.json(
                {
                    "error": "Something went wrong changing color. The name and description was changed (if applicable)."
                },
                { status: 500 }
            );
        };
    };

    return NextResponse.json(
        {},
        { status: 200 }
    );
};