import { ArrowNarrowUpIcon } from "@heroicons/react/outline";
import classNames from "classnames";

/**
 * @param {string} formattedValue The formatted value.
 * @param {boolean} [isNegative=false] Whether the difference is negative.
 * @returns {JSX.Element} The element.
 */
export const DifferencePercentage = ( { formattedValue, isNegative = false } ) => (
	<div
		className={ classNames(
			"yst-flex yst-items-center yst-font-semibold",
			isNegative ? "yst-text-red-600" : "yst-text-green-600"
		) }
	>
		<ArrowNarrowUpIcon
			className={ classNames(
				"yst-w-4 yst-shrink-0",
				// Point the arrow downwards if negative.
				isNegative && "yst-rotate-180"
			) }
		/>
		{ ! isNegative && "+" }
		{ formattedValue }
	</div>
);
