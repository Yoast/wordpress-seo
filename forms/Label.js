import React from "react";
import PropTypes from "prop-types";

/**
 * Represents the label HTML tag.
 *
 * @param {Object} props The properties to use.
 * @returns {JSX} A representation of the label HTML element based on the passed props.
 * @constructor
 */
const Label = ( props ) => {
	/*
	 * The jsx-a11y plugin doesn't see we actually use htmlFor because we render
	 * the label without the associated input element.
	 */
	/* eslint-disable jsx-a11y/label-has-for */
	return (
		<label htmlFor={props.for} {...props.optionalAttributes}>{props.children}</label>
	);
	/* eslint-enable jsx-a11y/label-has-for */
};

/**
 * Adds validation for the properties.
 *
 * @type {{for: string, optionalAttributes.onClick: function, optionalAttributes.className: string, children: * }}
 */
Label.propTypes = {
	"for": PropTypes.string.isRequired,
	optionalAttributes: PropTypes.shape( {
		"aria-label": PropTypes.string,
		onClick: PropTypes.func,
		className: PropTypes.string,
	} ),
	children: PropTypes.any.isRequired,
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
