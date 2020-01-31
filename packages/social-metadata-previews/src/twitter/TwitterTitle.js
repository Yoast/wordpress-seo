/* External dependencies */
import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

const TwitterTitleWrapper = styled.p`
	line-height: 18px;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	margin-top: 0;
	margin-bottom: 2px;
	color: rgb(20, 23, 26);
`;

/**
 * Renders a TwitterTitle component.
 *
 * @param {object} props                    The props.
 * @param {string} props.title              The title.
 *
 * @returns {React.Element} The rendered element.
 */
const TwitterTitle = ( props ) =>
	<TwitterTitleWrapper>
		{ props.title }
	</TwitterTitleWrapper>
;

TwitterTitle.propTypes = {
	title: PropTypes.string.isRequired,
};

export default TwitterTitle;
