export const thisIterInParams = (iter: Record<string, string | null>, params: URLSearchParams) => {
    let res: boolean = false;
    Object.entries(iter).forEach(([k, v]) => {
        res = params.has(k, v as string);
    });

    return res;
};
