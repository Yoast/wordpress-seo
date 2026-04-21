import { __ } from "@wordpress/i18n";
import { BookOpenIcon, StarIcon, MapIcon, ShoppingCartIcon } from "@heroicons/react/outline";
import classNames from "classnames";
import { Badge, Tooltip, useSvgAria } from "@yoast/ui-library";
import { useCallback, useId, useState } from "@wordpress/element";

/**
 * Mapping from intent type to badge styling, icon, tooltip and callout colors.
 *
 * Shared between content-suggestions-modal and content-outline-modal.
 */
export const intentBadgeProps = {
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

/**
 * Intent badge with a hover tooltip describing the intent type.
 *
 * @param {object} props The component props.
 * @param {string} props.intent The intent type (e.g. "informational").
 * @param {string} [props.className] Additional class names to apply to the badge.
 * @param {string} [props.tooltipPosition] Position of the tooltip. Defaults to "top-right".
 *
 * @returns {JSX.Element|null} The IntentBadge component.
 */
export const IntentBadge = ( { intent, className, tooltipPosition = "top-right" } ) => {
	const badge = intentBadgeProps[ intent ];
	const svgAriaProps = useSvgAria();
	const [ isTooltipVisible, setIsTooltipVisible ] = useState( false );
	const handleMouseEnter = useCallback( () => setIsTooltipVisible( true ), [] );
	const handleMouseLeave = useCallback( () => setIsTooltipVisible( false ), [] );
	const uniqueId = useId();
	const tooltipId = `intent-tooltip-${ intent }-${ uniqueId }`;

	if ( ! badge ) {
		return <Badge>{ intent }</Badge>;
	}

	const { Icon } = badge;
	return (
		<Badge
			className={ classNames( "yst-relative yst-flex yst-items-center yst-gap-1 yst-w-fit yst-cursor-default", badge.classes, className ) }
			aria-describedby={ isTooltipVisible ? tooltipId : null }
			onMouseEnter={ handleMouseEnter }
			onMouseLeave={ handleMouseLeave }
		>
			<Icon className={ classNames( "yst-w-3", badge.classes ) } { ...svgAriaProps } /> { badge.label }
			{ isTooltipVisible && <Tooltip id={ tooltipId } className="yst-max-w-48 yst-z-50 yst-text-center" position={ tooltipPosition }>{ badge.tooltip }</Tooltip> }
		</Badge>
	);
};
