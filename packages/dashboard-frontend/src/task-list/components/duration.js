import { ClockIcon } from "@heroicons/react/outline";
import { useSvgAria, SkeletonLoader } from "@yoast/ui-library";

/**
 * The Duration component to display task duration.
 *
 * @param {number} minutes The duration in minutes.
 * @param {boolean} [isLoading=false] Whether the duration is loading.
 * @param {string} [locale="en"] Optional locale to use for formatting (defaults to "en")
 * @param {boolean} [isCompleted] Whether the task is completed.
 * @returns {JSX.Element} The Duration component.
 */
export const Duration = ( { minutes, isLoading = false, locale = "en", isCompleted } ) => {
	const svgAriaProps = useSvgAria();
	const localeNormalized = locale.replace( "_", "-" );

	// Format duration with automatic hour/minute conversion based on locale
	const formatDuration = ( min ) => {
		try {
			const hours = Math.floor( min / 60 );
			const remainingMinutes = min % 60;

			// Use Intl.NumberFormat for locale-aware unit formatting
			const hourFormatter = new Intl.NumberFormat( localeNormalized, {
				style: "unit",
				unit: "hour",
				unitDisplay: "narrow",
			} );

			const minuteFormatter = new Intl.NumberFormat( localeNormalized, {
				style: "unit",
				unit: "minute",
				unitDisplay: "narrow",
			} );

			// If less than an hour, show only minutes
			if ( hours === 0 ) {
				return minuteFormatter.format( min );
			}

			// If exactly hours with no remaining minutes
			if ( remainingMinutes === 0 ) {
				return hourFormatter.format( hours );
			}

			// Show both hours and minutes
			return `${ hourFormatter.format( hours ) } ${ minuteFormatter.format( remainingMinutes ) }`;
		} catch ( error ) {
			// Fallback to simple format
			const hours = Math.floor( min / 60 );
			const remainingMinutes = min % 60;

			if ( hours === 0 ) {
				return `${ min }m`;
			}
			if ( remainingMinutes === 0 ) {
				return `${ hours }h`;
			}
			return `${ hours }h ${ remainingMinutes }m`;
		}
	};

	return <span className="yst-text-xs yst-text-slate-600 yst-flex yst-gap-0.5 yst-items-center">
		<ClockIcon className="yst-w-4 yst-text-slate-400" { ...svgAriaProps } />
		{ isLoading ? <SkeletonLoader className="yst-w-8 yst-h-[18px] yst-ms-0.5" />
			: <>{ formatDuration( isCompleted ? 0 : minutes ) }</> }
	</span>;
};
