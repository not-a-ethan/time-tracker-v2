import { sql } from "@/utils/postgres";

export function createAccount(type: string, username: string, password: string|null, sso_pro: string|null, sso_id: number|null): boolean {
    let query;
    
    if (type === "sso") {
        query = `INSERT INTO users (username, sso_pro, externalID) VALUES ${sql(username, sso_pro, sso_id)}`;
    } else if (type === "credentials") {
        query = `INSERT INTO users (username, password) VALUES ${sql(username, password)}`;
    } else {
        return false;
    }

    return true;
}