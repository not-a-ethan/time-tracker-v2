import { sql } from "@/utils/postgres";

/*
Aguments:

type: type of account | ["sso", "credentials"]
username: username of new account
password: hased password of new account | null if using sso
sso_pro: sso source (ex: github) | null if not using sso
sso_id: id of sso account (ex: github id) | null if not using sso
*/
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