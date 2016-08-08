import React from "react";

/**
 * Represents the label HTML tag.
 *
 * @param {Object} props The properties to use.
 * @returns {JSX} A representation of the label HTML element based on the passed props.
 * @constructor
 */
const Label = ( props ) => {
	return (
		<label htmlFor={props.for} onClick={props.onClick}>{props.text}</label>
	);
};

/**
 * Adds validation for the properties.
 *
 * @type {{for: string, text: string, onClick: function}}
 */
Label.propTypes = {
	text: React.PropTypes.string.isRequired,

	for: React.PropTypes.string,
	onClick: React.PropTypes.func,
};

/**
 * Defines the default values for the properties.
 *
 * @type {{for: string, text: string}}
 */
Label.defaultProps = {
	for: "",
};

export default Label;
