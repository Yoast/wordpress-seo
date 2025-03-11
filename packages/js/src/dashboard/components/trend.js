import { ArrowNarrowUpIcon } from "@heroicons/react/outline";
import classNames from "classnames";

/**
 * @param {number} value The value.
 * @param {string} formattedValue The formatted value.
 * @returns {JSX.Element} The element.
 */
export const Trend = ( { value, formattedValue } ) => {
	// Don't show anything if 0 or invalid.
	if ( ! value ) {
		return null;
	}

	const isPositive = value >= 0;

	return (
		<div
			className={ classNames(
				"yst-flex yst-items-center yst-font-semibold",
				isPositive ? "yst-text-green-600" : "yst-text-red-600"
			) }
		>
			<ArrowNarrowUpIcon
				className={ classNames(
					"yst-w-4 yst-shrink-0",
					// Point the arrow downwards if negative.
					! isPositive && "yst-rotate-180"
				) }
			/>
			{ isPositive && "+" }
			{ formattedValue }
		</div>
	);
};
