import styled from "styled-components";
import colors from "../../../style-guide/colors.json";

/**
 * Returns a basic styled button.
 *
 * @param {object} props Component props.
 *
 * @returns {ReactElement} Styled button.
 */
export const Button = styled.button`
	display: inline-block;
	padding: 8px 10px;
	border: 1px solid ${ colors.$color_button_border };
	border-radius: 4px;
	background: ${ colors.$color_button };
	color: ${ colors.$color_button_text };
	cursor: pointer;
	box-sizing: border-box;
	font-size: inherit;
	font-family: inherit;
	font-weight: inherit;
	outline: none;
`;

Button.defaultProps = {
	type: "button",
};

/**
 * Returns a button styled for the SnippetPreview.
 *
 * @param {object} props Component props.
 *
 * @returns {ReactElement} Styled button.
 */
export const SnippetPreviewButton = styled( Button )`
	line-height: 15px;
	font-size: 0.8rem;
`;

/**
 * Returns a component with applied focus styles
 *
 * @param {ReactElement} component The original component
 *
 * @returns {ReactElement} Component with applied focus styles
 */
export function focus( component ) {
	return styled( component )`
		&::-moz-focus-inner {
			border-width: 0;
			padding: 0;
		}

		&:focus {
			border-color: ${ colors.$color_blue };
			background-color: ${ colors.$color_white };
			box-shadow: 0 0 3px ${ colors.$palette_blue_dark };
		}
	`;
}
