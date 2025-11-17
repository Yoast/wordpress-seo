import { ChevronDoubleUpIcon, ChevronDoubleDownIcon, MenuAlt4Icon } from "@heroicons/react/outline";
import { __ } from "@wordpress/i18n";
import { useSvgAria } from "@yoast/ui-library";

const priorityLabels = {
	low: __( "Low", "wordpress-seo" ),
	medium: __( "Medium", "wordpress-seo" ),
	high: __( "High", "wordpress-seo" ),
};

/**
 *
 * @param {string} level The priority level.
 * @returns {Object} The priority object with label and icon.
 */
const getPriorityIcon = ( level ) => {
	const svgAriaProps = useSvgAria();
	switch ( level ) {
		case "high":
			return <ChevronDoubleUpIcon className="yst-w-4 yst-text-red-600" { ...svgAriaProps } />;
		case "medium":
			return <MenuAlt4Icon className="yst-w-4 yst-text-amber-500" { ...svgAriaProps } />;
		default:
			return <ChevronDoubleDownIcon className="yst-w-4 yst-text-slate-400" { ...svgAriaProps } />;
	}
};

/**
 * The Priority component to display task priority.
 *
 * @param {string} level The priority level: 'low', 'medium', 'high'.
 * @returns {JSX.Element} The Priority component.
 */
export const Priority = ( { level } ) => {
	return <span className="yst-text-xs yst-text-slate-600 yst-flex yst-gap-1">
		{ getPriorityIcon( level ) }
		{ priorityLabels[ level ] }</span>;
};


