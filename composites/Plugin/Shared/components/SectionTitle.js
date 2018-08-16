import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import noop from "lodash/noop";

import ScreenReaderText from "../../../../a11y/ScreenReaderText";
import colors from "../../../../style-guide/colors.json";

export const StyledTitleContainer = styled.span`
	flex-grow: 1;
	overflow-x: hidden;
	line-height: normal; // Avoid vertical scrollbar in IE 11 when rendered in the WP sidebar.
`;

export const StyledTitle = styled.span`
	display: block;
	white-space: nowrap;
	text-overflow: ellipsis;
	overflow-x: hidden;
	color: ${ colors.$color_headings };
`;

export const StyledSubTitle = styled.span`
	display: block;
	white-space: nowrap;
	text-overflow: ellipsis;
	overflow-x: hidden;
	font-size: 0.8125rem;
	margin-top: 2px;
`;

export const SectionTitle = ( props ) => {
	return (
		<StyledTitleContainer onClick={ props.onTitleClick }>
			<StyledTitle>
				{ props.title }
				{ props.titleScreenReaderText && <ScreenReaderText>{ " " + props.titleScreenReaderText }</ScreenReaderText> }
			</StyledTitle>
			{ props.subTitle && <StyledSubTitle>{ props.subTitle }</StyledSubTitle> }
		</StyledTitleContainer>
	);
};

SectionTitle.propTypes = {
	onTitleClick: PropTypes.func,
	title: PropTypes.string.isRequired,
	titleScreenReaderText: PropTypes.string,
	subTitle: PropTypes.string,
};

SectionTitle.defaultProps = {
	onTitleClick: noop,
};
