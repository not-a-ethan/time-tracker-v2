import { sql } from "@/utils/postgres";

import { DatabaseProjectsTable } from "@/type";

export async function isProjectOwner(userId: number, projectId: number): Promise<boolean> {
    if (Number.isNaN(userId) || Number.isNaN(projectId) || userId <= 0 || projectId <= 0) {
        return false;
    };

    try {
        const query: DatabaseProjectsTable[] = await sql`SELECT * FROM projects WHERE id=${projectId};`;
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