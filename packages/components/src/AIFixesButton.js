import styled from "styled-components";
import { rgba } from "@yoast/style-guide";
import IconButtonBase from "./IconButtonBase";

const yoastPrimary50 = "#FAF3F7";
const yoastPrimary100 = "#F3E5ED";
const yoastPrimary300 = "#CD82AB";
const yoastPrimary400 = "#B94986";
const yoastPrimary500 = "#A61E69";
const blue50 = "#EFF6FF";
const blue100 = "#DBEAFE";
const blue300 = "#93C5FD";
const blue500 = "#3B82F6";

const direction = "to bottom right";

const gradientEffect = {
	defaultStateBackground: `linear-gradient(${direction}, ${yoastPrimary50}, ${blue50})`,
	defaultStateBorder: `linear-gradient(${direction}, ${yoastPrimary300}, ${blue300}) 1`,
	hoverStateBackground: `linear-gradient(${direction}, ${yoastPrimary100}, ${blue100})`,
	pressedStateBackground: `linear-gradient(${direction}, ${yoastPrimary500}, ${blue500})`,
};

const AIFixesButtonBase = styled( IconButtonBase )`
	overflow: hidden;
	border: ${ props => props.pressed ? "none" : "1px solid transparent" };
	border-image: ${ props => props.pressed ? "none" : gradientEffect.defaultStateBorder };
	clip-path: inset(0 round 3px);
	background-image: ${ props => props.pressed
		? gradientEffect.pressedStateBackground
		: gradientEffect.defaultStateBackground } !important;
	box-shadow: ${ props => props.pressed
		? `inset 0 -2px 0 ${ yoastPrimary400 }`
		: `0 1px 0 ${ rgba( props.unpressedBoxShadowColor, 0.7 ) }` };
	&:hover {
		background-image:  ${ props => props.pressed
			? gradientEffect.pressedStateBackground
			: gradientEffect.hoverStateBackground } !important;
	}
`;

export default AIFixesButtonBase;
