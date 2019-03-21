/* External dependencies */
import React, { Fragment } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { __, sprintf } from "@wordpress/i18n";

/* Internal dependencies */
import FacebookSiteName from "./FacebookSiteName";
import FacebookAuthorName from "./FacebookAuthorName";

const FacebookSiteAndAuthorNamesWrapper = styled.p`
	color: #606770;
	font-size: 12px;
	line-height: 11px;
	overflow: hidden;
	text-overflow: ellipsis;
	text-transform: uppercase;
	white-space: nowrap;
`;

const FacebookSiteAndAuthorNamesSeparator = styled.span`
    padding-left: 5px;
    padding-right: 5px;
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
 *
 * @returns {React.Element} The rendered element.
 */
const FacebookSiteAndAuthorNames = ( props ) => {
	const hasAuthorName = props.authorName.length > 0;
	const screenReaderText = hasAuthorName
		/* Translators: 1: site name, 2: post author name */
		? sprintf( __( "%1$s by %2$s", "yoast-components" ), props.siteName, props.authorName )
		: props.siteName;

	return (
		<Fragment>
			<span className="screen-reader-text">{ screenReaderText }</span>
			<FacebookSiteAndAuthorNamesWrapper aria-hidden="true">
				<FacebookSiteName siteName={ props.siteName } />
				{ hasAuthorName && renderFacebookAuthorName( props.authorName ) }
			</FacebookSiteAndAuthorNamesWrapper>
		</Fragment>
	);
};

FacebookSiteAndAuthorNames.propTypes = {
	siteName: PropTypes.string.isRequired,
	authorName: PropTypes.string,
};

FacebookSiteAndAuthorNames.defaultProps = {
	authorName: "",
};

export default FacebookSiteAndAuthorNames;
