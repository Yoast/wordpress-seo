import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

/**
 * A div element that looks like it can be interacted with like a label.
 */
export const SimulatedLabel = styled.div`
	cursor: pointer;
	font-size: 14px;
	font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
	margin: 4px 0;
	color: #303030;
	font-weight: 500;
`;

// Stable reference matching the old defaultProps single instance, so it keeps a constant identity across renders.
const DEFAULT_OPTIONAL_ATTRIBUTES = {};

/**
 * Represents the label HTML tag.
 *
 * @param {Object} props The properties to use.
 * @returns {JSX} A representation of the label HTML element based on the passed props.
 * @constructor
 */
const Label = ( { className = "", optionalAttributes = DEFAULT_OPTIONAL_ATTRIBUTES, ...props } ) => {
	return (
		<label
			htmlFor={ props.for }
			className={ className }
			{ ...optionalAttributes }
		>
			{ props.children }
		</label>
	);
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
	className: PropTypes.string,
};

export default Label;
