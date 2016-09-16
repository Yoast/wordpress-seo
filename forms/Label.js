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
 * @type {{for: string, optionalAttributes.onClick: function, optionalAttributes.className: string, children: * }}
 */
Label.propTypes = {
	"for": React.PropTypes.string.isRequired,
	optionalAttributes: React.PropTypes.shape( {
		"aria-label": React.PropTypes.string,
		onClick: React.PropTypes.func,
		className: React.PropTypes.string,
	} ),
	children: React.PropTypes.any.isRequired,
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
