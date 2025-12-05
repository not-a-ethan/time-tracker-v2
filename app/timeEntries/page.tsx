"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { useSession } from "next-auth/react";

import { Filters } from "./filters";

import { getAPI } from "@/helpers/getAPI";

import { DatabasetimeEntriesTable, TimeEntryFilters } from "@/type";

export default function TimeEntries() {
    const { data: session, status } = useSession();
    const router = useRouter();

    const [filters, setFilters] = useState<TimeEntryFilters>({project: [], time: {start: 0, end: 20000000000}});

    const { json, jsonError, jsonLoading } = getAPI("../api/timeEntry", ["json", "jsonError", "jsonLoading"]);

    if (status === "loading") {
        return <p>Loading</p>;
    };

    if (status === "unauthenticated") {
        router.replace("/api/auth/signin");
        return <p>403 | You need to login</p>;
    };

    if (jsonLoading) {
        return (
            <>
                <h1>Time Entries</h1>
            </>
        );
    };

    if (jsonError) {
        return (
            <>
                <h1>Time Entries</h1>
            </>
        );
    };

    const timeEntries: DatabasetimeEntriesTable[] = json["items"];

    return (
        <>
            <h1>Time Entries</h1>

            <Filters filters={filters} setFilters={setFilters} />
        </>
    );
};