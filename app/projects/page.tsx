"use client";

import { useRouter } from "next/navigation";

import { useSession } from "next-auth/react";

import { ProjectList } from "./projectList";

import { getAPI } from "@/helpers/getAPI";

import { DatabaseProjectsTable } from "@/type";

export default function Projects() {
    const { data: session, status } = useSession();
    const router = useRouter();

    const { json, jsonError, jsonLoading } = getAPI("../api/projects", ["json", "jsonError", "jsonLoading"]);
    
    if (status === "loading") {
        return <p>Loading</p>;
    };

    if (status === "unauthenticated") {
        router.replace("/api/auth/signin");
        return <p>403 | Log in to see this page</p>;
    };

    if (jsonError) {
        console.error(jsonError.message);
        
        return (
            <>
                <h1>Projects</h1>

                <ProjectList skeleton="true" />
            </>
        );
    };

    if (jsonLoading) {
        return (
            <>
                <h1>Projects</h1>

                <ProjectList skeleton="true" />
            </>
        );
    };

    const projects: DatabaseProjectsTable[] = json["projects"];
    
    return (
        <>
            <h1>Projects</h1>

            <ProjectList projects={projects} />
        </>
    );
};