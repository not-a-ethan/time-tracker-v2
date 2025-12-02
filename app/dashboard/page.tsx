"use client";

import { useRouter } from "next/navigation";

import { useSession } from "next-auth/react";

import { CreateTimer } from "./createTimer";
import { CreateProject } from "./createProject";
import { TimeChart } from "./timeTracked";

import { getAPI } from "@/helpers/getAPI";

import { DatabaseProjectsTable } from "@/type";

export default function Dashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();

    const { projectJSON, projectError, projectLoading } = getAPI("../api/projects", ["projectJSON", "projectError", "projectLoading"]);

    if (status === "loading") {
        return <p>Loading</p>;
    };

    if (status === "unauthenticated") {
        router.replace("/api/auth/signin");
        return <p>403 | Log in to see this page</p>;
    };

    if (projectError) {
        console.error(projectError.message);

        return (
            <>
                <h1>Dashboard</h1>

                <CreateTimer skelton="true" />

                <CreateProject skelton="true" />
            </>
        );
    };

    if (projectLoading) {
        return (
            <>
                <h1>Dashboard</h1>

                <CreateTimer skeleton="true" />

                <CreateProject skeleton="true" />
            </>
        );
    };

    const projects: DatabaseProjectsTable[] = projectJSON["projects"];

    return (
        <>
            <h1>Dashboard</h1>

            <CreateTimer projects={projects} />

            <CreateProject />

            <TimeChart projects={projects} />
        </>
    );
};