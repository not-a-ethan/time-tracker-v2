import { sql } from "@/utils/postgres";

import { userType } from "./types";

/*
Aguments:

type: type of account | ["sso", "credentials"]
provider: sso provider or username
ssoId: Id of external account if account uses sso
*/
export function accountExists(type: string, provider: string, ssoId: number|null): boolean {
    let query;

    if (type === "sso") {
        query = `SELECT * FROM users WHERE externalID=${sql(ssoId)} AND sso_pro=${sql(provider)}`;
    } else if (type === "credentials") {
        query = `SELECT * FROM users WHERE username=${sql(provider)}`;
    }

    const user: readonly userType[] = sql(query) as unknown as readonly userType[];

    if (user.length > 0) {
        return true;
    }

    return false;
}