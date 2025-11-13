import { ChevronDoubleUpIcon, ChevronDoubleDownIcon, MenuAlt4Icon } from "@heroicons/react/outline";
import { __ } from "@wordpress/i18n";

export const priorities = {
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
