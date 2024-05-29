import styled from "styled-components";
import { colors, rgba } from "@yoast/style-guide";
import IconButtonBase from "./IconButtonBase";

const yoastPrimary50 = '#CD82AB';
const yoastPrimary100 = '#A61E69';
const yoastPrimary500 = '#A61E69';
const blue50 = '#EFF6FF';
const blue100 = '#93C5FD';
const blue500 = '#3B82F6';
const direction = 'to bottom right';

const gradientEffect = {
	defaultState: `linear-gradient(${direction}, ${yoastPrimary50}, ${blue50})`,
	hoverState: `linear-gradient(${direction}, ${yoastPrimary100}, ${blue100})`,
	pressedState: `linear-gradient(${direction}, ${yoastPrimary500}, ${blue500})`
};

const AIFixesButtonBase = styled(IconButtonBase)`
	border: 1px solid ${ gradientEffect.defaultState };
	border-image: ${ gradientEffect.defaultState } 1;
	background-color: ${ props => props.pressed ? props.pressedBackground : props.unpressedBackground };
	box-shadow: ${ props => props.pressed
		? `inset 0 2px 0 ${ rgba( props.pressedBoxShadowColor, 0.7 ) }`
		: `0 1px 0 ${ rgba( props.unpressedBoxShadowColor, 0.7 ) }` };
	&:hover {
		border-color: ${ props => props.hoverBorderColor };
		}
	&:disabled {
		background-color: ${ props => props.unpressedBackground };
`;

export default AIFixesButtonBase;
