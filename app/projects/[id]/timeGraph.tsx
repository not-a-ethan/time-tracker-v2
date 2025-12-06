import dynamic from "next/dynamic";

import { Skeleton } from "@heroui/skeleton";

import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";

import { getAPI } from "@/helpers/getAPI";

import { DatabaseProjectsTable, DatabasetimeEntriesTable } from "@/type";

Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Line = dynamic(() => import('react-chartjs-2').then((mod) => mod.Line), {
  ssr: false,
});

export function ProjectTimeChart(props: any) {
    const project: DatabaseProjectsTable = props.project;

    const { json, jsonError, jsonLoading } = getAPI(`../../api/timeEntry?projectId=${project["id"]}`, ["json", "jsonError", "jsonLoading"]);

    if (props.skeleton) {
        return (
            <>
            
            </>
        );
    };

    if (jsonLoading) {
        return (
            <>
            
            </>
        );
    };

    if (jsonError) {
        console.error(jsonError["message"]);

        return (
            <>
            
            </>
        );
    };

    const timeEntries: DatabasetimeEntriesTable[] = json["items"];

    const today = new Date();
    const end = (Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()) / 1000);

    const days = {
        "0": 0,
        "1": 0,
        "2": 0,
        "3": 0,
        "4": 0,
        "5": 0,
        "6": 0
    };

    for (let i = 0; i < timeEntries.length; i++) {
        const thisEntry: DatabasetimeEntriesTable = timeEntries[i];

        if (thisEntry.endtime === null) {
            continue;
        };

        const date = new Date(thisEntry.starttime * 1000);
        const start = (Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 1000);

        const diffDays = Math.abs((start - end) / 86400) // 86400 is the number of seconds in one day
        
        if (diffDays >= 7) {
            break;
        };

        if (diffDays === 0) {
            days["0"] = days["0"] + (thisEntry.endtime - thisEntry.starttime) / 60;
        } else if (diffDays === 1) {
            days["1"] = days["1"] + (thisEntry.endtime - thisEntry.starttime) / 60;
        } else if (diffDays === 2) {
            days["2"] = days["2"] + (thisEntry.endtime - thisEntry.starttime) / 60;
        } else if (diffDays === 3) {
            days["3"] = days["3"] + (thisEntry.endtime - thisEntry.starttime) / 60;
        } else if (diffDays === 4) {
            days["4"] = days["4"] + (thisEntry.endtime - thisEntry.starttime) / 60;
        } else if (diffDays === 5) {
            days["5"] = days["5"] + (thisEntry.endtime - thisEntry.starttime) / 60;
        } else if (diffDays === 6) {
            days["6"] = days["6"] + (thisEntry.endtime - thisEntry.starttime) / 60;
        };
    };

    const dates: string[] = [];

    for (let i = 0; i < 7; i++) {
        dates.push(`${today.getMonth()}-${today.getDate() - 1}-${today.getFullYear()}`);
        
        today.setDate(today.getDate() -1);
    };

    const data = {
        labels: dates.reverse(),
        datasets: [
            {
                label: "Minutes Tracked",
                data: Object.values(days).reverse(), // Array of minute values.
                fill: true,
                borderColor: "rgba(255, 255, 255)",
                tension: .4
            }
        ]
    };

    const options = {
        scales: {
            y: {
                "min": 0
            }
        }
    };

    return (
        <Line data={data} options={options} />
    );
}; 