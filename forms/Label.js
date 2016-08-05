import React from "react";

/**
 * Represents the label HTML tag.
 *
 * @param {Object} props The properties to use.
 * @returns {JSX}
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
	for: React.PropTypes.string.isRequired,
	text: React.PropTypes.string.isRequired,

	onClick: React.PropTypes.func,
};

/**
 * Defines the default values for the properties.
 *
 * @type {{for: string, text: string}}
 */
Label.defaultProps = {
	for: "",
	text: "",
};

export default Label;
