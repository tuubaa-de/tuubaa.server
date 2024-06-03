class Deque<T> {
	private readonly items: T[];

	constructor() {
		this.items = [];
	}

	pushFront(item: T): void {
		this.items.unshift(item);
	}

	pushBack(item: T): void {
		this.items.push(item);
	}

	pushAt(index: number, item: T): void {
		this.items.splice(index, 0, item);
	}

	popFront(): T | undefined {
		return this.items.shift();
	}

	popBack(): T | undefined {
		return this.items.pop();
	}

	popAt(index: number): T | undefined {
		return this.items.splice(index, 1)[0];
	}

	peekFront(): T | undefined {
		return this.items[0];
	}

	peekBack(): T | undefined {
		return this.items[this.items.length - 1];
	}

	peekAt(index: number): T | undefined {
		return this.items[index];
	}

	isEmpty(): boolean {
		return this.items.length === 0;
	}

	size(): number {
		return this.items.length;
	}
}