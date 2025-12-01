"use client";

import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Modal, ModalContent, ModalBody, useDisclosure, ModalHeader } from "@heroui/modal";
import { Form } from "@heroui/form";
import { addToast } from "@heroui/toast";
import { Skeleton } from "@heroui/skeleton";

export function CreateProject(props: any) {
    const { onOpen, isOpen, onOpenChange } = useDisclosure();

    if (props.skelton) {
        return (
            <Skeleton>
                <Button>Create Project</Button>
            </Skeleton>
        );
    };

    function createProject(e: any) {
        e.preventDefault();

        const data = Object.fromEntries(new FormData(e.currentTarget));
        const name: string = data["name"].toString();
        const color: string = data["color"].toString();

        let error: boolean = false;

        fetch(`../api/projects`, {
            method: "POST",
            body: JSON.stringify({
                "name": name,
                "color": color
            })
        })
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
                    title: "Something went wrong creating project",
                    description: json["error"]
                });
            };
        })
        .catch(e => {
            console.error(e);

            addToast({
                color: "danger",
                title: "Something went wrong creating project",
                description: "More info in developer console"
            });
        });
    };

    return (
        <>
            <Button onPress={onOpen}>Create Project</Button>

            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onclose) => (
                        <>
                            <ModalHeader>
                                <h1>Create Project</h1>
                            </ModalHeader>

                            <ModalBody>
                                <Form onSubmit={createProject}>
                                    <Input type="text" name="name" label="Project name" isRequired />

                                    <label htmlFor="color">Project color</label>
                                    <input type="color" name="color" required />

                                    <Button type="submit" color="primary">Create project</Button>
                                </Form>
                            </ModalBody>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
};