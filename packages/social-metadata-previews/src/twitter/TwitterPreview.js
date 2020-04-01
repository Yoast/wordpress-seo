/* External dependencies */
import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

/* Internal dependencies */
import TwitterTitle from "./TwitterTitle";
import TwitterDescription from "./TwitterDescription";
import TwitterSiteName from "./TwitterSiteName";
import TwitterImage from "../twitter/TwitterImage";
import TwitterTextWrapper from "./TwitterTextWrapper";

const TwitterPreviewWrapper = styled.div`
	font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Ubuntu, "Helvetica Neue", sans-serif;
	font-size: 15px;
	font-weight: 400;
	line-height: 20px;
	width: 507px;
	border-radius: 14px;
	border: 1px solid #E1E8ED;
	box-sizing: border-box;
	color: #292F33;
	background: #FFFFFF;
	overflow: hidden;
	text-overflow: ellipsis;
	display: flex;

	&:hover {
		background: #f5f8fa;
		border: 1px solid rgba(136,153,166,.5);
	}
`;

/**
 * The wrapper for the summary_large_image twitter card.
 */
const LargeTwitterPreviewWrapper = styled( TwitterPreviewWrapper )`
	flex-direction: column;
	max-height: 370px;
`;

/**
 * The wrapper for the summary twitter card.
 */
const SmallTwitterPreviewWrapper = styled( TwitterPreviewWrapper )`
	flex-direction: row;
	height: 125px;
`;

/**
 * Renders TwitterPreview component.
 *
 * @param {object} props The props.
 *
 * @returns {React.Element} The rendered element.
 */
const TwitterPreview = ( props ) => {
	const Wrapper = props.isLarge ? LargeTwitterPreviewWrapper : SmallTwitterPreviewWrapper;
	return (
		<Wrapper isLarge={ props.isLarge }>
			<TwitterImage src={ props.image } alt={ props.alt } isLarge={ props.isLarge } />
			<TwitterTextWrapper>
				<TwitterTitle title={ props.title } />
				<TwitterDescription description={ props.description } />
				<TwitterSiteName siteName={ props.siteName } />
			</TwitterTextWrapper>
		</Wrapper>
	);
};

TwitterPreview.propTypes = {
	title: PropTypes.string.isRequired,
	description: PropTypes.string,
	isLarge: PropTypes.bool.isRequired,
	siteName: PropTypes.string.isRequired,
	image: PropTypes.string.isRequired,
	alt: PropTypes.string,
};

TwitterPreview.defaultProps = {
	alt: "",
};

TwitterPreview.defaultProps = {
	description: "",
};

export default TwitterPreview;
