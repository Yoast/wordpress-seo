import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

const OuterWrapper = styled.div`
	background-color: #f2f3f5;
    border-bottom: 1px solid #dddfe2;
    margin: 0;
    padding: 10px 12px;
	position: relative;
	
	width: 500px;
	height: 57px;
`;

const InnerWrapper = styled.div`
	max-height: 190px;
`;
/**
 * Wrapper for all the text in the preview.
 *
 * @param {object} props The properties.
 *
 * @returns {React.Element} An element that wraps all text elements.
 */
const FacebookTextWrapper = ( props ) => {
	return ( <OuterWrapper>
		<InnerWrapper>{ props.children }</InnerWrapper>
	</OuterWrapper> );
};

FacebookTextWrapper.propTypes = {
	children: PropTypes.array.isRequired,
};

export default FacebookTextWrapper;
