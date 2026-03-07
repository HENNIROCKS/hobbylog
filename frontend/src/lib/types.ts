export interface MiniatureImage {
	url: string;
	thumb: string;
}

export interface Miniature {
	name: string;
	original_name: string;
	genre: 'fantasy' | 'scifi' | '';
	faction_fantasy: string[];
	faction_scifi: string[];
	categories_fantasy: string[];
	categories_scifi: string[];
	amount: number;
	wished: boolean;
	converted: boolean;
	painted: boolean;
	painted_on: string;
	base_size: string[];
	material: string[];
	company: string[];
	special_miniature: boolean;
	notes: string;
	images: MiniatureImage[];
}

export interface CollectionPage {
	id: string;
	title: string;
	subtitle: string;
	slug: string;
	paint_progress: boolean;
	miniatures: Miniature[];
}
