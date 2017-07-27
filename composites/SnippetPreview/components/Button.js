import styled from "styled-components";
import colors from "../../../style-guide/colors.json";

/**
 * @summary Returns a basic styled button.
 *
 * @param {object} props Component props.
 *
 * @returns {ReactElement} Styled button.
 */
export const Button = styled.button`
	display: inline-block;
	padding: 8px 10px;
	border: 1px solid ${colors.$color_button_border};
	border-radius: 4px;
	background: ${colors.$color_button};
	color: ${colors.$color_button_text};
	cursor: pointer;
	box-sizing: border-box;
	font-size: inherit;
	font-family: inherit;
	font-weight: inherit;

	::-moz-focus-inner,
	[type="reset"]::-moz-focus-inner,
	[type="button"]::-moz-focus-inner,
	[type="submit"]::-moz-focus-inner {
		border-width: 0;
		border-style: none;
		padding: 0;
	}
`;

Button.defaultProps = {
	type: "button",
	className: [ "button", "yoast-button" ],
};

/**
 * @summary Returns a button styled for the SnippetPreview.
 *
 * @param {object} props Component props.
 *
 * @returns {ReactElement} Styled button.
 */
export const SnippetPreviewButton = styled( Button )`
	line-height: 15px;
	font-size: 0.8rem;
`;
