import fs from 'node:fs/promises';
import YAML from 'yaml';

interface Version {
	id: string;
	data: Map<string, string>;
}

export class VersionedStorage {
	#currentData: Map<string, string> = new Map();
	#history: Version[] = [];
	#hasChanges = false;

	constructor(
		private prefix: string,
		private filePath?: string,
	) {}

	set(key: string, value: string) {
		this.#currentData.set(key, value);
		this.#hasChanges = true;
	}

	remove(key: string) {
		if (this.#currentData.has(key)) {
			this.#currentData.delete(key);
			this.#hasChanges = true;
		}
	}

	commit() {
		if (!this.#hasChanges) {
			return;
		}
		this.#history.push({
			id: [this.prefix, this.#history.length].join('#'),
			data: new Map(this.#currentData),
		});
		this.#hasChanges = false;
	}

	getAll(versionId: string): Map<string, string> {
		if (versionId === undefined) {
			return new Map(this.#currentData);
		}
		const version = this.#history.find(item => item.id === versionId);
		if (!version) {
			throw new Error(`Version "${versionId}" not found`);
		}
		return new Map(version.data);
	}

	latestId(): string | null {
		const version = this.#history[this.#history.length - 1];
		return version ? version.id : null;
	}

	async save() {
		if (!this.filePath) {
			throw new Error();
		}
		const history = this.#history.map(version => ({
			id: version.id,
			data: serializeMap(version.data),
		}));
		const text = YAML.stringify(history);
		await fs.writeFile(this.filePath, text, 'utf8');
	}

	async load() {
		if (!this.filePath) {
			throw new Error();
		}
		const text = await fs.readFile(this.filePath, 'utf8');
		const rows = YAML.parse(text) as any[];
		this.#history = rows.map(version => ({
			id: version.id,
			data: deserializeMap(version.data),
		}));
	}
}

function serializeMap<K, V>(map: Map<K, V>) {
	return Array.from(map).map(([key, value]) => ({ key, value }));
}

function deserializeMap<K, V>(objects: { key: K, value: V }[]): Map<K, V> {
	return new Map(objects.map(item => [item.key, item.value]));
}
