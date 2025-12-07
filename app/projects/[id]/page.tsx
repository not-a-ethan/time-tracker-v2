"use client";

import { use } from "react";

import { useRouter } from "next/navigation";

import { useSession } from "next-auth/react";

import { ProjectTimeChart } from "./timeGraph";
import { Actions } from "./actions";
import { ProjectTimeEntries } from "./projectTimeEntries";

import { getAPI } from "@/helpers/getAPI";

import { DatabaseProjectsTable } from "@/type";

import styles from "../../styles/projects/[id]/page.module.css";

export default function ManageProject({ params }: { params: Promise<{id: string}> }) {
    const { id } = use(params);
    
    const { data: session, status } = useSession();
    const router = useRouter();
    
    const { json, jsonError, jsonLoading } = getAPI(`../../api/projects?id=${id}`, ["json", "jsonError", "jsonLoading"]);

    if (status === "loading") {
        return <p>Loading</p>;
    };

    if (status === "unauthenticated") {
        router.replace("/api/auth/signin");
        return <p>403 | Log in to see this page</p>;
    };

    if (jsonError) {
        console.error(jsonError["message"]);

        return (
            <>
                <h1>Project</h1>
            </>
        );
    };

    if (jsonLoading) {
        return (
            <>
                <h1>Project</h1>
            </>
        );
    };

    const projectInfo: DatabaseProjectsTable = json["project"];

    return (
        <>
            <h1>
                <ul>
                    <li style={{color: projectInfo["color"]}} className={`${styles.projectListItem}`}>
                        <span className={`${styles.projectName}`}>{projectInfo["name"]}</span>
                    </li>
                </ul>
            </h1>

            <p>{projectInfo["description"]}</p>

            <ProjectTimeEntries project={projectInfo} />

            <br />

            <ProjectTimeChart project={projectInfo} />

            <br />

            <Actions project={projectInfo} />
        </>
    );
};