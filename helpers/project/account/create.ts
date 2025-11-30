import { accountExists } from "./exists";
import { sql } from "@/utils/postgres";

export async function createAccount(githubId: number, name: string): Promise<boolean> {
    if (!githubId || Number.isNaN(githubId) || githubId <= 0) {
        return true;
    };

    if (await accountExists(githubId)) {
        return true;
    };

    try {
        await sql`INSERT INTO users VALUES (${githubId}, ${name});`;
    } catch (e) {
        console.error(e);

        return false;
    };

    return true;
};