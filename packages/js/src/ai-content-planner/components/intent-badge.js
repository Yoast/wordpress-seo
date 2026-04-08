import { __ } from "@wordpress/i18n";
import { BookOpenIcon, StarIcon, MapIcon, ShoppingCartIcon } from "@heroicons/react/outline";

/**
 * Mapping from intent type to badge styling, icon, tooltip and callout colors.
 *
 * Shared between content-suggestions-modal and content-outline-modal.
 */
export const intentBadge = {
	informational: {
		classes: "yst-bg-blue-200 yst-text-blue-900",
		calloutClasses: "yst-bg-blue-50 yst-border-blue-200",
		calloutTextClasses: "yst-text-blue-900",
		Icon: BookOpenIcon,
		label: __( "Informational", "wordpress-seo" ),
		tooltip: __( "The user wants to find an answer to a specific question.", "wordpress-seo" ),
	},
	navigational: {
		classes: "yst-bg-violet-200 yst-text-violet-900",
		calloutClasses: "yst-bg-violet-50 yst-border-violet-200",
		calloutTextClasses: "yst-text-violet-900",
		Icon: MapIcon,
		label: __( "Navigational", "wordpress-seo" ),
		tooltip: __( "The user wants to find a specific page or site.", "wordpress-seo" ),
	},
	commercial: {
		classes: "yst-bg-yellow-200 yst-text-yellow-900",
		calloutClasses: "yst-bg-yellow-50 yst-border-yellow-200",
		calloutTextClasses: "yst-text-yellow-900",
		Icon: StarIcon,
		label: __( "Commercial", "wordpress-seo" ),
		tooltip: __( "The user wants to investigate brands or services.", "wordpress-seo" ),
	},
	transactional: {
		classes: "yst-bg-green-200 yst-text-green-900",
		calloutClasses: "yst-bg-green-50 yst-border-green-200",
		calloutTextClasses: "yst-text-green-900",
		Icon: ShoppingCartIcon,
		label: __( "Transactional", "wordpress-seo" ),
		tooltip: __( "The user wants to complete an action (conversion).", "wordpress-seo" ),
	},
};
