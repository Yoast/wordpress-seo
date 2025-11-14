import { ClockIcon } from "@heroicons/react/outline";
import { _x } from "@wordpress/i18n";
import { useSvgAria, SkeletonLoader } from "@yoast/ui-library";

/**
 * The Duration component to display task duration.
 *
 * @param {number} minutes The duration in minutes.
 * @param {boolean} [isLoading=false] Whether the duration is loading.
 * @returns {JSX.Element} The Duration component.
 */
export const Duration = ( { minutes, isLoading = false } ) => {
	const svgAriaProps = useSvgAria();
	return <span className="yst-text-xs yst-text-slate-600 yst-flex yst-gap-0.5">
		<ClockIcon className="yst-w-4 yst-text-slate-400" { ...svgAriaProps } />
		{ isLoading ? <SkeletonLoader className="yst-w-8 yst-h-[18px] yst-ms-0.5" />
			: <>
				{ minutes }
				{
					/* translators: This is a unit abbreviation for minutes. */
					_x( "m", "Abbreviation for minutes", "wordpress-seo" )
				}
			</> }
	</span>;
};
