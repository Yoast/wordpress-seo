/* External dependencies */
import React, { Fragment } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { __ } from "@wordpress/i18n";

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
	// Do not render anything when there is no author name.
	if ( authorName.length === 0 ) {
		return null;
	}

	/* Translators: The context is: SITE | By AUTHOR */
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
	return (
		<FacebookSiteAndAuthorNamesWrapper>
			<FacebookSiteName siteName={ props.siteName } />
			{ renderFacebookAuthorName( props.authorName ) }
		</FacebookSiteAndAuthorNamesWrapper>
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
