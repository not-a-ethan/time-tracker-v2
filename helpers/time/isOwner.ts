import { sql } from "@/utils/postgres";

import { DatabasetimeEntriesTable } from "@/type";

export async function isTimeOwner(userId: number, timeEntryId: number): Promise<boolean> {
    if (!timeEntryId || Number.isNaN(userId) || Number.isNaN(timeEntryId) || userId <= 0 || timeEntryId <= 0) {
        return false;
    };

    try {
        const query: DatabasetimeEntriesTable[] = await sql`SELECT * FROM timeentries WHERE id=${timeEntryId};`;
        
        if (query.length === 0) {
            return false;
        };

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