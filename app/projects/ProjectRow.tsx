"use client";

import { TableBody, TableRow, TableCell } from "@heroui/table";
import { Link } from "@heroui/link";

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
                                <Link className={`${styles.projectName}`} href={`./projects/${project["id"]}`}>{project.name}</Link>
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