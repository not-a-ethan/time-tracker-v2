import { TableBody, TableRow, TableCell } from "@heroui/table";

import { DatabasetimeEntriesTable } from "@/type";

export function EntryRows(props: any) {
    const entries: DatabasetimeEntriesTable[] = props.entries;

    return (
        <TableBody>
            {entries.map((entry: DatabasetimeEntriesTable) => (
                <TableRow>
                    <TableCell>{entry.name}</TableCell>
                    <TableCell>{entry.projectid}</TableCell>
                    <TableCell>{entry.owner}</TableCell>
                    <TableCell>{entry.starttime}</TableCell>
                    <TableCell>{entry.endtime}</TableCell>
                </TableRow>
            ))}
        </TableBody>
    );
};