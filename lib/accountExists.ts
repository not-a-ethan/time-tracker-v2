import { sql } from "@/utils/postgres";

/*
Aguments:

type: type of account | ["sso", "credentials"]
provider: sso provider or username
ssoId: Id of external account if account uses sso
*/
export function accountExists(type: string, provider: string, ssoId: number): boolean {
    let query;

    if (type === "sso") {
        query = `SELECT * FROM users WHERE externalID=${sql(ssoId)} AND sso_pro=${sql(provider)}`;
    } else if (type === "credentials") {
        query = `SELECT * FROM users WHERE username=${sql(provider)}`;
    }

    interface userType {
        id: number,
        username: string,
        password: string | null,
        sso_pro: string | null,
        externalID: number | null,
    };

    const user: readonly userType[] = sql(query) as unknown as readonly userType[];

    if (user.length > 0) {
        return true;
    }

    return false;
}