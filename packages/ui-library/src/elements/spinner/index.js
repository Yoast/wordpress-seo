import classNames from "classnames";
import { keys } from "lodash";
import PropTypes from "prop-types";
import { useSvgAria } from "../../hooks";

const classNameMap = {
	variant: {
		// Default is currentColor.
		"default": "",
		white: "yst-text-white",
	},
	size: {
		3: "yst-w-3 yst-h-3",
		4: "yst-w-4 yst-h-4",
		8: "yst-w-8 yst-h-8",
	},
};

/**
 * @param {string} [variant=default] The variant.
 * @param {string} [size] The size.
 * @param {string} [className] The HTML class.
 * @returns {JSX.Element} The spinner.
 */
const Spinner = ( {
	variant,
	size,
	className,
} ) => {
	const svgAriaProps = useSvgAria();

	return (
		<svg
			xmlns="http://www.w3.org/2000/svg/"
			fill="none"
			viewBox="0 0 24 24"
			className={ classNames(
				"yst-animate-spin",
				classNameMap.variant[ variant ],
				classNameMap.size[ size ],
				className,
			) }
			{ ...svgAriaProps }
		>
			<circle className="yst-opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
			<path
				className="yst-opacity-75"
				fill="currentColor"
				d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
			/>
		</svg>
	);
};

Spinner.propTypes = {
	variant: PropTypes.oneOf( keys( classNameMap.variant ) ),
	size: PropTypes.oneOf( keys( classNameMap.size ) ),
	className: PropTypes.string,
};

Spinner.defaultProps = {
	variant: "default",
	size: "4",
	className: "",
};

export default Spinner;
