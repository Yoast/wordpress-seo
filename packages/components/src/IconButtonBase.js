import styled from "styled-components";
import { colors, rgba } from "@yoast/style-guide";

const IconButtonBase = styled.button`
	align-items: center;
	justify-content: center;
	box-sizing: border-box;
	min-width: 32px;
	display: inline-flex;
	border: 1px solid ${ colors.$color_button_border };
	background-color: ${ props => props.pressed ? props.pressedBackground : props.unpressedBackground };
	box-shadow: ${ props => props.pressed
		? `inset 0 2px 0 ${ rgba( props.pressedBoxShadowColor, 0.7 ) }`
		: `0 1px 0 ${ rgba( props.unpressedBoxShadowColor, 0.7 ) }` };
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

export default IconButtonBase;
