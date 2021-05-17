import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

/**
 * A div element that looks like it can be interacted with like a label.
 */
export const SimulatedLabel = styled.div`
	flex: 1 1 200px;
	min-width: 200px;
	cursor: pointer;
	font-size: 14px;
	font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
	margin: 4px 0;
	color: #303030;
	font-weight: 500;
`;

/**
 * Represents the label HTML tag.
 *
 * @param {Object} props The properties to use.
 * @returns {JSX} A representation of the label HTML element based on the passed props.
 * @constructor
 */
const Label = ( props ) => {
	return (
		<label
			htmlFor={ props.for }
			className={ props.className }
			{ ...props.optionalAttributes }
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

/**
 * Defines the default values for the properties.
 *
 * @type {{for: string, text: string}}
 */
Label.defaultProps = {
	className: "",
	optionalAttributes: {},
};

export default Label;
