import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

const Wrapper = styled.div`
	display: flex;
	flex-direction: column;
	padding: 12px;
	justify-content: center;
	margin: 0;
	box-sizing: border-box;
	flex: auto;
	min-width: 0px;
	gap:2px;
	> * {
		line-height:20px;
		min-height:20px;
		font-size:15px;
    }
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
