"use client";

import { useRouter } from "next/navigation";

import { useSession } from "next-auth/react";

import { ChangeName } from "./changeName";

import styles from "../styles/account/page.module.css";

export default function Account() {
    const { data: session, status } = useSession();
    const router = useRouter();

    if (status === "loading") {
        return <p>Loading</p>;
    };

    if (status === "unauthenticated") {
        router.replace("/api/auth/signin");
        return <p>403 | Log in to see this page</p>;
    };

    return (
        <div className={`${styles.page}`}>
            <h1>Hello to user settings!</h1>

            <p>This is where you can modify user settings</p>

            <br />
            <br />

            <ChangeName />
        </div>
    );
};