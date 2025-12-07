"use client";

import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { addToast } from "@heroui/toast";

import styles from "../styles/account/name.module.css";

export function ChangeName() {
    function handleChange(e: any) {
        e.preventDefault();

        const data = Object.fromEntries(new FormData(e.currentTarget));
        const newName: string = data["name"].toString();

        if (!newName || newName.trim().length === 0) {
            addToast({
                color: "warning",
                title: "You need a valid name",
            });

            return;
        };

        let error: boolean = false;

        fetch("../api/account", {
            method: "PUT",
            body: JSON.stringify({
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
                title: "Somethign went wrong changing name",
                description: "More info in developer console"
            });
        });
    };

    return (
        <div className={`${styles.component}`}>
            <Form onSubmit={handleChange}>
                <Input type="text" isRequired label="New name" name="name" className={`${styles.input}`} />

                <Button type="submit" color="primary">Change name</Button>
            </Form>
        </div>
    );
};