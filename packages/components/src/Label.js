import React from "react";
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
 * @param {string} props.for The id of the element the label belongs to.
 * @param {Object} [props.optionalAttributes] Additional attributes to add to the label element.
 * @param {string} [props.optionalAttributes["aria-label"]] The aria-label of the label.
 * @param {Function} [props.optionalAttributes.onClick] The function to call when the label is clicked.
 * @param {string} [props.optionalAttributes.className] The class name of the label.
 * @param {*} props.children The content of the label.
 * @param {string} [props.className=""] The class name of the label.
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

export default Label;
