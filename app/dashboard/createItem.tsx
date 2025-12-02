"use client";

import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { DatePicker } from "@heroui/date-picker";
import { Button } from "@heroui/button";
import { Modal, ModalContent, ModalBody, ModalHeader, useDisclosure } from "@heroui/modal";
import { addToast } from "@heroui/toast";
import { Skeleton } from "@heroui/skeleton";

import { isoToUnixEpoch } from "@/helpers/isoToUnix";

import { DatabaseProjectsTable } from "@/type";

import styles from "../styles/dashboard/newEntry.module.css";

export function CreateTimeItem(props: any) {
    const projects: DatabaseProjectsTable[] = props.projects;

    const { onOpen, isOpen, onOpenChange } = useDisclosure();

    if (props.skeleton) {
        return (
            <Skeleton>
                <Button>Creat new Time entry</Button>
            </Skeleton>
        )
    };

    function createEntry(e: any) {
        e.preventDefault();

        const data = Object.fromEntries(new FormData(e.currentTarget));

        const name: string = data["name"].toString();
        const project: number = Number(data["project"].toString());
        const startTime: string = data["startTime"].toString();
        const endTime: string = data["endTime"].toString();

        let error: boolean = false;

        fetch("../api/timeEntry", {
            method: "POST",
            body: JSON.stringify({
                "name": name,
                "project": project,
                "start": isoToUnixEpoch(startTime),
                "end": isoToUnixEpoch(endTime)
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
                    title: "Something went wrong creating time entry",
                    description: json["error"]
                });
            };
        })
        .catch(e => {
            console.error(e);

            addToast({
                color: "danger",
                title: "Something went wrong creating time entry",
                description: "More info in developer console"
            });
        });
    };

    if (props.skeleton) {
        return (
            <>
                <Skeleton>
                    <Button>Create Time Entry</Button>
                </Skeleton>
            </>
        );
    };

    return (
        <>
            <Button onPress={onOpen}>Create Time Entry</Button>

            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onclose) => (
                        <>
                            <ModalHeader>Create Time Entry</ModalHeader>
                            
                            <ModalBody>
                                <Form onSubmit={createEntry}>
                                    <Input type="text" name="name" label="Title of this activity" isRequired />

                                    <span className={`${styles.dateGrid}`}>
                                        <DatePicker name="startTime" showMonthAndYearPickers label="Start time" isRequired />
                                        <DatePicker name="endTime" showMonthAndYearPickers label="End time" isRequired />
                                    </span>
                                
                                    <Select name="project" isRequired label="Project">
                                        {projects.map((project: DatabaseProjectsTable) => (
                                            <SelectItem key={project.id}>{project.name}</SelectItem>
                                        ))}
                                    </Select>

                                    <Button color="primary" type="submit" onPress={onclose}>Create Time Entry</Button>
                                </Form>
                            </ModalBody>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
};