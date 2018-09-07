import React from "react";
import styled from "styled-components";
import colors from "../../../../style-guide/colors";
import PropTypes from "prop-types";

const StyledMention = styled.span`
	color: ${ colors.$color_white };
	background-color: ${ colors.$color_pink_dark };
	padding: 0px 8px;
	margin: 2px 2px;
	border-radius: 17px;
	cursor: default;
	
	&:hover {
		color: ${ colors.$color_white };
		background-color: ${ colors.$color_pink_dark };
	}
`;

export const Mention = ( { children, className } ) => {
	return <StyledMention
		className={ className }
		spellCheck={ false }
	>
		{ children }
	</StyledMention>;
};

Mention.propTypes = {
	children: PropTypes.node,
	className: PropTypes.string,
};
