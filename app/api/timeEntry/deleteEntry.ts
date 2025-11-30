import { NextRequest, NextResponse } from "next/server";

import { apiAuthCheck } from "@/helpers/authStatus";
import { isTimeOwner } from "@/helpers/time/isOwner";
import { isProjectOwner } from "@/helpers/project/isOwner";
import { sql } from "@/utils/postgres";

import { ApiAuth, DatabaseTimeEntriesTable } from "@/type";
import { getTimeInfo } from "@/helpers/time/getEntryData";

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
    const timeId: number|null = body["id"];

    if (timeId === null || Number.isNaN(timeId) || timeId <= 0) {
        return (NextResponse.json(
            {
                "error": "You need a valid project id"
            },
            { status: 400 }
        ));
    };

    const projectInfo: DatabaseTimeEntriesTable = await getTimeInfo(authStatus["userId"], timeId);

    if (!(await isTimeOwner(authStatus["userId"], timeId) || await isProjectOwner(authStatus["userId"], projectInfo["projectId"]))) {
        return NextResponse.json(
            {
                "error": "You can not delete that time entry. You dont own the time entry or project"
            },
            { status: 400 }
        );
    };

    try {
        await sql`DELETE FROM timeEntries WHERE id=${timeId};`;
    } catch (e) {
        console.error(e);

        return NextResponse.json(
            {
                "error": "Something went wrong deleting time entry"
            },
            { status: 500 }
        );
    };

    return NextResponse.json(
        {},
        { status: 200 }
    );
};