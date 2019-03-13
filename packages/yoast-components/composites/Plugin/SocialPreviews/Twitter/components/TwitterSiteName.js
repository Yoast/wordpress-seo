import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

const TwitterSiteNameWrapper = styled.p`
    text-transform: lowercase;
    color: #8899A6;
    max-height: 18.2px;
    line-height: 18.2px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-top: 4.52662px;
`;

/**
 * Renders a TwitterSiteName component.
 *
 * @param {object} props The props.
 *
 * @returns {React.Element} The rendered element.
 */
const TwitterSiteName = ( props ) => {
	return (
		<TwitterSiteNameWrapper>
			{ props.siteName }
		</TwitterSiteNameWrapper>
	);
};

TwitterSiteName.propTypes = {
	siteName: PropTypes.string.isRequired,
};

export default TwitterSiteName;
