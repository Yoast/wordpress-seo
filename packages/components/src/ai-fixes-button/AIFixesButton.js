import styled from "styled-components";
import { colors, rgba } from "@yoast/style-guide";
import IconButtonBase from "../IconButtonBase";


const yoastPrimary50 = "#FAF3F7";
const yoastPrimary100 = "#F3E5ED";
const yoastPrimary300 = "#CD82AB";
const yoastPrimary500 = "#A61E69";
const blue50 = "#EFF6FF";
const blue100 = "#DBEAFE";
const blue300 = "#93C5FD";
const blue500 = "#3B82F6";
const direction = "to bottom right";

const gradientEffect = {
	defaultStateBackground: `linear-gradient(${direction}, ${yoastPrimary50}, ${blue50})`,
	defaultStateBorder: `linear-gradient(${direction}, ${yoastPrimary300}, ${blue300})`,
	hoverStateBackground: `linear-gradient(${direction}, ${yoastPrimary100}, ${blue100})`,
	hoverStateBorder: `linear-gradient(${direction}, ${yoastPrimary300}, ${blue300})`,
	pressedStateBackground: `linear-gradient(${direction}, ${yoastPrimary500}, ${blue500})`,
	pressedStateBorder: `none`,
};

const testColors = { fuchsia500: "#d946ef", teal500: "#14b8a6" };

// const AIFixesButton = styled(IconButtonBase)` /* linear-gradient not working in styled-components */
// 	overflow: hidden;
// 	border: 1px solid transparent;
// 	border-image: ${ gradientEffect.defaultStateBorder } 1; /* the border-radius is not applied to the border-image */
// 	background-color: ${ props => props.pressed ? gradientEffect.pressedStateBackground : props.unpressedBackground };
// 	box-shadow: ${ props => props.pressed
// 		? `inset 0 2px 0 ${ gradientEffect.pressedStateBorder }`
// 		: `0 1px 0 ${ rgba( props.unpressedBoxShadowColor, 0.7 ) }` };
// 	&&:hover {
// 		border-color: ${ props => props.hoverBorderColor };
// 		}
// 	&:disabled {
// 		background-color: ${ props => props.unpressedBackground };
// `;

const AIFixesButton = function (props) {
	return (
		<button
			className="yoast_AI-fixes-button">
			Test
		</button>
	);
};

export default AIFixesButton;
