import styled from "styled-components";
import { getDirectionalStyle } from "@yoast/helpers";
import { colors } from "@yoast/style-guide";
import { Button, VariableEditorInputContainer } from "@yoast/components";

const greyPlaceholderColor = "#707070";

export const TitleInputContainer = styled( VariableEditorInputContainer )`
	.public-DraftStyleDefault-block {
		// Don't use properties that trigger hasLayout in IE11.
		line-height: 24px;
	}

	.public-DraftEditorPlaceholder-root {
		color: ${greyPlaceholderColor};
	}

	.public-DraftEditorPlaceholder-hasFocus {
		color: ${greyPlaceholderColor};
	}
`;

export const DescriptionInputContainer = styled( VariableEditorInputContainer )`
	min-height: 72px;
	padding: 2px 6px;
	line-height: 24px;

	.public-DraftEditorPlaceholder-root {
		color: ${greyPlaceholderColor};
		position: absolute;
	}

	.public-DraftEditorPlaceholder-hasFocus {
		color: ${greyPlaceholderColor};
		position: absolute;
	}
`;

export const FormSection = styled.div`
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	justify-content: space-between;
	margin: 16px 0 0 0;
`;

export const StandardButton = styled( Button )`
	color: #303030;
	box-sizing: border-box;
	border-radius: 4px;
	box-shadow: inset 0 -2px 0 0 rgba(0,0,0,0.1);
	font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
	padding: 4px;
	border: 1px solid #dbdbdb;
	font-size: 14px;
	font-weight: 400;
	line-height: 1.5;
	margin-bottom: 5px;
	width: 112px;
	height: 40px;
`;

export const TriggerReplacementVariableSuggestionsButton = styled( StandardButton )`
	font-size: 13px;
	width: 103px;
	height: 28px;
	& svg {
		${ getDirectionalStyle( "margin-right", "margin-left" ) }: 7px;
		fill: ${ colors.$color_grey_dark };
	}
`;
