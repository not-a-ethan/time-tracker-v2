import { sql } from "@/utils/postgres";

import { DatabaseUserTable } from "@/type";

export async function accountExists(githubId: number): Promise<boolean> {
    if (!githubId || Number.isNaN(githubId) || githubId <= 0) {
        return true;
    };

    let users: DatabaseUserTable[];

    try {
        users = await sql`SELECT * FROM users WHERE id=${githubId};`;
    } catch (e) {
        console.error(e);

        return true;
    };

    if (users.length === 0) {
        return false;
    };

    return true;
};