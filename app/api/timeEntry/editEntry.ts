import { NextRequest, NextResponse } from "next/server";

import { apiAuthCheck } from "@/helpers/authStatus";
import { getTimeInfo } from "@/helpers/time/getEntryData";
import { isTimeOwner } from "@/helpers/time/isOwner";
import { isProjectOwner } from "@/helpers/project/isOwner";
import { sql } from "@/utils/postgres";

import { ApiAuth, DatabaseTimeEntriesTable } from "@/type";

export async function PUT(req: NextRequest): Promise<NextResponse> {
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
    const timeId: number|null = body["id"];
    const newName: string|null = body["name"];
    const newProject: number|null = body["project"];
    const newStartTime: number|null = body["startTime"];
    const newEndTime: number|null = body["endTime"];

    if (timeId === null || Number.isNaN(timeId) || timeId <= 0) {
        return NextResponse.json(
            {
                "error": "You need a valid time id"
            },
            { status: 400 }
        );
    };

    // Valid values: "name", "project", "start", "end"
    const types: string[] = [];

    if (newName !== null && newName && newName.trim().length !== 0) {
        types.push("name");
    };

    if (newProject !== null && !Number.isNaN(newProject) && newProject > 0) {
        types.push("project");
    };

    if (newStartTime !== null && !Number.isNaN(newStartTime) && newStartTime > 0) {
        types.push("start");
    };

    if (newEndTime !== null && !Number.isNaN(newEndTime) && newEndTime > 0) {
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

    const timeEntryData: DatabaseTimeEntriesTable = await getTimeInfo(authStatus["userId"], timeId);

    if (!(isTimeOwner(authStatus["userId"], timeId) || isProjectOwner(authStatus["userId"], timeEntryData["projectId"]))) {
        return NextResponse.json(
            {
                "error": "You do not own the time entry or the project"
            },
            { status: 403 }
        );
    };

    if (types.includes("name")) {
        try {
            await sql`UPDATE timeEntries SET name=${newName} WHERE id=${timeId};`;
        } catch (e) {
            console.error(e);

            return NextResponse.json(
                {
                    "error": "Something went wrong changing name. Nothing else was changed"
                },
                { status: 500 }
            );
        };
    };

    if (types.includes("project")) {
        if (newProject === null || Number.isNaN(newProject) || newProject <= 0) {
            return NextResponse.json(
                {
                    "error": "You did not include a valid project id"
                },
                { status: 500 }
            );
        };

        // Check that user owns new project
        if (!(await isProjectOwner(authStatus["userId"], newProject))) {
            return NextResponse.json(
                {
                    "error": "You do not own the new project. Only the name was changed and nothing else (if applicable)"
                },
                { status: 403 }
            );
        };

        // Changes project
        try {
            await sql`UPDATE timeEntries SET projectId=${newProject} WHERE id=${timeId};`;
        } catch (e) {
            console.error(e);

            return NextResponse.json(
                {
                    "error": "Something went wrong changing the project. Only the name was changed and nothing else (if applicable)"
                },
                { status: 500 }
            );
        };
    };

    if (types.includes("start")) {
        if (newStartTime === null || Number.isNaN(newStartTime) || newStartTime <= 0) {
            return NextResponse.json(
                {
                    "error": "That is not a valid start time"
                },
                { status: 400 }
            );
        };

        // Check that start time is before end time
        if (types.includes("end")) {
            if (newEndTime === null || Number.isNaN(newEndTime) || newEndTime <= 0) {
                return NextResponse.json(
                    {
                        "error": "That is not a valid end time"
                    },
                    { status: 400 }
                );
            };

            if (newEndTime <= newStartTime) {
                return NextResponse.json(
                    {
                        "error": "You need to start before you can finish. Name and project was changed and nothing else (if applicable)"
                    },
                    { status: 400 }
                );
            };

            try {
                await sql`UPDATE timeEntries SET startTime=${newStartTime} WHERE id=${timeId};`;
            } catch (e) {
                console.error(e);

                return NextResponse.json(
                    {
                        "error": "Something went wrong changing start time. Name and project was changed and nothing else (if applicable)"
                    },
                    { status: 500 }
                );
            };
        } else {
            if (timeEntryData["endTime"] !== null && newStartTime >= timeEntryData["endTime"]) {
                return NextResponse.json(
                    {
                        "error": "You cant make the start time after the end time. Name and project was changed and nothing else (if applicable)"
                    },
                    { status: 400 }
                );
            };

            try {
                await sql`UPDATE timeEntries SET startTime=${newStartTime} WHERE id=${timeId};`;
            } catch (e) {
                return NextResponse.json(
                    {
                        "error": "Something went wrong changing start time. Name and project was changed and nothing else (if applicable)"
                    },
                    { status: 500 }
                );
            };
        };
    };

    if (types.includes("end")) {
        if (newEndTime === null || Number.isNaN(newEndTime) || newEndTime <= 0) {
            return NextResponse.json(
                {
                    "error": "That is not a valid end time"
                },
                { status: 400 }
            );
        };

        if (types.includes("start")) {
            if (newStartTime === null || Number.isNaN(newStartTime) || newStartTime <= 0) {
                return NextResponse.json(
                    {
                        "error": "That is not a valid start time"
                    },
                    { status: 400 }
                );
            };

            if (newStartTime >= newEndTime) {
                return NextResponse.json(
                    {
                        "error": "The end time needs to be after the start time. Everything else was changed (if applicable)."
                    },
                    { status: 400 }
                );
            };

            try {
                await sql`UPDATE timeEntries SET endTime=${newEndTime} WHERE id=${timeId};`;
            } catch (e) {
                return NextResponse.json(
                    {
                        "error": "Something went wrong changing end time. Everything else was changed (if applicable)."
                    },
                    { status: 500 }
                );
            };
        } else {
            if (timeEntryData["startTime"] >= newEndTime) {
                return NextResponse.json(
                    {
                        "error": "The end time needs to be after the start time. Everything else was changed (if applicable)."
                    },
                    { status: 400 }
                );
            };

            try {
                await sql`UPDATE timeEntries SET endTime=${newEndTime} WHERE id=${timeId};`;
            } catch (e) {
                console.error(e);

                return NextResponse.json(
                    {
                        "error": "Something went wrong changing end time. Everything else was changed (if applicable)."
                    },
                    { status: 500 }
                );
            };
        };
    };

    return NextResponse.json(
        {},
        { status: 200 }
    );
};