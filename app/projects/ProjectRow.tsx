"use client";

import { TableBody, TableRow, TableCell } from "@heroui/table";

import { EditButton, DeleteButton } from "./projectActions";

import { DatabaseProjectsTable } from "@/type";

import styles from "../styles/projects/projectRow.module.css";

export function ProjectRows(props: any) {
    const projects: DatabaseProjectsTable[] = props.projects;

    return (
        <TableBody>
            {projects.map((project: DatabaseProjectsTable) => (
                <TableRow key={project.id}>
                    <TableCell>
                        <ul>
                            <li style={{color: project["color"]}} className={`${styles.projectListItem}`}>
                                <span className={`${styles.projectName}`}>{project.name}</span>
                            </li>
                        </ul>
                    </TableCell>
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