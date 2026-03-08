export const t = {
	// Navigation
	allCollections: 'All Collections',
	backToAllCollections: '← All Collections',

	// Empty states
	noCollectionsFound: 'No collections found.',
	noMiniaturesFound: 'No miniatures found.',

	// Tabs
	collection: 'Collection',
	wishlist: 'Wishlist',
	uncategorized: 'Uncategorized',
	onWishlist: 'on Wishlist',

	// Paint status
	painted: 'Painted',
	unpainted: 'Unpainted',
	paintedOnly: 'Painted only',

	// Sections
	paintingQueue: 'Painting Queue',
	paintingQueueDesc: 'Unpainted entries across all collections, sorted by count.',
	factions: 'Factions',

	// Filters
	search: 'Search…',
	all: 'All',
	genre: 'Genre',
	faction: 'Faction',

	// Sort
	sortBy: 'Sort by',
	sortName: 'Name (A–Z)',
	sortAmount: 'Amount',
	sortUnpaintedFirst: 'Unpainted first',

	// View toggle
	cards: 'Cards',
	table: 'Table',

	// Table columns
	originalName: 'German Name',
	amount: 'Amount',
	images: 'Images',
	paintedOn: 'Painted on',

	// DonutChart
	of: 'of',

	// Dynamic
	showImagesOf: (name: string) => `Show images of ${name}`,
	miniatureCount: (count: number, collections: number) =>
		`${count} ${count === 1 ? 'miniature' : 'miniatures'} in ${collections} ${collections === 1 ? 'collection' : 'collections'}`
} as const;
