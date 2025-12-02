"use client";

import dynamic from "next/dynamic";

import { useState } from "react";

import { Select, SelectItem } from "@heroui/select";
import { Skeleton } from "@heroui/skeleton";

import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";

import { getAPI } from "@/helpers/getAPI";

import { DatabaseProjectsTable, DatabasetimeEntriesTable } from "@/type";

import styles from "../styles/dashboard/graph.module.css";

Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Line = dynamic(() => import('react-chartjs-2').then((mod) => mod.Line), {
  ssr: false,
});

export function TimeChart(props: any) {
    const projects: DatabaseProjectsTable[] = props.projects;

    const [currentProject, setCurrentProject] = useState<number>(-1);

    const { json, jsonError, jsonLoading } = getAPI(`../api/timeEntry${currentProject === -1 ? `` : `?projectId=${currentProject}`}`, ["json", "jsonError", "jsonLoading"]);

    if (props.skeleton) {
        return (
            <>
            
            </>
        );
    };

    function projectChange(e: any) {
        const thisProj: string|undefined = e.values().next().value?.toString();

        if (thisProj !== undefined) {
            setCurrentProject(Number(projects[0]["id"]));
        } else {
            setCurrentProject(-1);
        };
    };

    if (jsonLoading) {
        return (
            <>
                <Select name="project" label="Project" onSelectionChange={projectChange}>
                    {projects.map((project: DatabaseProjectsTable) => (
                        <SelectItem key={project.id}>{project.name}</SelectItem>
                    ))}
                </Select>

                <Skeleton>
                    {/* Add skelton of chart thing*/}
                </Skeleton>
            </>
        );
    };

    if (jsonError) {
        return (
            <>
                <Select name="project" label="Project" onSelectionChange={projectChange}>
                    {projects.map((project: DatabaseProjectsTable) => (
                        <SelectItem key={project.id}>{project.name}</SelectItem>
                    ))}
                </Select>

                <Skeleton>
                    {/* Add skelton of chart thing*/}
                </Skeleton>
            </>
        );
    };

    if (json) {
        const timeEntries: DatabasetimeEntriesTable[] = json["items"];

        if (json["error"]) {
            return (
                <>
                    <Select name="project" label="Project" onSelectionChange={projectChange}>
                        {projects.map((project: DatabaseProjectsTable) => (
                            <SelectItem key={project.id}>{project.name}</SelectItem>
                        ))}
                    </Select>
                </>
            );
        };

        const today = new Date();
        const end = (Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()) / 1000);

        const days = {
            "0": 0,
            "1": 0,
            "2": 0,
            "3": 0,
            "4": 0,
            "5": 0,
            "6": 0
        };

        for (let i = 0; i < timeEntries.length; i++){
            const thisEntry: DatabasetimeEntriesTable = timeEntries[i];

            if (thisEntry.endtime === null) {
                continue;
            };
            
            const date = new Date(thisEntry.starttime * 1000);

            const start = (Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 1000);
            
            //const diffDays = Math.floor(Math.abs((+date / 1000) - (today / 1000)) / 86400) // 86,400 is the number of seconds in a day
            const diffDays = Math.abs((start - end) / 86400);

            if (diffDays >= 7) {
                break;
            };

            if (diffDays === 0) {
                days["0"] = days["0"] + (thisEntry.endtime - thisEntry.starttime) / 60;
            } else if (diffDays === 1) {
                days["1"] = days["1"] + (thisEntry.endtime - thisEntry.starttime) / 60;
            } else if (diffDays === 2) {
                days["2"] = days["2"] + (thisEntry.endtime - thisEntry.starttime) / 60;
            } else if (diffDays === 3) {
                days["3"] = days["3"] + (thisEntry.endtime - thisEntry.starttime) / 60;
            } else if (diffDays === 4) {
                days["4"] = days["4"] + (thisEntry.endtime - thisEntry.starttime) / 60;
            } else if (diffDays === 5) {
                days["5"] = days["5"] + (thisEntry.endtime - thisEntry.starttime) / 60;
            } else if (diffDays === 6) {
                days["6"] = days["6"] + (thisEntry.endtime - thisEntry.starttime) / 60;
            };
        };

        const dates: string[] = [];

        for (let i = 0; i < 7; i++) {
            dates.push(`${today.getMonth()}-${today.getDate() - 1}-${today.getFullYear()}`);
            today.setDate(today.getDate() - 1);
        };
        
        const data = {
            labels: dates.reverse(),
            datasets: [
                {
                    label: "Minutes Tracked",
                    data: Object.values(days).reverse(), // Array of minute values.
                    fill: true,
                    borderColor: "rgba(255, 255, 255)",
                    tension: .4
                }
            ]
        };

        const options = {
            scales: {
                y: {
                    "min": 0
                }
            }
        };

        return (
            <span className={`${styles.main}`}>
                <Select name="project" label="Project" onSelectionChange={projectChange} className={`${styles.projectSelecter}`}>
                    {projects.map((project: DatabaseProjectsTable) => (
                        <SelectItem key={project.id}>{project.name}</SelectItem>
                    ))}
                </Select>

                <Line data={data} options={options} />
            </span>
        );
    };

    return (
        <>
            <Select name="project" label="Project" onSelectionChange={projectChange}>
                {projects.map((project: DatabaseProjectsTable) => (
                    <SelectItem key={project.id}>{project.name}</SelectItem>
                ))}
            </Select>
        </>
    );
};