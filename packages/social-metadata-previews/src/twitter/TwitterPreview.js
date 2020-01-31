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
    width: 507px;
    min-height: 125px;
    border-radius: 12px;
    border: 1px solid #E1E8ED;
    box-sizing: border-box;
    color: #292F33;
    background: #FFFFFF;
    &:hover {
        background: #f5f8fa;
        border: 1px solid rgba(136,153,166,.5);
    }
    overflow: hidden;
    display: flex;
    max-height: ${ props => props.isLarge ? "370px" : "125px" };
    flex-direction: ${ props => props.isLarge ? "column" : "row" };
`;

const ImgWrapper = styled.div`
	${ props => {
		if ( ! props.isLarge ) {
			return `width: 125px; 
			height: 125px;`;
		}
	}
}
	flex-shrink: 0;
	overflow: hidden;
`;

/**
 * Renders TwitterPreview component.
 *
 * @param {object} props The props.
 *
 * @returns {React.Element} The rendered element.
 */
const TwitterPreview = ( props ) => {
	return (
		<TwitterPreviewWrapper isLarge={ props.isLarge }>
			<ImgWrapper isLarge={ props.isLarge }>
				<TwitterImage src={ props.image } alt={ props.alt } />
			</ImgWrapper>
			<TwitterTextWrapper>
				<TwitterTitle title={ props.title } />
				<TwitterDescription description={ props.description } />
				<TwitterSiteName siteName={ props.siteName } />
			</TwitterTextWrapper>
		</TwitterPreviewWrapper>
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
