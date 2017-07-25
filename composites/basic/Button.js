import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const StyledButton = styled.button`
	display: inline-block;
	padding: 8px 10px;
    border: 1px solid #dbdbdb;
    border-radius: 4px;
    color: #555;
    background: #f7f7f7;
    font-size: 0.8rem;
    line-height: 15px;
    cursor: pointer;
    box-sizing: border-box;
    font-family: inherit;
    font-weight: inherit;
    
    :focus {
		border-color: #5b9dd9;
		outline: none;
		color: #23282d;
		background-color: #fafafa;
		box-shadow: 0 0 3px rgba(0, 115, 170, 0.8);
    }
`;

/**
 * @summary:
 * Returns a basic styled button
 *
 * @param {object} props Component props
 *
 * @returns {ReactElement} Styled button
 */
function Button( props ) {
	return (
		<StyledButton onClick={props.onClick}>
			{props.children}
		</StyledButton>
	);
}

Button.propTypes = {
	onClick: PropTypes.func.isRequired,
	children: PropTypes.any,
};

export default Button;
