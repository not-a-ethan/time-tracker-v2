import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function getAPI(url: string, returnVals: string[]) {
    const { data, error, isLoading } = useSWR(url, fetcher);

    return {
        [returnVals[0]]: data,
        [returnVals[1]]: error,
        [returnVals[2]]: isLoading
    };
};