"use client";

import { useState } from "react";

import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Modal, ModalContent, ModalBody, ModalHeader, useDisclosure } from "@heroui/modal";
import { Select, SelectItem } from "@heroui/select";
import { Form } from "@heroui/form";
import { DatePicker } from "@heroui/date-picker";
import { addToast } from "@heroui/toast";
import { Skeleton } from "@heroui/skeleton";

import { now, getLocalTimeZone } from "@internationalized/date";

import { isoToUnixEpoch } from "@/helpers/isoToUnix";

import { DatabaseProjectsTable } from "@/type";

export function CreateTimer(props: any) {
    const projects: DatabaseProjectsTable[] = props.projects;
    
    const [currentlyTiming, setCurrentlyTiming] = useState<boolean>(false);
    const [currentId, setCurrentId] = useState<number>(-1);

    const { onOpen, isOpen, onOpenChange } = useDisclosure();

     if (props.skelton) {
        return (
            <Skeleton>
                <Button>Stop Timer</Button>
            </Skeleton>
        );
    };

    function startTimer(e: any) {
        e.preventDefault();

        const data = Object.fromEntries(new FormData(e.currentTarget));
        const name: string = data["name"].toString();
        const project: number = Number(data["project"].toString());
        const startTime: string = data["startTime"].toString();

        setCurrentlyTiming(true);

        let error: boolean = false;

        fetch(`../api/timeEntry`, {
            method: "POST",
            body: JSON.stringify({
                "name": name,
                "project": project,
                "start": isoToUnixEpoch(startTime)
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
                    title: "Something went wrong starting timer",
                    description: json["error"]
                });
            } else {
                setCurrentId(json["id"]);
            };
        })
        .catch(e => {
            console.error(e);

            addToast({
                color: "danger",
                title: "Something went wrong starting timer",
                description: "More info in developer console"
            });
        });
    };

    function stopTimer() {
        let error: boolean = false;

        fetch(`../api/timeEntry`, {
            method: "PUT",
            body: JSON.stringify({
                "id": currentId,
                "endTime": Math.floor(Date.now() / 1000)
            })
        })
        .then(res => {
            if (!res.ok) {
                error = true;
            };

            res.json();
        })
        .then((json: any) => {
            setCurrentId(-1);

            if (error) {
                addToast({
                    color: "danger",
                    title: "Something went wrong stoping timer",
                    description: json["error"]
                });
            };
        })
        .catch(e => {
            console.error(e);

            addToast({
                    color: "danger",
                    title: "Something went wrong stoping timer",
                    description: "More info in developer console"
                });
        });
    };

    function getCurrent() {
        let error: boolean = false;

        fetch("../api/timeEntry/dashboard")
        .then(res => {
            if (!res.ok) {
                error = true;
            };

            res.json();
        })
        .then((json: any) => {
            if (error) {
                addToast({
                    color: "danger",
                    title: "Something went wrong getting current timer info",
                    description: json["error"]
                });
            } else {
                if (json["running"]) {
                    setCurrentId(json["timeId"]);
                    setCurrentlyTiming(true);
                };
            };
        })
        .catch(e => {
            console.error(e);

            addToast({
                color: "danger",
                title: "Something went wrong getting current timer info",
                description: "More info in devleoper console "
            });
        });
    };

    getCurrent();

    return (
        <>
            {currentlyTiming ? (
                <>
                    <Button onPress={stopTimer}>Stop Timer</Button>
                </>
            ) : (
                <>
                    <Button onPress={onOpen}>Start Timer</Button>
                </>
            )}

            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onclose) => (
                        <>
                            <ModalHeader>
                                <h1>Start timer</h1>
                            </ModalHeader>

                            <ModalBody>
                                <Form onSubmit={startTimer}>
                                    <Input type="text" name="name" label="Title of this activity" isRequired />

                                    <DatePicker name="startTime" showMonthAndYearPickers defaultValue={now(getLocalTimeZone())} label="Start time" isRequired />

                                    <Select name="project" isRequired label="Project">
                                        {projects.map((project: DatabaseProjectsTable) => (
                                            <SelectItem key={project.id}>{project.name}</SelectItem>
                                        ))}
                                    </Select>

                                    <Button color="primary" type="submit" onPress={onclose}>Start timer</Button>
                                </Form>
                            </ModalBody>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
};