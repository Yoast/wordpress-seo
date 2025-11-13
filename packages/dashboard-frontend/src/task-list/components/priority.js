import { ChevronDoubleUpIcon, ChevronDoubleDownIcon, MenuAlt4Icon } from "@heroicons/react/outline";
import { __ } from "@wordpress/i18n";

const priorities = {
	low: {
		label: __( "Low", "wordpress-seo" ),
		icon: <ChevronDoubleDownIcon className="yst-w-4 yst-text-slate-400" />,
	},
	medium: {
		label: __( "Medium", "wordpress-seo" ),
		icon: <MenuAlt4Icon className="yst-w-4 yst-text-amber-500" />,
	},
	high: {
		label: __( "High", "wordpress-seo" ),
		icon: <ChevronDoubleUpIcon className="yst-w-4 yst-text-red-600" />,
	},
};

/**
 * The Priority component to display task priority.
 *
 * @param {string} level The priority level: 'low', 'medium', 'high'.
 * @returns {JSX.Element} The Priority component.
 */
export const Priority = ( { level } ) => {
	return <span className="yst-text-xs yst-text-slate-600 yst-flex yst-gap-1">
		{ priorities[ level ].icon }
		{ priorities[ level ].label }</span>;
};


