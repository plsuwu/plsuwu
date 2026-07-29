import dayjs from "dayjs";

export function getTimestampParts(ts: Date) {
	const date = dayjs(ts);
	return {
		day: date.date(),
		month: date.month(),
		year: date.year(),
	};
}

