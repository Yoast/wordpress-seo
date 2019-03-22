/* External dependencies */
import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

const FacebookTitleWrapper = styled.span`
	display: block;
	color: #1d2129;
	font-weight: 600;
	overflow: hidden;
	font-size: 16px;
	line-height: 20px;
	margin: 5px 0 0;
	max-height: 100px;
	word-wrap: break-word;
	letter-spacing: normal;
	white-space: normal;
	cursor: pointer;
`;

/**
 * Renders a FacebookTitle component.
 *
 * @param {object} props The props.
 *
 * @returns {React.Element} The rendered element.
 */
const FacebookTitle = ( props ) => {
	return (
		<FacebookTitleWrapper>
			{ props.title }
		</FacebookTitleWrapper>
	);
};

FacebookTitle.propTypes = {
	title: PropTypes.string.isRequired,
};

export default FacebookTitle;
