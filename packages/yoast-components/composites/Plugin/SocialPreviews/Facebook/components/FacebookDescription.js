import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

const FacebookDescriptionWrapper = styled.p`
    color: #606770;
    font-size: 14px;
    line-height: 20px;
    word-break: break-word;
    max-height: 80px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
    margin-top: 3px;
`;

/**
 * Renders a FacebookDescription component.
 *
 * @param {object} props The props.
 *
 * @returns {React.Element} The rendered element.
 */
const FacebookDescription = ( props ) => {
	return (
		<FacebookDescriptionWrapper>
			{ props.description }
		</FacebookDescriptionWrapper>
	);
};

FacebookDescription.propTypes = {
	description: PropTypes.string.isRequired,
};

export default FacebookDescription;
