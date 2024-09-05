export function sleep(ms: number) {
	return new Promise((resolve) => {
		setTimeout(resolve, ms);
	});
}

export function emotes(content: string) {
	return content.match(/<a?:.+?:\d{17,21}>|\p{Extended_Pictographic}/gu);
}

export function compareLists<T>(
	list1: T[],
	list2: T[]
): { removed: T[]; added: T[] } {
	const set1 = new Set(list1);
	const set2 = new Set(list2);

	const removed = list1.filter((item) => !set2.has(item));
	const added = list2.filter((item) => !set1.has(item));

	return {removed, added};
}
