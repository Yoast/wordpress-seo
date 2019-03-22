/* External dependencies */
import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

const FacebookAuthorNameWrapper = styled.span`
	color: #3b5998;
	font-size: 12px;
	line-height: 11px;
`;

/**
 * Renders a FacebookAuthorName component.
 *
 * @param {object} props The props.
 *
 * @returns {React.Element} The rendered element.
 */
const FacebookAuthorName = ( props ) => {
	return (
		<FacebookAuthorNameWrapper>
			{ props.authorName }
		</FacebookAuthorNameWrapper>
	);
};

FacebookAuthorName.propTypes = {
	authorName: PropTypes.string.isRequired,
};

export default FacebookAuthorName;
