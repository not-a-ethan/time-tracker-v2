"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Select, SelectItem } from "@heroui/select";
import { Modal, ModalContent, ModalHeader, ModalBody, useDisclosure } from "@heroui/modal";

import { AddCollaberator } from "./addCollabertor";
import { DeleteIcon, EditIcon } from "@/app/components/icons";

import { DatabaseProjectsTable } from "@/type";
import { addToast } from "@heroui/toast";

export function Actions(props: any) {
    const project: DatabaseProjectsTable = props.project;
    const session: any = props.session;
    const userId: number = Number(session.userId);

    const router = useRouter();

    const { isOpen, onOpen, onOpenChange } = useDisclosure();15

    const [deleteEntry, setDelete] = useState<boolean>(false);
    const [editType, setEditType] = useState<string>("name");

    function edit(e: any) {
        e.preventDefault();

        const data = Object.fromEntries(new FormData(e.currentTarget));
        const type: string = data["edit"].toString();

        let error: boolean = false;

        if (type === "name") {
            const newName: string = data["newName"].toString();

            if (!newName || newName.trim().length === 0) {
                addToast({
                    color: "warning",
                    title: "You need a project name"
                });

                return;
            };

            fetch("../../api/projects", {
                method: "PUT",
                body: JSON.stringify({
                    id: project.id,
                    name: newName
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
                        description: json.error
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
        } else if (type === "description") {
            const newDesc: string = data["description"].toString();

            if (!newDesc || newDesc.trim().length === 0) {
                addToast({
                    color: "warning",
                    title: "You need a project description"
                });

                return;
            };

            fetch("../../api/projects", {
                method: "PUT",
                body: JSON.stringify({
                    "id": project["id"],
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
                    title: "Something went wrong changing description",
                    description: "More info in developer console"
                });
            });
        } else if (type === "color") {
            const newColor: string = data["color"].toString();

            if (!newColor || newColor.trim().length) {
                addToast({
                    color: "warning",
                    title: "You need a project color"
                });

                return;
            };

            fetch("../../api/projects", {
                method: "PUT",
                body: JSON.stringify({
                    "id": project.id,
                    "color": newColor
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
                        title: "Something went wrong changing color",
                        description: json.error
                    });
                };
            })
            .catch(e => {
                console.error(e);

                addToast({
                    color: "danger",
                    title: "Something went wrong changing color",
                    description: "More info in developer console"
                });
            });
        };
    };

    function deleteProject(e: any) {
        e.preventDefault();

        let error: boolean = false;

        fetch("../../api/projects", {
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
                    color: "danger",
                    title: "Something went wrong deleting project",
                    description: json["error"]
                });
            } else {
                router.replace("../");
            };
        });
    };
    
    return (
        <>
            <Button onPressStart={() => (setDelete(false))} onPress={onOpen}>
                Edit
                <EditIcon />
            </Button>

            <Button color="danger" onPressStart={() => (setDelete(true))} onPress={onOpen}>
                Delete
                <DeleteIcon />
            </Button>

            {project.owner === userId ? (
                <>
                    <AddCollaberator project={project} />
                </>
            ) : (
                <></>
            )}

            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onclose) => (
                        <>
                            {!deleteEntry ? (
                                <>
                                    <ModalHeader>
                                        <h1>Edit "{project.name}"</h1>
                                    </ModalHeader>

                                    <ModalBody>
                                        <Form onSubmit={edit}>
                                            <Select label="What do you want to edit?" name="edit" defaultSelectedKeys={"name"} isRequired onSelectionChange={(e: any) => {
                                                const type: string = e.values().next().value?.toString(); 
                                                setEditType(type);
                                                }}>
                                                <SelectItem key="name">Name</SelectItem>
                                                <SelectItem key="description">Description</SelectItem>
                                                <SelectItem key="color">Color</SelectItem>
                                            </Select>

                                            {editType === "name" ? (
                                                <>
                                                    <Input type="text" name="newName" label="New project name" isRequired />
                                                </>
                                            ) : (editType === "description" ? (
                                                <>
                                                    <Input type="text" name="description" label="New project description" isRequired />
                                                </>
                                            ) : (
                                                <>
                                                    <label htmlFor="color">New project color:</label>
                                                    <input name="color" type="color" required />
                                                </>
                                            )) }

                                            <Button type="submit" color="primary" onPress={onclose}>Edit</Button>
                                        </Form>
                                    </ModalBody>
                                </>
                            ) : (
                                <>
                                    <ModalHeader>
                                        <h1>Delete "{project.name}"</h1>
                                    </ModalHeader>

                                    <ModalBody>
                                        <Form onSubmit={deleteProject}>
                                            <h2>Delting this project is irreversible</h2>

                                            <Button type="submit" color="primary" onPress={onclose}>Are you sure you want to delete?</Button>
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