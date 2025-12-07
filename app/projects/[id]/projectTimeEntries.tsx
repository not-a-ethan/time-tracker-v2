"use client";

import { Table, TableHeader, TableBody, TableRow, TableColumn, TableCell } from "@heroui/table";
import { Modal, ModalContent, ModalHeader, ModalBody, useDisclosure } from "@heroui/modal";
import { Skeleton } from "@heroui/skeleton";

import { getAPI } from "@/helpers/getAPI";

import { DatabaseProjectsTable, DatabasetimeEntriesTable } from "@/type";

export function ProjectTimeEntries(props: any) {
    const project: DatabaseProjectsTable = props.project;

    const { json, jsonError, jsonLoading } = getAPI(`../../api/timeEntry?projectId=${project.id}`, ["json", "jsonError", "jsonLoading"]);

    if (jsonLoading) {
        return (
            <Table>
                <TableHeader>
                    <TableColumn><Skeleton>Entry name</Skeleton></TableColumn>
                    <TableColumn><Skeleton>Start Time</Skeleton></TableColumn>
                    <TableColumn><Skeleton>End Time</Skeleton></TableColumn>
                    <TableColumn><Skeleton>Owner</Skeleton></TableColumn>
                </TableHeader>

                <TableBody>
                    <TableRow>
                        <TableCell><Skeleton>Amazing Name</Skeleton></TableCell>
                        <TableCell><Skeleton>{new Date(2010, 6, 12, 10, 25).toString()}</Skeleton></TableCell>
                        <TableCell><Skeleton>{new Date(2025, 11, 25).toString()}</Skeleton></TableCell>
                        <TableCell><Skeleton>John Doe</Skeleton></TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        );
    };

    if (jsonError) {
        console.error(jsonError["error"]);
        
        return (
            <Table>
                <TableHeader>
                    <TableColumn><Skeleton>Entry name</Skeleton></TableColumn>
                    <TableColumn><Skeleton>Start Time</Skeleton></TableColumn>
                    <TableColumn><Skeleton>End Time</Skeleton></TableColumn>
                    <TableColumn><Skeleton>Owner</Skeleton></TableColumn>
                </TableHeader>

                <TableBody>
                    <TableRow>
                        <TableCell><Skeleton>Amazing Name</Skeleton></TableCell>
                        <TableCell><Skeleton>{new Date(2010, 6, 12, 10, 25).toString()}</Skeleton></TableCell>
                        <TableCell><Skeleton>{new Date(2025, 11, 25).toString()}</Skeleton></TableCell>
                        <TableCell><Skeleton>John Doe</Skeleton></TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        );
    };

    const timeEntries: DatabasetimeEntriesTable[] = json["items"];

    return (
        <Table>
            <TableHeader>
                <TableColumn>Entry name</TableColumn>
                <TableColumn>Start Time</TableColumn>
                <TableColumn>End Time</TableColumn>
                <TableColumn>Owner</TableColumn>
            </TableHeader>

            <TableBody>
                {timeEntries.map((entry: DatabasetimeEntriesTable) => (
                    <TableRow key={entry["id"]}>
                        <TableCell>{entry["name"]}</TableCell>
                        <TableCell>{new Date(entry.starttime * 1000).toString()}</TableCell>
                        <TableCell>{entry.endtime ? new Date(entry.endtime * 1000).toString() : "-"}</TableCell>
                        <TableCell>{entry["owner"]}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};