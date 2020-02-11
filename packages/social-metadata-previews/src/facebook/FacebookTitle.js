/* External dependencies */
import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

const FacebookTitleWrapper = styled.span`
	color: #1d2129;
	font-weight: 600;
	overflow: hidden;
	font-size: 16px;
	line-height: 20px;
	margin: 0;
	letter-spacing: normal;
	white-space: normal;
	flex-shrink: 0;
	cursor: pointer;
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;  
	overflow: hidden;
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
