/* External dependencies */
import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

const TwitterDescriptionWrapper = styled.p`
	font-size: 14px;
    max-height: 36.4px;
    line-height: 18.2px;
    overflow: hidden;
    margin-bottom: 4.52662px;
    width: 476px;
	//white-space: nowrap;
	//text-overflow: ellipsis;
`;

/**
 * Renders a TwitterDescription component.
 *
 * @param {object} props The props.
 *
 * @returns {React.Element} The rendered element.
 */
const TwitterDescription = ( props ) => {
	return (
		<TwitterDescriptionWrapper>
			{ props.description }
		</TwitterDescriptionWrapper>
	);
};

TwitterDescription.propTypes = {
	description: PropTypes.string.isRequired,
};

export default TwitterDescription;
