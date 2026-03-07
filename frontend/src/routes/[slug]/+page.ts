import { fetchPage } from '$lib/api';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, params }) => {
	try {
		const page = await fetchPage(params.slug, fetch);
		if (!page) error(404, 'Seite nicht gefunden');
		return { page };
	} catch (e) {
		error(500, 'KQL API nicht erreichbar');
	}
};
