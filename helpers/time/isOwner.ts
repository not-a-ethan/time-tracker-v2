import { sql } from "@/utils/postgres";

import { DatabaseTimeEntriesTable } from "@/type";

export async function isTimeOwner(userId: number, timeEntryId: number): Promise<boolean> {
    if (Number.isNaN(userId) || Number.isNaN(timeEntryId) || userId <= 0 || timeEntryId <= 0) {
        return false;
    };

    try {
        const query: DatabaseTimeEntriesTable[] = await sql`SELECT * FROM timeEntries WHERE id=${timeEntryId};`;
        const owner: number = query[0]["owner"];

        if (owner === userId) {
            return true;
        };
    } catch (e) {
        console.error(e);

        return false;
    };

    return false;
};