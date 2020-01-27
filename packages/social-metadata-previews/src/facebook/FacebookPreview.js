/* External dependencies */
import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

/* Internal dependencies */
import FacebookSiteAndAuthorNames from "./FacebookSiteAndAuthorNames";
import FacebookImage from "./FacebookImage";
import FacebookTitle from "./FacebookTitle";
import FacebookDescription from "./FacebookDescription";

const FacebookPreviewWrapper = styled.div`
background-color: #f2f3f5;
max-width: none;
border: none;
box-shadow: none;
border: 1px solid #dddfe2;
border-radius: 0;
zoom: 1;
float: left;
overflow: hidden;
position: relative;
z-index: 0;
`;

/**
 * Renders a FacebookPreview component.
 *
 * @param {object} props The props.
 *
 * @returns {React.Element} The rendered element.
 */
const FacebookPreview = ( props ) => {
	return (
		<FacebookPreviewWrapper>
			<FacebookImage src={ props.image } alt={ props.alt } />
			<FacebookSiteAndAuthorNames siteName={ props.siteName } authorName={ props.authorName } />
			<FacebookTitle title={ props.title } />
			<FacebookDescription>
				{ props.description }
			</FacebookDescription>
		</FacebookPreviewWrapper>
	);
};

FacebookPreview.propTypes = {
	siteName: PropTypes.string.isRequired,
	title: PropTypes.string.isRequired,
	authorName: PropTypes.string,
	description: PropTypes.string,
	image: PropTypes.string.isRequired,
	alt: PropTypes.string,
};

FacebookPreview.defaultProps = {
	authorName: "",
	description: "",
	alt: "",
};

export default FacebookPreview;
