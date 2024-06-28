/**
 * given a string `text` and a desired `length` (optional), truncate `text` to `length`, appending an ellipses.
 * @param text - Text to be truncated
 * @param length {number} - Truncation length (default: 140)
 * @returns `text` truncated to `length` characters, including additional ellipses.
 */
export const truncate = (text: string, length: number = 138): string => {

    // legnth - 3 (to account for ellipses)
    return text.length > length ? text.slice(0, length - 4).trimEnd() + '...' : text;
}
