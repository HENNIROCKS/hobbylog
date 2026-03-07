import { fetchPages } from '$lib/api';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	try {
		const pages = await fetchPages(fetch);
		return { pages };
	} catch (e) {
		console.warn('KQL API unavailable:', e);
		return { pages: [] };
	}
};
