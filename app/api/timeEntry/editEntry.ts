import { NextRequest, NextResponse } from "next/server";

import { apiAuthCheck } from "@/helpers/authStatus";
import { sql } from "@/utils/postgres";

import { ApiAuth } from "@/type";

export async function PUT(req: NextRequest) {
    const authStatus: ApiAuth = await apiAuthCheck(req);

    if (!authStatus["auth"]) {
        return NextResponse.json(
            {
                "error": "You are not logged in"
            },
            { status: 403 }
        );
    };

    const body = await req.json();
    const newName: string|null = body["name"];
    const newProject: number|null = body["project"];
    const newStartTime: number|null = body["startTime"];
    const newEndTime: number|null = body["endTime"];

    // Valid values: "name", "project", "start", "end"
    const types: string[] = [];

    if (newName !== null && newName && newName.trim().length !== 0) {
        types.push("name");
    };

    if (newProject !== null && !Number.isNaN(newProject) && newProject >= 0) {
        types.push("project");
    };

    if (newStartTime !== null && !Number.isNaN(newStartTime) && newStartTime >= 0) {
        types.push("start");
    };

    if (newEndTime !== null && !Number.isNaN(newEndTime) && newEndTime >= 0) {
        types.push("end");
    };

    if (types.length === 0) {
        return NextResponse.json(
            {
                "error": "You need to edit something"
            },
            { status: 400 }
        );
    };

    // VALIDATE user owns time entry

    if (types.includes("name")) {

    };

    if (types.includes("project")) {
        // Check that user owns new project
    };

    if (types.includes("start")) {
        // Check that start time is before end time
    };

    if (types.includes("end")) {
        // Check that end time is after start time
    };

    return NextResponse.json(
        {},
        { status: 200 }
    );
};