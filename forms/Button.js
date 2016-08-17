import React from "react";

/**
 * Represents the button HTML element.
 *
 * @param {Object} props The properties to use.
 * @returns {JSX} A representation of the button HTML element based on the passed props.
 * @constructor
 */
const Button = ( props ) => {
	return (
		<button className={props.className} type="button" onClick={props.onClick}  {...props.optionalAttributes}>{props.text}</button>
	);
};

/**
 * Adds validation for the properties.
 *
 * @type {{text: string, className: string, onClick: function, optionalAttributes: object}}
 */
Button.propTypes = {
	text: React.PropTypes.string.isRequired,
	className: React.PropTypes.string,
	onClick: React.PropTypes.func.isRequired,

	optionalAttributes: React.PropTypes.object,
};

export default Button;
