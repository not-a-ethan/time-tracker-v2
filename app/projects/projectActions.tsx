"use client";

import { useState } from "react";

import { Button } from "@heroui/button";
import { Modal, ModalContent, ModalHeader, ModalBody, useDisclosure } from "@heroui/modal";
import { addToast } from "@heroui/toast";
import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";

import { EditIcon, DeleteIcon } from "../components/icons";

import { DatabaseProjectsTable } from "@/type";

export function EditButton(props: any) {
    const project: DatabaseProjectsTable = props.project;

    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    
    const [editDesc, setEditDesc] = useState<boolean>(false);

    function editName(e: any) {
        e.preventDefault();

        const data = Object.fromEntries(new FormData(e.currentTarget));
        const newName: string = data["name"].toString();

        let error: boolean = false;

        fetch("../api/projects", {
            method: "PUT",
            body: JSON.stringify({
                "id": project.id,
                "name": newName
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
    };

    function editDescription(e: any) {
        e.preventDefault();

        const data = Object.fromEntries(new FormData(e.currentTarget));
        const newDesc: string = data["description"].toString();

        let error: boolean = false;

        fetch("../api/projects", {
            method: "PUT",
            body: JSON.stringify({
                "id": project.id,
                "description": newDesc
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
                    title: "Something went wrong changing description",
                    description: json["error"]
                });
            };
        })
        .catch(e => {
            console.error(e);

            addToast({
                color: "danger",
                title: "Somethign went wrong changing description",
                description: "More info in developer console"
            });
        });
    };

    return (
        <>
            <Button isIconOnly onPress={onOpen}>
                <EditIcon />
            </Button>

            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onclose) => (
                        <>
                            <Select label="What do you want to edit?" defaultSelectedKeys={["name"]} selectionMode="single">
                                <SelectItem key="name" onClick={() => {setEditDesc(false)}}>Name</SelectItem>
                                <SelectItem key="desc" onClick={() => {setEditDesc(true)}}>Description</SelectItem>
                            </Select>

                            {editDesc ? (
                                <>
                                    <ModalHeader>
                                        <h1>Edit Description</h1>
                                    </ModalHeader>

                                    <ModalBody>
                                        <Form onSubmit={editDescription}>
                                            <Input type="text" name="description" isRequired defaultValue={project.description || ""} />

                                            <Button color="primary" type="submit" onPress={onclose}>Change Description</Button>
                                        </Form>
                                    </ModalBody>
                                </>
                            ) : (
                                <>
                                    <ModalHeader>
                                        <h1>Edit Project Name</h1>
                                    </ModalHeader>

                                    <ModalBody>
                                        <Form onSubmit={editName}>
                                            <Input type="text" isRequired defaultValue={project.name} name="name" />

                                            <Button color="primary" type="submit" onPress={onclose}>Change name</Button>
                                        </Form>
                                    </ModalBody>
                                </>
                            )}
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
};

export function DeleteButton(props: any) {
    const project: DatabaseProjectsTable = props.project;

    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    function deleteProject() {
        let error: boolean = false;

        fetch("../api/projects", {
            method: "DELETE",
            body: JSON.stringify({
                "id": project["id"]
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
                    "color": "danger",
                    "title": "Something went wrong deleting project",
                    "description": json["error"]
                });
            };
        })
        .catch(e => {
            console.error(e);

            addToast({
                "color": "danger",
                "title": "Something went wrong deleting project",
                "description": "More info in developer console"
            });
        });
    };

    return (
        <>
            <Button isIconOnly color="danger" onPress={onOpen}>
                <DeleteIcon />
            </Button>

            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onclose) => (
                        <>
                            <ModalHeader>
                                <h1>Delete Project</h1>
                            </ModalHeader>

                            <ModalBody>
                                <h2>THIS IS IRVERSABLE</h2>

                                <Button color="danger" onPress={deleteProject} onPressEnd={onclose}>DELETE PROJECT</Button>
                            </ModalBody>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
};