/* External dependencies */
import styled from "styled-components";
import PropTypes from "prop-types";

/**
 * Renders a TwitterDescription component.
 *
 * @param {object} props The props.
 *
 * @returns {React.Component} The rendered element.
 */
const TwitterDescription = styled.p`
	font-size: 14px;
	max-height: ${ props => props.isLarge ? "36px" : "55px" };
	line-height: 18px;
	overflow: hidden;
	margin-bottom: 5px;
	width: ${ props => props.isLarge ? "476px" : "357px" };
`;

TwitterDescription.propTypes = {
	isLarge: PropTypes.bool.isRequired,
};

export default TwitterDescription;
