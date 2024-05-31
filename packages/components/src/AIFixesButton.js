import styled from "styled-components";
import { rgba } from "@yoast/style-guide";
import IconButtonBase from "./IconButtonBase";
import { SparklesIcon } from "@heroicons/react/outline";

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

const AIFixesButtonBase = styled(IconButtonBase)`
	overflow: hidden;
	border: 1px solid transparent;
	background: linear-gradient(white, white) padding-box,
		linear-gradient(to bottom right, #CD82AB, #93C5FD) border-box;
	/* background-image is used to set the background color of the button. */
	background-image: ${props => props.pressed ? gradientEffect.pressedStateBackground : gradientEffect.defaultStateBackground};

	svg {
		transform: scaleX(-1);
		path {
			fill: ${props => props.pressed ? props.pressedIconColor : gradientEffect.pressedStateBackground};
		}
	}

	&:hover {
		border-image: ${props => props.hoverBorderColor};
		background-image: ${props => props.pressed ? gradientEffect.pressedStateBackground : gradientEffect.hoverStateBackground};
	}
`;

export default AIFixesButtonBase;
