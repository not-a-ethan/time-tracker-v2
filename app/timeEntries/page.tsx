"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { useSession } from "next-auth/react";

import { Filters } from "./filters";

import { getAPI } from "@/helpers/getAPI";

import { DatabasetimeEntriesTable } from "@/type";

export default function TimeEntries() {
    const { data: session, status } = useSession();
    const router = useRouter();

    const [filters, setFilters] = useState({});

    const { json, jsonError, jsonLoading } = getAPI("../api/timeEntry", ["json", "jsonError", "jsonLoading"]);

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