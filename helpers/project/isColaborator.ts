import { sql } from "@/utils/postgres";

import { DatabaseProjectsTable } from "@/type";

export async function isProjectColaborator(userId: number, projectId: number): Promise<boolean> {
    if (Number.isNaN(userId) || Number.isNaN(projectId) || userId <= 0 || projectId <= 0) {
        return false;
    };

    try {
        const query: DatabaseProjectsTable[] = await sql`SELECT * FROM projects WHERE id=${projectId};`;
        const colaborators: string[] = query[0]["collaborators"].split(",");
        
        if (colaborators.includes(userId.toString())) {
            return true;
        };
    } catch (e) {
        console.error(e);

        return false;
    };

    return false;
};