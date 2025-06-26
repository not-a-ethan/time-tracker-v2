'use client'

import { useRouter } from "next/navigation";

import { useSession } from "next-auth/react"

export default function Dashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();

    if (status === "loading") {
        return <p>Loading</p>;
    }

    if (status === "unauthenticated") {
        router.replace("/api/auth/signin");
        return <p>403 | Log in to see this page</p>;
    }

    return (
        <>
        
        </>
    )
}