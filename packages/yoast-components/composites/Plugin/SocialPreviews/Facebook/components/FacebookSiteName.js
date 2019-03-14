import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

const FacebookSiteNameWrapper = styled.span`
	color: #606770;
	font-size: 12px;
	line-height: 11px;
	text-transform: uppercase;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
`;

/**
 * Renders a FacebookSiteName component.
 *
 * @param {object} props The props.
 *
 * @returns {React.Element} The rendered element.
 */
const FacebookSiteName = ( props ) => {
	return (
		<FacebookSiteNameWrapper>
			{ props.siteName }
		</FacebookSiteNameWrapper>
	);
};

FacebookSiteName.propTypes = {
	siteName: PropTypes.string.isRequired,
};

export default FacebookSiteName;
