"use client";

import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import { addToast } from "@heroui/toast";
import { Modal, ModalContent, ModalHeader, ModalBody, useDisclosure } from "@heroui/modal";
import { Button } from "@heroui/button";

import { DatabaseProjectsTable } from "@/type";

export function AddCollaberator(props: any) {
    const project: DatabaseProjectsTable = props.project;
    
    const { isOpen, onOpen, onOpenChange} = useDisclosure();

    function addCollaberator(e: any) {
        e.preventDefault();

        const data = Object.fromEntries(new FormData(e.currentTarget));
        const username: string|undefined|null = data["username"].toString();

        if (!username || username.trim().length === 0) {
            addToast({
                color: "warning",
                title: "You need to enter a username"
            });

            return;
        };

        let error: boolean = false;

        fetch(`../../api/projects/collaberator`, {
            method: "PUT",
            body: JSON.stringify({
                "id": project["id"],
                "username": username.trim()
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
                    title: "Something went wrong adding collaberator",
                    description: json["error"]
                });
            };
        })
        .catch(e => {
            console.error(e);

            addToast({
                color: "danger",
                title: "Something went wrong adding collaberator",
                description: "More info in developer console"
            });
        });
    };

    return (
        <>
            <Button onPress={onOpen}>Add collabertor</Button>

            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onclose) => (
                        <>
                            <ModalHeader>
                                <h1>Add collaberator</h1>
                            </ModalHeader>

                            <ModalBody>
                                <Form onSubmit={addCollaberator}>
                                    <Input type="text" label="username of user to add" isRequired name="username" />

                                    <Button type="submit" color="primary" onPress={onclose}>Add collaberator</Button>
                                </Form>
                            </ModalBody>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
};