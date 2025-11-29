import { NextRequest, NextResponse } from "next/server";

import { apiAuthCheck } from "@/helpers/authStatus";
import { sql } from "@/utils/postgres";

import { ApiAuth } from "@/type";

export async function POST(req: NextRequest) {
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
    const name: string|null = body["name"];
    const project: number|null = body["project"];
    const startTime: number|null = body["start"];
    const endTime: number|null = body["end"];

    if (name === null || !name || name.trim().length === 0) {
        return NextResponse.json(
            {
                "error": "You need a valid name"
            },
            { status: 400 }
        );
    };

    if (project === null || !project || Number.isNaN(project) || project <= 0) {
        return NextResponse.json(
            {
                "error": "You need a valid project"
            },
            { status: 400 }
        );
    };

    if (startTime == null || !startTime || Number.isNaN(startTime) || project <= 0) {
        return NextResponse.json(
            {
                "error": "You need a valid start time"
            },
            { status: 400 }
        );
    };

    // End time can be null. That means the current item is current.
    if (endTime !== null && (Number.isNaN(endTime) || endTime <= 0)) {
        return NextResponse.json(
            {
                "error": "You need a valid end time"
            },
            { status: 400 }
        );
    };

    if (endTime === null) {
        try {
            await sql`INSERT INTO timeEntries (projectId, name, startTime, owner) VALUES (${project}, ${name}, ${startTime}, ${authStatus["userId"]});`;
        } catch (e) {
            console.error(e);

            return NextResponse.json(
                {
                    "error": "Something went wrong creating time entry"
                },
                { status: 500 }
            );
        };
    } else {
        try {
            await sql`INSERT INTO timeEntries (projectId, name, startTime, endTime, owner) VALUES (${project}, ${name}, ${startTime}, ${endTime}, ${authStatus["userId"]});`;
        } catch (e) {
            console.error(e);

            return NextResponse.json(
                {
                    "error": "Something went wrong creating time entry"
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