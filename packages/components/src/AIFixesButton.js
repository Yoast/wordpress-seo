import styled from "styled-components";
import { rgba } from "@yoast/style-guide";
import IconButtonBase from "./IconButtonBase";

const yoastPrimary50 = "#FAF3F7";
const yoastPrimary100 = "#F3E5ED";
const yoastPrimary300 = "#CD82AB";
const yoastPrimary400 = "#B94986";
const yoastPrimary500 = "#A61E69";
const yoastIndigo50 = "#EEF2FF";
const yoastIndigo100 = "#E0E7FF";
const yoastIndigo300 = "#A5B4FC";
const yoastIndigo500 = "#6366F1";

const direction = "to bottom right";

const gradientEffect = {
	defaultStateBackground: `linear-gradient(${direction}, ${yoastPrimary50}, ${yoastIndigo50})`,
	defaultStateBorder: `linear-gradient(${direction}, ${yoastPrimary300}, ${yoastIndigo300}) 1`,
	hoverStateBackground: `linear-gradient(${direction}, ${yoastPrimary100}, ${yoastIndigo100})`,
	pressedStateBackground: `linear-gradient(${direction}, ${yoastPrimary500}, ${yoastIndigo500})`,
};

const AIFixesButtonBase = styled( IconButtonBase )`
	position: relative;
	border: ${ props => props.pressed ? "none" : `1px solid ${yoastIndigo300}` };
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
