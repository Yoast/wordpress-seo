/* External dependencies */
import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

/**
 * Paragraph that contains the TwitterSiteUrl and the icon.
 */
const TwitterSiteUrlWrapper = styled.div`
	text-transform: lowercase;
	color: rgb(83, 100, 113);
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	margin: 0;
	fill: currentcolor;
	display: flex;
	flex-direction: row;
	align-items: flex-end;
`;

/**
 * Renders a TwitterSiteUrl component.
 *
 * @param {object} props The props.
 *
 * @returns {React.Element} The rendered element.
 */
const TwitterSiteUrl = ( props ) => {
	return (
		<TwitterSiteUrlWrapper>
			<span>{ props.siteUrl }</span>
		</TwitterSiteUrlWrapper>
	);
};

TwitterSiteUrl.propTypes = {
	siteUrl: PropTypes.string.isRequired,
};

export default TwitterSiteUrl;
