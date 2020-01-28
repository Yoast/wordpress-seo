import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

const Wrapper = styled.div`
	display: flex;
	flex-direction: column;
	padding: 10px;
	align-items: stretch;
	margin: 0;
`;

/**
 * Wrapper for all the text in the preview.
 *
 * @param {object} props The properties.
 *
 * @returns {React.Element} An element that wraps all text elements.
 */
const TwitterTextWrapper = ( props ) => <Wrapper>
	{ props.children }
</Wrapper>;

TwitterTextWrapper.propTypes = {
	children: PropTypes.array.isRequired,
};

export default TwitterTextWrapper;
