"use client";

import { TableBody, TableRow, TableCell } from "@heroui/table";

import { EditButton, DeleteButton } from "./projectActions";

import { DatabaseProjectsTable } from "@/type";

export function ProjectRows(props: any) {
    const projects: DatabaseProjectsTable[] = props.projects;

    return (
        <TableBody>
            {projects.map((project: DatabaseProjectsTable) => (
                <TableRow key={project.id} style={{backgroundColor: project["color"]}}>
                    <TableCell>{project.name}</TableCell>
                    <TableCell>{project.description}</TableCell>
                    <TableCell>
                        <EditButton project={project} />
                        <DeleteButton project={project} />
                    </TableCell>
                </TableRow>
            ))}
        </TableBody>
    );
};