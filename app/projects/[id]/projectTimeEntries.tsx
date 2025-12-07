"use client";

import { useState } from "react";

import { Table, TableHeader, TableBody, TableRow, TableColumn, TableCell } from "@heroui/table";
import { Modal, ModalContent, ModalHeader, ModalBody, useDisclosure } from "@heroui/modal";
import { Skeleton } from "@heroui/skeleton";
import { Button } from "@heroui/button";
import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { DatePicker } from "@heroui/date-picker";
import { addToast } from "@heroui/toast";

import { CalendarDate, CalendarDateTime, DateValue } from "@internationalized/date";

import { getAPI } from "@/helpers/getAPI";
import { isoToUnixEpoch } from "@/helpers/isoToUnix";

import { DatabaseProjectsTable, DatabasetimeEntriesTable } from "@/type";

export function ProjectTimeEntries(props: any) {
    const project: DatabaseProjectsTable = props.project;

    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const [editName, setEditName] = useState<boolean>(true);
    const [editProject, setEditProject] = useState<boolean>(false);
    const [currentEntry, setCurrentEntry] = useState<DatabasetimeEntriesTable>();

    const { json, jsonError, jsonLoading } = getAPI(`../../api/timeEntry?projectId=${project.id}`, ["json", "jsonError", "jsonLoading"]);
    const { projectJSON, projectError, projectLoading } = getAPI(`../../api/projects`, ["projectJSON", "projectError", "projectLoading"]);

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
    

    function editEntry(e: any) {
        e.preventDefault();

        const data = Object.fromEntries(new FormData(e.currentTarget));

        if (currentEntry === undefined) {
            addToast({
                color: "danger",
                title: "Something went wrong getting time entry data"
            });

            return;
        };

        let error: boolean = false;

        if (editName) {
            const name: string|null|undefined = data["newName"].toString();

            if (!name || name.trim().length === 0) {
                addToast({
                    color: "warning",
                    title: "You need an entry name"
                });

                return;
            };

            // make request
            fetch("../../api/timeEntry", {
                method: "PUT",
                body: JSON.stringify({
                    "id": currentEntry["id"],
                    "name": name
                })
            })
            .then(res => {
                if (!res.ok) {
                    error = true;
                };

                return res.json();
            })
            .then((json: any) => {
                if (error) {
                    addToast({
                        color: "danger",
                        title: "Something went wrong changing name",
                        description: json["error"]
                    });
                };
            })
            .catch(e => {
                console.error(e);

                addToast({
                    color: "danger",
                    title: "Something went wrong changing name",
                    description: "More info in developer console"
                });
            });
        } else if (!editProject) {
            const startTime: string|null|undefined = data["start"].toString();
            const endTime: string|null|undefined = data["end"].toString();

            if (!startTime || startTime.trim().length === 0) {
                addToast({
                    color: "warning",
                    title:" You need a valid start time"
                });

                error = true;
            };

            if (!endTime || endTime.trim().length === 0) {
                addToast({
                    color: "warning",
                    title: "You need a valid end time"
                });

                error = true;
            };

            if (error) {
                return true;
            };

            const startUnix: number = isoToUnixEpoch(startTime);
            const endUnix: number = isoToUnixEpoch(endTime);

            if (startUnix >= endUnix) {
                addToast({
                    color: "warning",
                    title: "Start time needs to be before end time"
                });

                return;
            };

            fetch("../../api/timeEntry", {
                method: "PUT",
                body: JSON.stringify({
                    "id":currentEntry["id"],
                    "startTime": startUnix,
                    "endTime": endUnix
                })
            })
            .then(res => {
                if (!res.ok) {
                    error = true;
                };

                return res.json();
            })
            .then((json: any) => {
                if (error) {
                    addToast({
                        color: "danger",
                        title: "Something went wrong changing times",
                        description: json["error"]
                    });
                };
            })
            .catch(e => {
                console.error(e);

                addToast({
                    color: "danger",
                    title: "Something went wrong changing times",
                    description: "More info in developer console"
                });
            });
        } else {
            const projectSelected: number|null|undefined = Number(data["project"].toString());

            if (!projectSelected || Number.isNaN(projectSelected) || projectSelected <= 0) {
                addToast({
                    color: "warning",
                    title: "You need to select a valid project"
                });

                return;
            };

            let error: boolean = false;

            fetch("../../api/timeEntry", {
                method: "PUT",
                body: JSON.stringify({
                    "id": currentEntry["id"],
                    "project": projectSelected
                })
            })
            .then(res => {
                if (!res.ok) {
                    error = true;
                };

                return res.json();
            })
            .then((json: any) => {
                if (error) {
                    addToast({
                        color: "danger",
                        title: "Something went wrong editing time entry project",
                        description: json["error"]
                    });
                };
            })
            .catch(e => {
                console.error(e);

                addToast({
                    color: "danger",
                    title: "Something wrnt wrong editing time entry project",
                    description: "More info in developer console"
                });
            });
        };
    };

    function DatePickerFormattedDate(unixEpoch: number|undefined): DateValue {
        if (unixEpoch === undefined) {
            return new CalendarDate(1970, 1, 1);
        };

        const date = new Date(unixEpoch * 1000);

        return new CalendarDateTime(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes());
    };

    if (projectLoading || projectError) {
        if (projectError) {
            console.error(projectError.error);
        };

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
    const projects: DatabaseProjectsTable[] = projectJSON["projects"];

    return (
        <>
            <Table>
                <TableHeader>
                    <TableColumn>Entry name</TableColumn>
                    <TableColumn>Start Time</TableColumn>
                    <TableColumn>End Time</TableColumn>
                    <TableColumn>Owner</TableColumn>
                </TableHeader>

                <TableBody>
                    {timeEntries.map((entry: DatabasetimeEntriesTable) => (
                        <TableRow key={entry["id"]} onClick={(e) => {
                                onOpen();
                                setCurrentEntry(entry);
                            }}>
                            <TableCell>
                                {entry["name"]}
                            </TableCell>
                            <TableCell>{new Date(entry.starttime * 1000).toString()}</TableCell>
                            <TableCell>{entry.endtime ? new Date(entry.endtime * 1000).toString() : "-"}</TableCell>
                            <TableCell>{entry["owner"]}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onclose) => (
                        <>
                            <ModalHeader>
                                <h1>Edit time entry</h1>
                            </ModalHeader>

                            <ModalBody>
                                <Form onSubmit={editEntry}>
                                    <Select defaultSelectedKeys={[`name`]} isRequired label="What to edit" onSelectionChange={(e: any) => {
                                        const type: string = e.values().next().value?.toString(); 
                                        if (type === "name") {
                                            setEditName(true);
                                            setEditProject(false);
                                        } else if (type === "time") {
                                            setEditName(false);
                                            setEditProject(false);
                                        } else {
                                            setEditName(false);
                                            setEditProject(true);
                                        };
                                    }}>
                                        <SelectItem key="name">Name</SelectItem>
                                        <SelectItem key="time">Start & End Time</SelectItem>
                                        <SelectItem key="project">Project</SelectItem>
                                    </Select>

                                    {editName ? (
                                        <>
                                            <Input type="text" name="newName" label="New Entry name" isRequired />
                                        </>
                                    ) : !editProject ? (
                                        <>
                                            <DatePicker label="Start time" name="start" isRequired showMonthAndYearPickers defaultValue={DatePickerFormattedDate(currentEntry !== undefined ? currentEntry["starttime"] : undefined)} />
                                            <DatePicker label="End time" name="end" isRequired showMonthAndYearPickers defaultValue={DatePickerFormattedDate(currentEntry !== undefined ? currentEntry["endtime"] || undefined : undefined)} />
                                        </>
                                    ) : (
                                        <>
                                            <Select name="project" label="Choose a new project" isRequired>
                                                {projects.map((project: DatabaseProjectsTable) => (
                                                    <SelectItem key={project["id"]}>{project.name}</SelectItem>
                                                ))}
                                            </Select>
                                        </>
                                    )}

                                    <Button type="submit" color="primary" onPress={onclose}>Edit Time Entry</Button>
                                </Form>
                            </ModalBody>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
};