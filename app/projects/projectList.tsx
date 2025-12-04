"use client";

import { Table, TableBody, TableHeader, TableColumn, TableRow, TableCell } from "@heroui/table";
import { Skeleton } from "@heroui/skeleton";

import { ProjectRows } from "./ProjectRow";

import { DatabaseProjectsTable } from "@/type";

export function ProjectList(props: any){
    const projects: DatabaseProjectsTable[] = props.projects;

    if (props.skeleton) {
        return (
            <Skeleton>
                <Table>
                    <TableHeader>
                        <TableColumn>Name</TableColumn>
                        <TableColumn>Description</TableColumn>
                        <TableColumn>Actions</TableColumn>
                    </TableHeader>

                    <TableBody>
                        <TableRow>
                            <TableCell>The best project</TableCell>
                            <TableCell>The best description</TableCell>
                            <TableCell>eshfusdfhds</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </Skeleton>
        );
    };

    return (
        <Table>
            <TableHeader>
                <TableColumn>Name</TableColumn>
                <TableColumn>Description</TableColumn>
                <TableColumn>Actions</TableColumn>
            </TableHeader>

            {ProjectRows({projects: projects})}
        </Table>
    );
};