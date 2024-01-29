import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

/* Yoast dependencies */
import { colors } from "@yoast/style-guide";

import ScreenReaderText from "./a11y/ScreenReaderText";

export const StyledTitleContainer = styled.span`
	flex-grow: 1;
	overflow-x: hidden;
	line-height: normal; // Avoid vertical scrollbar in IE 11 when rendered in the WP sidebar.
`;

export const StyledTitle = styled.span`
	display: block;
	line-height: 1.5; 
	text-overflow: ellipsis;
	overflow: hidden;
	color: ${ colors.$color_headings };
`;

export const StyledSubTitle = styled.span`
	display: block;
	white-space: nowrap;
	text-overflow: ellipsis;
	overflow: hidden;
	font-size: 0.8125rem;
	margin-top: 2px;
`;

/**
 * The StyledTitleContainer component, consisting of a StyledTitle and a StyledSubTitle.
 *
 * @param {object} props The component's props.
 *
 * @returns {ReactElement} The StyledTitleContainer component.
 */
export const SectionTitle = ( props ) => {
	return (
		<StyledTitleContainer>
			<StyledTitle>
				{ props.title }
				{ props.titleScreenReaderText && <ScreenReaderText>{ " " + props.titleScreenReaderText }</ScreenReaderText> }
			</StyledTitle>
			{ props.subTitle && <StyledSubTitle>{ props.subTitle }</StyledSubTitle> }
		</StyledTitleContainer>
	);
};

SectionTitle.propTypes = {
	title: PropTypes.string.isRequired,
	titleScreenReaderText: PropTypes.string,
	subTitle: PropTypes.string,
};
