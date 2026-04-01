import { __ } from "@wordpress/i18n";
import { BookOpenIcon, StarIcon, MapIcon } from "@heroicons/react/outline";

/**
 * Mapping from intent type to badge styling and icon.
 *
 * Shared between content-suggestions-modal and content-outline-modal.
 */
export const intentBadge = {
	informational: {
		classes: "yst-bg-blue-200 yst-text-blue-900",
		Icon: BookOpenIcon,
		label: __( "Informational", "wordpress-seo" ),
	},
	navigational: {
		classes: "yst-bg-violet-200 yst-text-violet-900",
		Icon: MapIcon,
		label: __( "Navigational", "wordpress-seo" ),
	},
	commercial: {
		classes: "yst-bg-yellow-200 yst-text-yellow-900",
		Icon: StarIcon,
		label: __( "Commercial", "wordpress-seo" ),
	},
};
