// External dependencies.
import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

// Yoast dependencies.
import { colors } from "@yoast/style-guide";

const StyledMention = styled.span`
	color: ${ colors.$color_white };
	background-color: ${ colors.$color_pink_dark };
	padding: 0 8px;
	margin: 0 2px;
	line-height: 1.71428571; // 24px based on 14px font-size
	border-radius: 17px;
	cursor: default;

	&:hover {
		color: ${ colors.$color_white };
		background-color: ${ colors.$color_pink_dark };
	}
`;

/**
 * The StyledMention component.
 *
 * @param {object} props The component's props.
 *
 * @returns {ReactElement} The StyledMention component.
 */
export const Mention = ( { children, className } ) => {
	return <StyledMention
		className={ className }
		spellCheck={ false }
	>
		{ children }
	</StyledMention>;
};

Mention.propTypes = {
	children: PropTypes.node.isRequired,
	className: PropTypes.string.isRequired,
};
