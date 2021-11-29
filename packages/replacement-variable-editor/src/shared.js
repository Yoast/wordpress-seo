import styled from "styled-components";
import { getDirectionalStyle } from "@yoast/helpers";
import { colors } from "@yoast/style-guide";
import { Button, VariableEditorInputContainer } from "@yoast/components";

const greyPlaceholderColor = "#707070";

export const TitleInputContainer = styled( VariableEditorInputContainer )`
	.public-DraftStyleDefault-block {
		line-height: 1.85714285; // 26px based on 14px font-size
	}

	.public-DraftEditorPlaceholder-root {
		color: ${greyPlaceholderColor};
		line-height: 1.85714285; // 26px based on 14px font-size
	}

	.public-DraftEditorPlaceholder-hasFocus {
		color: ${greyPlaceholderColor};
	}
`;

export const DescriptionInputContainer = styled( VariableEditorInputContainer )`
	min-height: 72px;
	padding: 4px 5px;
	line-height: 1.85714285; // 26px based on 14px font-size

	.public-DraftEditorPlaceholder-root {
		color: ${greyPlaceholderColor};
		position: absolute;
		line-height: 1.85714285; // 26px based on 14px font-size
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
	max-width: 200px;
	padding: 0 0.5em;
`;

export const TriggerReplacementVariableSuggestionsButton = styled( StandardButton )`
	font-size: 13px;
	margin-left: auto;
	& svg {
		${ getDirectionalStyle( "margin-right", "margin-left" ) }: 7px;
		fill: ${ colors.$color_grey_dark };
	}
`;
