// Credit for the funtion to gpt-oss on my computer

export function isoToUnixEpoch(iso: string): number {
    const cleaned = iso.replace(/\[.*\]$/, '');
    const msSinceEpoch = Date.parse(cleaned);

    if (isNaN(msSinceEpoch)) {
        return -1;
    };

    return Math.floor(msSinceEpoch / 1000);
};