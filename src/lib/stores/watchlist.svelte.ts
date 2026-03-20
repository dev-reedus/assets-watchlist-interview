const STORAGE_KEY = 'asset-watchlist';

function createWatchlistStore() {
	// Initialize from localStorage
	const initial: string[] = (() => {
		// check for localStorage (SSR safe)
		if (typeof localStorage === 'undefined') return [];
		try {
			const raw = localStorage.getItem(STORAGE_KEY);
			return raw ? JSON.parse(raw) : [];
		} catch {
			return [];
		}
	})();

	let ids = $state<string[]>(initial);

	// Persist to localStorage
	function persist() {
		if (typeof localStorage !== 'undefined') {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
		}
	}

	return {
		get ids() {
			return ids;
		},

		has(id: string): boolean {
			return ids.includes(id);
		},

		add(id: string) {
			if (!ids.includes(id)) {
				ids = [...ids, id];
				persist();
			}
		},

		remove(id: string) {
			ids = ids.filter((i) => i !== id);
			persist();
		},

		toggle(id: string) {
			if (ids.includes(id)) {
				this.remove(id);
			} else {
				this.add(id);
			}
		},

		get count() {
			return ids.length;
		}
	};
}

export const watchlist = createWatchlistStore();
