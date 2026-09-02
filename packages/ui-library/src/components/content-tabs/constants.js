export const PAGE_SIZE = 2;

export const CONTAINER_CLASS = "yst-flex yst-border yst-border-slate-200";
export const TAB_LIST_CLASS = "yst-w-72 yst-shrink-0 yst-overflow-hidden yst-border-e yst-border-slate-200";

export const PRODUCT_VARIANTS = {
	2: [
		{ id: 1, size: "US 8", availability: "In stock", price: "€95.00" },
		{ id: 2, size: "US 9", availability: "Low stock", price: "€95.00" },
		{ id: 3, size: "US 10", availability: "Out of stock", price: "€99.00" },
	],
};

export const PRODUCT_SPECS = {
	1: [
		{ label: "Material", value: "Leather & mesh" },
		{ label: "Weight", value: "310 g" },
	],
	2: [
		{ label: "Material", value: "Synthetic leather" },
		{ label: "Weight", value: "410 g" },
	],
	3: [
		{ label: "Battery life", value: "30 hours (with case)" },
		{ label: "Connectivity", value: "Bluetooth 5.3" },
	],
};

export const PRODUCTS = [
	{
		id: 1,
		title: "Click me to see a detail panel",
		panelTitle: "Detail panel",
		imageCount: 4,
		missingAltCount: 2,
		price: "€79.00",
		description: "Any description or other data the user needs.",
	},
	{
		id: 2,
		title: "Click me to see a table",
		panelTitle: "Table",
		imageCount: 5,
		missingAltCount: 0,
		price: "€95.00",
		description: "A high-top silhouette inspired by 90s courts, with padded ankle support.",
	},
	{
		id: 3,
		title: "Click me to see a spec sheet",
		panelTitle: "Spec sheet",
		imageCount: 3,
		missingAltCount: 2,
		price: "€59.00",
		description: "Compact true-wireless earbuds with active noise cancellation and a 30-hour battery case.",
	},
	{
		id: 4,
		title: "Click me to see another detail panel",
		panelTitle: "Another detail panel",
		imageCount: 1,
		missingAltCount: 0,
		price: "€18.00",
		description: "A hand-glazed ceramic mug with a wide base, built for pour-over brewing.",
	},
];

/**
 * Which content shape each product's tab drives in the "With multiple" and "With pagination"
 * stories: two freeform detail panels, one table, one spec sheet — demonstrating that the content
 * area isn't tied to a single layout, even across tabs in the same list.
 */
export const CONTENT_TYPE_BY_PRODUCT_ID = {
	1: "detail",
	2: "table",
	3: "specs",
	4: "detail",
};
