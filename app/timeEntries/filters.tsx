"use client";

import { Select, SelectItem } from "@heroui/select";
import { Skeleton } from "@heroui/skeleton";
import { DateRangePicker } from "@heroui/date-picker";

import { getAPI } from "@/helpers/getAPI";

import { DatabaseProjectsTable, DatabasetimeEntriesTable } from "@/type";

export function Filters(props: any) {
    const filters = props.filters;
    const setFilters = props.setFilters;

    const { json, jsonError, jsonLoading } = getAPI("../api/projects", ["json", "jsonError", "jsonLoading"]);

    if (jsonLoading) {
        return (
            <>
                <Select>
                    <Skeleton>
                        <SelectItem>Some amazing filter</SelectItem>
                        <SelectItem>Another amazing filter</SelectItem>
                    </Skeleton>
                </Select>

                <Skeleton>
                    <DateRangePicker label="Time range" showMonthAndYearPickers />
                </Skeleton>
            </>
        );
    };

    if (jsonError) {
        console.error(jsonError["error"])

        return (
            <>
                <Select>
                    <Skeleton>
                        <SelectItem>Some amazing filter</SelectItem>
                        <SelectItem>Another amazing filter</SelectItem>
                    </Skeleton>
                </Select>

                <Skeleton>
                    <DateRangePicker label="Time range" showMonthAndYearPickers />
                </Skeleton>
            </>
        );
    };

    return (
        <>
            <p>hellow</p>
        </>
    );

    const projects: DatabaseProjectsTable[] = json["projects"];

    function updateProjectFilter(e: any) {
        e.preventDefault();

        console.log(e);

        try {
            const data = Object.fromEntries(new FormData(e.currentTarget));
            
            console.log(data);
        } catch (e) {
            console.error(e);
        };
    };

    return (
        <>
            <Select onChange={updateProjectFilter} selectionMode="multiple">
                {projects.map((project: DatabaseProjectsTable) => (
                    <SelectItem key={project["id"]}>{project["name"]}</SelectItem>
                ))}
            </Select>

            <DateRangePicker label="Time Range" showMonthAndYearPickers />
        </>
    );
};