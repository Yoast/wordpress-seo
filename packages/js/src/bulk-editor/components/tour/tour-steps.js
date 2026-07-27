import { __ } from "@wordpress/i18n";

/**
 * The bulk editor guided-tour steps, in order.
 *
 * Each step points at an element carrying the matching `data-tour-id`. `requiresSelection` marks a step whose
 * target only exists once rows are selected, so the tour selects rows before showing it.
 *
 * @returns {Array<Object>} The tour steps.
 */
export const getTourSteps = () => [
	{
		id: "bulk-editor-tour-content-type",
		tourId: "content-type-nav",
		highlightEndSelector: "[data-tour-highlight-end]",
		position: "right",
		title: __( "Select your content type", "wordpress-seo" ),
		content: __( "This will refine the content to what you want to update.", "wordpress-seo" ),
	},
	{
		id: "bulk-editor-tour-appearance",
		tourId: "appearance-tabs",
		position: "right",
		title: __( "Select search or social appearance", "wordpress-seo" ),
		content: __( "Easily switch between them anytime.", "wordpress-seo" ),
	},
	{
		id: "bulk-editor-tour-multi-select",
		tourId: "selection-toolbar",
		highlightChildren: true,
		position: "right",
		title: __( "Multi-select", "wordpress-seo" ),
		content: __( "Choose the rows you want to update. Use the dropdown for additional options.", "wordpress-seo" ),
	},
	{
		id: "bulk-editor-tour-generate",
		tourId: "generate-actions",
		highlightChildren: true,
		position: "right",
		requiresSelection: true,
		title: __( "Get SEO-friendly options at scale", "wordpress-seo" ),
		content: __( "Generate up to 20 results at a time. Great for website refreshes!", "wordpress-seo" ),
	},
];
