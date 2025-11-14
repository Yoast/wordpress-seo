import { ClockIcon } from "@heroicons/react/outline";
import { _x } from "@wordpress/i18n";
import { useSvgAria } from "@yoast/ui-library";

/**
 * The Duration component to display task duration.
 *
 * @param {number} minutes The duration in minutes.
 * @returns {JSX.Element} The Duration component.
 */
export const Duration = ( { minutes } ) => {
	const svgAriaProps = useSvgAria();
	return <span className="yst-text-xs yst-text-slate-600 yst-flex yst-gap-0.5">
		<ClockIcon className="yst-w-4 yst-text-slate-400" { ...svgAriaProps } />
		{ minutes }
		{
			/* translators: This is a unit abbreviation for minutes. */
			_x( "m", "Abbreviation for minutes", "wordpress-seo" )
		}
	</span>;
};
