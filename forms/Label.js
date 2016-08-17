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
		<label htmlFor={props.for} {...props.optionalAttributes}>{props.children}</label>
	);
};

/**
 * Adds validation for the properties.
 *
 * @type {{for: string, text: string, onClick: function}}
 */
Label.propTypes = {
	for: React.PropTypes.string.isRequired,
	optionalAttributes: React.PropTypes.shape( {
		onClick: React.PropTypes.func,
		className: React.PropTypes.string,
	} ),
};

/**
 * Defines the default values for the properties.
 *
 * @type {{for: string, text: string}}
 */
Label.defaultProps = {
	htmlFor: "",
};

export default Label;
