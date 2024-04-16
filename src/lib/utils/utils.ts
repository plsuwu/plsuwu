// async network delay
export const sleep = async (ms: number) => {
    return new Promise((r) => setTimeout(r, ms));
};

export function truncate(str: string, n: number) {
    return str.length > n ? str.slice(0, n - 1).trimEnd() + '...' : str;
}

export const slugFromPath = (path: string) =>
    path.match(/([\w-]+)\.(svelte\.md|md|svx)/i)?.[1] ?? null;

export function elapsedTime(date: number) {
    const now = new Date().getTime();
    const seconds = Math.floor((now - date) / 1000);
    const intervals = [
        { seconds: 31536000, unit: 'year' },
        { seconds: 2592000, unit: 'month' },
        { seconds: 86400, unit: 'day' },
        { seconds: 3600, unit: 'hour' },
    ];

    for (let i = 0; i < intervals.length; i++) {
        const interval = intervals[i];
        const count = Math.floor(seconds / interval.seconds);
        if (count >= 1) {
            return `${count} ${interval.unit}${count === 1 ? '' : 's'} ago`;
        }
    }

    return 'just now';
}
