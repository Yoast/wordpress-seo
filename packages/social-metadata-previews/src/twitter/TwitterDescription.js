/* External dependencies */
import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

let TwitterDescriptionWrapper;

/**
 * Defines the TwitterDescriptionWrapper component.
 *
 * @param {string} cardType The card type.
 *
 * @returns {React.Component} The component.
 */
const defineTwitterDescriptionWrapper = ( cardType ) => {
	if ( cardType === "summary" ) {
		TwitterDescriptionWrapper = styled.p`
		font-size: 14px;
		max-height: 54.6px;
		line-height: 18.2px;
		overflow: hidden;
		margin-bottom: 4.52662px;
		width: 476px;
`;
		return TwitterDescriptionWrapper;
	}

	TwitterDescriptionWrapper = styled.p`
		font-size: 14px;
		max-height: 36.4px;
		line-height: 18.2px;
		overflow: hidden;
		margin-bottom: 4.52662px;
		width: 476px;
`;
	return TwitterDescriptionWrapper;
};

/**
 * Renders a TwitterDescription component.
 *
 * @param {object} props The props.
 *
 * @returns {React.Element} The rendered element.
 */
const TwitterDescription = ( props ) => {
	defineTwitterDescriptionWrapper( props.type );

	return (
		<TwitterDescriptionWrapper>
			{ props.description }
		</TwitterDescriptionWrapper>
	);
};

TwitterDescription.propTypes = {
	description: PropTypes.string.isRequired,
	type: PropTypes.string.isRequired,
};

export default TwitterDescription;
