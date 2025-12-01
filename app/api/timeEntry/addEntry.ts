import { NextRequest, NextResponse } from "next/server";

import { apiAuthCheck } from "@/helpers/authStatus";
import { sql } from "@/utils/postgres";

import { ApiAuth, DatabasetimeEntriesTable } from "@/type";

export async function POST(req: NextRequest): Promise<NextResponse> {
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
    const name: string|null|undefined = body["name"];
    const project: number|null|undefined = body["project"];
    const startTime: number|null|undefined = body["start"];
    const endTime: number|null|undefined = body["end"];

    if (name === null || name === undefined || !name || name.trim().length === 0) {
        return NextResponse.json(
            {
                "error": "You need a valid name"
            },
            { status: 400 }
        );
    };

    if (project === null || project === undefined || !project || Number.isNaN(project) || project <= 0) {
        return NextResponse.json(
            {
                "error": "You need a valid project"
            },
            { status: 400 }
        );
    };

    if (startTime === null || startTime === undefined || !startTime || Number.isNaN(startTime) || startTime <= 0) {
        return NextResponse.json(
            {
                "error": "You need a valid start time"
            },
            { status: 400 }
        );
    };

    // End time can be null. That means the current item is current.
    if ((endTime !== null && endTime !== undefined) && (Number.isNaN(endTime) || endTime <= 0)) {
        return NextResponse.json(
            {
                "error": "You need a valid end time"
            },
            { status: 400 }
        );
    };

    if (endTime === null || endTime === undefined) {
        try {
            await sql`INSERT INTO timeentries (projectid, name, starttime, owner) VALUES (${project}, ${name}, ${startTime}, ${authStatus["userId"]});`;
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
            await sql`INSERT INTO timeentries (projectid, name, starttime, endtime, owner) VALUES (${project}, ${name}, ${startTime}, ${endTime}, ${authStatus["userId"]});`;
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

    const timeInfo: DatabasetimeEntriesTable[] = await sql`SELECT * FROM timeentries WHERE owner=${authStatus["userId"]} AND starttime=${startTime};`;
    const id: number = timeInfo[0]["id"];

    return NextResponse.json(
        {
            "id": id
        },
        { status: 200 }
    );
};