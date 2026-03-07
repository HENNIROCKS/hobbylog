import { PUBLIC_KIRBY_URL } from '$env/static/public';
import type { CollectionPage } from './types';

const MINIATURE_SELECT = {
	name: true,
	name_german: true,
	genre: true,
	faction_fantasy: 'structureItem.faction_fantasy.split',
	faction_scifi: 'structureItem.faction_scifi.split',
	categories_fantasy: 'structureItem.categories_fantasy.split',
	categories_scifi: 'structureItem.categories_scifi.split',
	amount: 'structureItem.amount.toInt',
	wished: 'structureItem.wished.toBool',
	converted: 'structureItem.converted.toBool',
	painted: 'structureItem.painted.toBool',
	painted_on: true,
	base_size: 'structureItem.base_size.split',
	material: 'structureItem.material.split',
	company: 'structureItem.company.split',
	special_miniature: 'structureItem.special_miniature.toBool',
	notes: true,
	images: {
		query: 'structureItem.images.toFiles',
		select: {
			url: true,
			thumb: 'file.crop(500).url'
		}
	}
};

const PAGE_SELECT = {
	id: true,
	title: true,
	subtitle: true,
	slug: true,
	paint_progress: 'page.paint_progress.toBool',
	miniatures: {
		query: 'page.miniatures.toStructure',
		select: MINIATURE_SELECT
	}
};

async function kql(fetchFn: typeof fetch, body: object): Promise<unknown> {
	const response = await fetchFn(`${PUBLIC_KIRBY_URL}/api/query`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(body)
	});
	if (!response.ok) {
		throw new Error(`KQL API error: ${response.status} ${response.statusText}`);
	}
	const data = await response.json();
	return data.result;
}

export async function fetchPages(fetchFn: typeof fetch = fetch): Promise<CollectionPage[]> {
	const result = await kql(fetchFn, {
		query: 'site.children.listed.sortBy("title", "asc")',
		select: PAGE_SELECT
	});
	return (result as CollectionPage[]) ?? [];
}

export async function fetchPage(slug: string, fetchFn: typeof fetch = fetch): Promise<CollectionPage | null> {
	const result = await kql(fetchFn, {
		query: `page('${slug}')`,
		select: PAGE_SELECT
	});
	return (result as CollectionPage) ?? null;
}
