/* External dependencies */
import React, { Fragment } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { __, sprintf } from "@wordpress/i18n";
import { isString } from "lodash";

/* Internal dependencies */
import FacebookAuthorName from "./FacebookAuthorName";

const FacebookSiteAndAuthorNamesWrapper = styled.p`
	color: #606770;
	flex-shrink: 0;
	font-size: 12px;
	line-height: 20px;
	overflow: hidden;
	padding: 0;
	text-overflow: ellipsis;
	text-transform: uppercase;
	white-space: nowrap;
	margin: 0;
	position: ${ props => props.mode === "landscape" ? "relative" : "static" };
`;

const FacebookSiteAndAuthorNamesSeparator = styled.span`
	padding-left: 5px;
	padding-right: 5px;
`;

const FacebookSiteUrl = styled.span`
	color: #606770;
	font-size: 12px;
	line-height: 11px;
	text-transform: uppercase;
	overflow: hidden;
`;

/**
 * Renders a FacebookAuthorName component with accompanying elements.
 *
 * @param {string} authorName The author's name.
 *
 * @returns {React.Element} The rendered element.
 */
function renderFacebookAuthorName( authorName ) {
	/* Translators: the context is: SITE | By AUTHOR */
	const by = __( "By", "yoast-components" );

	return (
		<Fragment>
			<FacebookSiteAndAuthorNamesSeparator>|</FacebookSiteAndAuthorNamesSeparator>
			{ by }
			&nbsp;
			<FacebookAuthorName authorName={ authorName } />
		</Fragment>
	);
}

/**
 * Renders a FacebookSiteAndAuthorNames component.
 *
 * @param {object} props The props.
 * @param {string} props.authorName The author's name.
 * @param {string} props.siteUrl The site url.
 *
 * @returns {React.Element} The rendered element.
 */
const FacebookSiteAndAuthorNames = ( props ) => {
	const hasAuthorName =  isString( props.authorName ) && props.authorName.length > 0;
	const screenReaderText = hasAuthorName
		/* Translators: 1: site name, 2: post author name */
		? sprintf( __( "%1$s by %2$s", "yoast-components" ), props.siteUrl, props.authorName )
		: props.siteUrl;

	return (
		<Fragment>
			<span className="screen-reader-text">{ screenReaderText }</span>
			<FacebookSiteAndAuthorNamesWrapper aria-hidden="true">
				<FacebookSiteUrl>{ props.siteUrl }</FacebookSiteUrl>
				{ hasAuthorName && renderFacebookAuthorName( props.authorName ) }
			</FacebookSiteAndAuthorNamesWrapper>
		</Fragment>
	);
};

FacebookSiteAndAuthorNames.propTypes = {
	siteUrl: PropTypes.string.isRequired,
	authorName: PropTypes.string,
};

FacebookSiteAndAuthorNames.defaultProps = {
	authorName: "",
};

export default FacebookSiteAndAuthorNames;
