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
 * @param {string} [type="text"] The type of input. See INPUT_TYPES.
 * @param {string} [className=""] CSS class.
 * @param {boolean} [disabled=false] Whether the input is disabled.
 * @param {object} [props] Optional extra properties.
 * @returns {JSX.Element} Input component.
 */
const Input = ( {
	type,
	className,
	disabled,
	...props
} ) => (
	<input
		type={ type }
		className={ classNames(
			"yst-input",
			disabled && "yst-input--disabled",
			className,
		) }
		disabled={ disabled }
		{ ...props }
	/>
);

Input.propTypes = {
	type: PropTypes.oneOf( values( INPUT_TYPES ) ),
	className: PropTypes.string,
	disabled: PropTypes.bool,
};

Input.defaultProps = {
	type: "text",
	className: "",
	disabled: false,
};

export default Input;
