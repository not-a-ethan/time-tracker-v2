"use client";

import dynamic from "next/dynamic";

import { Select, SelectItem } from "@heroui/select";

import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";

import { getAPI } from "@/helpers/getAPI";

import { DatabaseProjectsTable } from "@/type";

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

// https://www.geeksforgeeks.org/reactjs/how-to-add-chartjs-in-nextjs-13/

export function TimeChart(props: any) {
    const projects: DatabaseProjectsTable[] = props.projects;

    return (
        <>
            <Select name="project" isRequired label="Project">
                {projects.map((project: DatabaseProjectsTable) => (
                    <SelectItem key={project.id}>{project.name}</SelectItem>
                ))}
            </Select>
        </>
    );
};