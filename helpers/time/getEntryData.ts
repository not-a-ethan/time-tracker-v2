import { isTimeOwner } from "./isOwner";
import { sql } from "@/utils/postgres";

import { DatabaseTimeEntriesTable } from "@/type";

export async function getTimeInfo(userId: number, timeEntryId: number): Promise<DatabaseTimeEntriesTable> {
    if (Number.isNaN(userId) || Number.isNaN(timeEntryId) || userId <= 0 || timeEntryId <= 0) {
        return {
            "id": -1,
            "projectId": -1,
            "name": "",
            "startTime": -1,
            "endTime": -1,
            "owner": -1
        };
    };

    if (!(await isTimeOwner(userId, timeEntryId))) {
        return {
            "id": -1,
            "projectId": -1,
            "name": "",
            "startTime": -1,
            "endTime": -1,
            "owner": -1
        }; 
    };

    try {
        const query: DatabaseTimeEntriesTable[] = await sql`SELECT * FROM timeEntries WHERE id=${timeEntryId};`;

        return query[0];
    } catch (e) {
        console.error(e);

        return {
            "id": -1,
            "projectId": -1,
            "name": "",
            "startTime": -1,
            "endTime": -1,
            "owner": -1
        };
    };
};