/* External dependencies */
import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { buildTruncatedText } from "../helpers/truncation";

/**
 * Renders a TwitterDescription component.
 *
 * @param {object} props The props.
 *
 * @returns {React.Component} The rendered element.
 */
const TwitterDescriptionText = styled.p`
	font-size: 14px;
	max-height: ${ props => props.isLarge ? "55px" : "36px" };
	line-height: 18px;
	overflow: hidden;
	margin: 0;
	margin-bottom: 2px;
	width: ${ props => props.isLarge ? "476px" : "357px" };
	color: rgb(101, 119, 134);
`;

TwitterDescriptionText.propTypes = {
	isLarge: PropTypes.bool.isRequired,
};

/**
 * Component that contains the twitter description text.
 *
 * @param {object} props The properties passed to the component.
 *
 * @returns {React.Element} The TwitterDescription component.
 */
const TwitterDescription = ( props ) =>
	<TwitterDescriptionText isLarge={ props.isLarge }>
		{ buildTruncatedText( props.description ) }
	</TwitterDescriptionText>
;

TwitterDescription.propTypes = {
	description: PropTypes.string.isRequired,
	isLarge: PropTypes.bool.isRequired,
};

export default TwitterDescription;
