import { ChevronDoubleUpIcon, ChevronDoubleDownIcon, MenuAlt4Icon } from "@heroicons/react/outline";
import { __ } from "@wordpress/i18n";
import { useSvgAria, SkeletonLoader } from "@yoast/ui-library";
import classNames from "classnames";

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
 * @param {string} [level=low] The priority level: 'low', 'medium', 'high'.
 * @param {boolean} [isLoading=false] Whether the priority is loading.
 * @returns {JSX.Element} The Priority component.
 */
export const Priority = ( { level = "low", isLoading = false, className } ) => {
	const svgAriaProps = useSvgAria();
	return <span className={ classNames( "yst-text-xs yst-text-slate-600 yst-flex yst-gap-1", className ) }>
		{ isLoading ? <>
			<MenuAlt4Icon className="yst-w-4 yst-text-slate-400" { ...svgAriaProps } />
			<SkeletonLoader className="yst-w-11 yst-h-[18px]" />
		</>
			: <>
				{ getPriorityIcon( level ) }
				{ priorityLabels[ level ] }
			</> }
	</span>;
};


