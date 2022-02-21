import classNames from "classnames";
import { values } from "lodash";
import PropTypes from "prop-types";

export const INPUT_TYPES = {
	BUTTON: "button",
	CHECKBOX: "checkbox",
	COLOR: "color",
	DATE: "date",
	DATETIME_LOCAL: "datetime-local",
	EMAIL: "email",
	FILE: "file",
	HIDDEN: "hidden",
	IMAGE: "image",
	MONTH: "month",
	NUMBER: "number",
	PASSWORD: "password",
	RADIO: "radio",
	RANGE: "range",
	RESET: "reset",
	SEARCH: "search",
	SUBMIT: "submit",
	TEL: "tel",
	TEXT: "text",
	TIME: "time",
	URL: "url",
	WEEK: "week",
};

/**
 * @param {string} type The type of input. See INPUT_TYPES.
 * @param {string} [className] CSS class.
 * @param {object} [props] Optional extra properties.
 * @returns {JSX.Element} Input component.
 */
const Input = ( {
	type,
	className,
	...props
} ) => (
	<input
		type={ type }
		className={ classNames(
			"yst-input",
			className,
		) }
		{ ...props }
	/>
);

Input.propTypes = {
	type: PropTypes.oneOf( values( INPUT_TYPES ) ),
	className: PropTypes.string,
};

Input.defaultProps = {
	type: "text",
	className: "",
};

export default Input;
