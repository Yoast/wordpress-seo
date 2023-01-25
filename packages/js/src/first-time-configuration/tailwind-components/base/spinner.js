import PropTypes from "prop-types";
import classNames from "classnames";

/**
 * The Spinner component.
 * @param {Object} props Props object.
 * @param {string} props.color The color of the spinner.
 * @param {string} props.size The size of the spinner.
 * @param {string} props.className Additional CSS class names.
 * @returns {WPElement} The Spinner component.
 */
const Spinner = ( { className } ) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			className={ classNames(
				"yst-animate-spin",
				className
			) }
		>
			<circle className="yst-opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
			<path className="yst-opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
		</svg>
	);
};

Spinner.propTypes = {
	className: PropTypes.string,
};

Spinner.defaultProps = {
	className: "",
};

export default Spinner;
