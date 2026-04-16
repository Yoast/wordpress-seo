import { __ } from "@wordpress/i18n";
import { BookOpenIcon, StarIcon, MapIcon } from "@heroicons/react/outline";
import classNames from "classnames";
import { Badge, useSvgAria } from "@yoast/ui-library";

/**
 * Mapping from intent type to badge styling and icon.
 *
 * Shared between content-suggestions-modal and content-outline-modal.
 */
const intentBadgeProps = {
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

/**
 *
 * @param {object} props The component props.
 * @param {string} props.intent The intent type (e.g. "informational").
 * @returns {JSX.Element|null} The IntentBadge component.
 */
export const IntentBadge = ( { intent } ) => {
	const badge = intentBadgeProps[ intent ];
	const Icon = badge ? badge.Icon : BookOpenIcon;
	const svgAriaProps = useSvgAria();

	if ( ! badge ) {
		return <Badge>{ intent }</Badge>;
	}
	return <Badge className={ classNames( "yst-flex yst-items-center yst-gap-1 yst-w-fit", badge.classes ) }>
		<Icon className={ classNames( "yst-w-3", badge.classes ) } { ...svgAriaProps } /> { badge.label }
	</Badge>;
};
