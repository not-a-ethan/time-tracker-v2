"use client";

import { Select, SelectItem } from "@heroui/select";
import { Skeleton } from "@heroui/skeleton";
import { DateRangePicker } from "@heroui/date-picker";

import { getAPI } from "@/helpers/getAPI";

import { DatabaseProjectsTable, TimeEntryFilters } from "@/type";

import styles from "../styles/timeEntries/filters.module.css";

export function Filters(props: any) {
    const filters: TimeEntryFilters = props.filters;
    const setFilters = props.setFilters;

    const { json, jsonError, jsonLoading } = getAPI("../api/projects", ["json", "jsonError", "jsonLoading"]);

    if (jsonLoading) {
        return (
            <>
                <Skeleton>
                    <Select>
                        <SelectItem key="one">Some amazing filter</SelectItem>
                        <SelectItem key="two">Another amazing filter</SelectItem>
                    </Select>
                </Skeleton>

                <Skeleton>
                    <DateRangePicker label="Time range" showMonthAndYearPickers />
                </Skeleton>
            </>
        );
    };

    if (jsonError) {
        console.error(jsonError["error"]);

        return (
            <>
                <Skeleton>
                    <Select>
                    
                        <SelectItem key="one">Some amazing filter</SelectItem>
                        <SelectItem key="two">Another amazing filter</SelectItem>
                    
                    </Select>
                </Skeleton>

                <Skeleton>
                    <DateRangePicker label="Time range" showMonthAndYearPickers />
                </Skeleton>
            </>
        );
    };

    const projects: DatabaseProjectsTable[] = json["projects"];

    function updateProjectFilter(e: any) {
        const vals: string[] = e.target.value.split(",");

        const newFilters = filters;

        newFilters.project = vals;

        setFilters(newFilters);
    };

    function updateTimeFilter(e: any) {
        const start: Date = new Date(e.start.year, e.start.month, e.start.day);
        const end: Date = new Date(e.end.year, e.end.month, e.end.day);

        const newFilters = filters;

        newFilters.time.start = Date.parse(start.toString());
        newFilters.time.end = Date.parse(end.toString());

        setFilters(newFilters);
    };

    return (
        <div className={`${styles.component}`}>
            <Select onChange={updateProjectFilter} selectionMode="multiple" label="Projects" className={`${styles.project}`}>
                {projects.map((project: DatabaseProjectsTable) => (
                    <SelectItem key={project["id"]}>{project["name"]}</SelectItem>
                ))}
            </Select>

            <DateRangePicker label="Time Range" showMonthAndYearPickers  onChange={updateTimeFilter} className={`${styles.date}`} />
        </div>
    );
};