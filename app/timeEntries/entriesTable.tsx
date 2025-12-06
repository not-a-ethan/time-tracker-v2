import { useEffect } from "react";

import { Table, TableBody, TableHeader, TableRow, TableColumn, TableCell } from "@heroui/table";

import { EntryRows } from "./entryRow";

import { DatabasetimeEntriesTable, TimeEntryFilters } from "@/type";

export function EntriesTable(props: any) {
    const filters: TimeEntryFilters = props.filters;
    const allEntries: DatabasetimeEntriesTable[] = props.entries;
    
    let filteredEntries: DatabasetimeEntriesTable[] = allEntries.filter(entry => 
        filters.project.includes(entry.projectid.toString()) && filters.time.end >= (entry.endtime || Date.now()) && filters.time.start <= entry.starttime
    );

    if (JSON.stringify(filters) === JSON.stringify({project: [""], time: {start: 0, end: 20000000000}})) {
        filteredEntries = allEntries;
    };

    useEffect(() => {
        filteredEntries = allEntries.filter(entry => 
            filters.project.includes(entry.projectid.toString()) && filters.time.end >= (entry.endtime || Date.now()) && filters.time.start <= entry.starttime
        );

        if (JSON.stringify(filters) === JSON.stringify({project: [""], time: {start: 0, end: 20000000000}})) {
            filteredEntries = allEntries;
        };
    }, [props])

    if (filteredEntries.length === 0) {
        return (
            <Table>
                <TableHeader>
                    <TableColumn>Name</TableColumn>
                    <TableColumn>Project</TableColumn>
                    <TableColumn>Owner</TableColumn>
                    <TableColumn>Start time</TableColumn>
                    <TableColumn>End Time</TableColumn>
                </TableHeader>

                <TableBody>
                    <TableRow>
                        <TableCell>No Entries that fit filters</TableCell>
                        <TableCell> </TableCell>
                        <TableCell> </TableCell>
                        <TableCell> </TableCell>
                        <TableCell> </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        );
    };

    return (
        <Table>
            <TableHeader>
                <TableColumn>Name</TableColumn>
                <TableColumn>Project</TableColumn>
                <TableColumn>Owner</TableColumn>
                <TableColumn>Start time</TableColumn>
                <TableColumn>End Time</TableColumn>
            </TableHeader>

            {EntryRows({entries: filteredEntries})}
        </Table>
    );
};