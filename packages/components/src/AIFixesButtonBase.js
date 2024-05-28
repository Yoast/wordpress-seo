import styled from "styled-components";
import { colors, rgba } from "@yoast/style-guide";

const AIFixesButtonBase = styled.button`
	align-items: center;
	justify-content: center;
	box-sizing: border-box;
	min-width: 32px;
	display: inline-flex;
	border: 5px dotted ${ colors.$color_button_border };
	background-color: ${ props => props.pressed ? props.pressedBackground : props.unpressedBackground };
	box-shadow: ${ props => props.pressed
		? `inset 0 2px 0 ${ rgba( props.pressedBoxShadowColor, 0.2 ) }`
		: `0 1px 0 ${ rgba( props.unpressedBoxShadowColor, 0.6 ) }` };
	border-radius: 3px;
	cursor: pointer;
	padding: 0;
	height: 24px;

	&:hover {
		border-color: ${ props => props.hoverBorderColor };
	}
	&:disabled {
		background-color: ${ props => props.unpressedBackground };
		box-shadow: none;
		border: none;
		cursor: default;
	}
`;

export default AIFixesButtonBase;
