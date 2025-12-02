import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

/* Yoast dependencies */
import { colors } from "@yoast/style-guide";

import ScreenReaderText from "./a11y/ScreenReaderText";

export const StyledTitleContainer = styled.span`
	${props => props.hasNewBadgeLabel ? "" : "flex-grow: 1;"}
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

const StyledTitleContainerWithBadge = styled.div`
	flex-grow: 1;
	display: flex;
	align-items: center;
	gap: 0.5rem;
`;

/**
 * The StyledTitleContainer component, consisting of a StyledTitle and a StyledSubTitle.
 *
 * @param {object} props The component's props.
 * @param {string} props.title The title text.
 * @param {string} [props.titleScreenReaderText] Optional additional text for screen readers.
 * @param {string} [props.subTitle] Optional subtitle text.
 * @param {Function} [props.renderNewBadgeLabel] Optional function to render a "New" badge label.
 * @param {boolean} [props.hasNewBadgeLabel] Whether to show a "New" badge label.
 *
 * @returns {ReactElement} The StyledTitleContainer component.
 */
export const SectionTitle = ( { title, subTitle = "", titleScreenReaderText = "", renderNewBadgeLabel = () => {}, hasNewBadgeLabel = false } ) => {
	const titleContent = (
		<>
			<StyledTitle>
				{ title }
				{ titleScreenReaderText && <ScreenReaderText>{ " " + titleScreenReaderText }</ScreenReaderText> }
			</StyledTitle>
			{ subTitle && <StyledSubTitle>{ subTitle }</StyledSubTitle> }
		</>
	);

	return (
		<>
			{ hasNewBadgeLabel ? (
				<StyledTitleContainerWithBadge>
					<StyledTitleContainer hasNewBadgeLabel={ true }>
						{ titleContent }
					</StyledTitleContainer>
					{ renderNewBadgeLabel() }
				</StyledTitleContainerWithBadge>
			) : (
				<StyledTitleContainer hasNewBadgeLabel={ false }>
					{ titleContent }
				</StyledTitleContainer>
			) }
		</>
	);
};

SectionTitle.propTypes = {
	title: PropTypes.string.isRequired,
	titleScreenReaderText: PropTypes.string,
	subTitle: PropTypes.string,
	renderNewBadgeLabel: PropTypes.func,
	hasNewBadgeLabel: PropTypes.bool,
};
