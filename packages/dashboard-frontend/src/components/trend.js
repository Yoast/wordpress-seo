import classNames from "classnames";

/**
 * @param {number} value The value.
 * @param {string} formattedValue The formatted value.
 * @param {boolean} moreIsGood This determines is a positive result will show the green color.
 * @returns {JSX.Element} The element.
 */
export const Trend = ( { value, formattedValue, moreIsGood } ) => {
	// Don't show anything if 0 or invalid.
	if ( ! value ) {
		return null;
	}

	const isPositive = value >= 0;
	const positiveColor = ( moreIsGood ) ?	"yst-text-green-600" : "yst-text-red-600";
	const negativeColor = ( moreIsGood ) ?	"yst-text-red-600" : "yst-text-green-600";

	return (
		<div
			className={ classNames(
				"yst-flex yst-items-center yst-font-semibold",
				isPositive ? positiveColor : negativeColor
			) }
		>
			{
				// Add as a single string to avoid unnecessary space (easier for testing).
				[ isPositive ? "+" : "", formattedValue ].join( "" )
			}
		</div>
	);
};
