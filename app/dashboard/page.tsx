"use client";

import { useRouter } from "next/navigation";

import { useSession } from "next-auth/react";

import { useState } from "react";

import { CreateTimeItem } from "./createItem";
import { CreateProject } from "./createProject";

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

                <CreateTimeItem skelton="true" />

                <CreateProject skelton="true" />
            </>
        );
    };

    if (projectLoading) {
        return (
            <>
                <h1>Dashboard</h1>

                <CreateTimeItem skelton="true" />

                <CreateProject skelton="true" />
            </>
        );
    };

    const projects: DatabaseProjectsTable[] = projectJSON["projects"];

    return (
        <>
            <h1>Dashboard</h1>

            <CreateTimeItem projects={projects} />

            <CreateProject />
        </>
    );
};