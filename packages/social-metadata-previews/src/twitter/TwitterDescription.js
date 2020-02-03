/* External dependencies */
import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

/**
 * Renders a TwitterDescription component.
 * NOTE: the "-webkit-line-clamp: 3" limits the number of lines to 3.
 *
 * @param {object} props The props.
 *
 * @returns {React.Component} The rendered element.
 */
const TwitterDescriptionText = styled.p`
	max-height: 55px;
	line-height: 18px;
	overflow: hidden;
	text-overflow: ellipsis;
	margin: 0 0 2px;
	color: rgb(101, 119, 134);
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
`;

/**
 * Component that contains the twitter description text.
 *
 * @param {object} props The properties passed to the component.
 *
 * @returns {React.Element} The TwitterDescription component.
 */
const TwitterDescription = ( props ) =>
	<TwitterDescriptionText>
		{ props.description }
	</TwitterDescriptionText>
;

TwitterDescription.propTypes = {
	description: PropTypes.string.isRequired,
};

export default TwitterDescription;
