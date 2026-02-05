import { ClockIcon } from "@heroicons/react/outline";
import { useSvgAria, SkeletonLoader } from "@yoast/ui-library";
import classNames from "classnames";
import { useTaskListContext } from "../task-list-context";

/**
 * The Duration component to display task duration.
 *
 * @param {number} minutes The duration in minutes.
 * @param {boolean} [isLoading=false] Whether the duration is loading.
 * @param {boolean} [isCompleted] Whether the task is completed.
 * @returns {JSX.Element} The Duration component.
 */
export const Duration = ( { minutes, isLoading = false, isCompleted } ) => {
	const { locale } = useTaskListContext();
	const svgAriaProps = useSvgAria();
	const localeNormalized = locale.replace( "_", "-" );

	// Format duration with automatic hour/minute conversion based on locale
	const formatDuration = ( min ) => {
		try {
			const hours = Math.floor( min / 60 );
			const remainingMinutes = min % 60;

			// Some locales (like Japanese) don't have narrow unit formats, so use short for them
			const unitDisplay = /^(ja|de)/i.test( localeNormalized ) ? "short" : "narrow";

			// For East Asian languages, remove all spaces and concatenate
			const isEastAsian = /^(ja|zh)/i.test( localeNormalized );

			// Use Intl.NumberFormat for locale-aware unit formatting
			const hourFormatter = new Intl.NumberFormat( localeNormalized, {
				style: "unit",
				unit: "hour",
				unitDisplay: unitDisplay,
			} );

			const minuteFormatter = new Intl.NumberFormat( localeNormalized, {
				style: "unit",
				unit: "minute",
				unitDisplay: unitDisplay,
			} );

			// If less than an hour, show only minutes
			if ( hours === 0 ) {
				return isEastAsian ? ( minuteFormatter.format( min ) ).replace( /\s+/g, "" ) : minuteFormatter.format( min );
			}

			// If exactly hours with no remaining minutes
			if ( remainingMinutes === 0 ) {
				return isEastAsian ? ( hourFormatter.format( hours ) ).replace( /\s+/g, "" ) : hourFormatter.format( hours );
			}

			// Show both hours and minutes
			const hourFormatted = hourFormatter.format( hours );
			const minuteFormatted = minuteFormatter.format( remainingMinutes );


			if ( isEastAsian ) {
				return ( hourFormatted + minuteFormatted ).replace( /\s+/g, "" );
			}
			return `${ hourFormatted } ${ minuteFormatted }`;
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

	return <span
		className={ classNames(
			"yst-text-xs yst-text-slate-600 yst-flex yst-gap-0.5 yst-items-center",
			{ "yst-opacity-50": isCompleted }
		) }
	>
		<ClockIcon className="yst-w-4 yst-text-slate-400" { ...svgAriaProps } />
		{ isLoading ? <SkeletonLoader className="yst-w-8 yst-h-[18px] yst-ms-0.5" />
			: <>{ formatDuration( isCompleted ? 0 : minutes ) }</> }
	</span>;
};
