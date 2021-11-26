/* External dependencies */
import React, { Fragment } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

const FacebookSiteUrlWrapper = styled.p`
	color: #606770;
	flex-shrink: 0;
	font-size: 12px;
	line-height: 16px;
	overflow: hidden;
	padding: 0;
	text-overflow: ellipsis;
	text-transform: uppercase;
	white-space: nowrap;
	margin: 0;
	position: ${ props => props.mode === "landscape" ? "relative" : "static" };
`;

/**
 * Renders a FacebookSiteUrl component.
 *
 * @param {object} props The props.
 * @param {string} props.siteUrl The site url.
 *
 * @returns {React.Element} The rendered element.
 */
const FacebookSiteUrlComponent = ( props ) => {
	const { siteUrl } = props;

	return (
		<Fragment>
			<span className="screen-reader-text">{ siteUrl }</span>
			<FacebookSiteUrlWrapper aria-hidden="true">
				<span>{ siteUrl }</span>
			</FacebookSiteUrlWrapper>
		</Fragment>
	);
};

FacebookSiteUrlComponent.propTypes = {
	siteUrl: PropTypes.string.isRequired,
};

export default FacebookSiteUrlComponent;
