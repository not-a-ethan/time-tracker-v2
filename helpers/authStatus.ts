import { NextRequest } from "next/server";

import { getToken } from "next-auth/jwt";

import { ApiAuth } from "@/type";

export async function apiAuthCheck(req: NextRequest): Promise<ApiAuth> {
    const token = await getToken({ req });

    if (!token) {
        return {
            "auth": false,
            "userId": -1
        };
    };

    return {
        "auth": true,
        "userId":  Number(token.sub)
    };
};