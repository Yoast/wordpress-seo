import React from "react";
import PropTypes from "prop-types";
import chroma from "chroma-js";
/* Yoast dependencies */
import { colors } from "@yoast/style-guide";

/* Internal dependencies */
import AIFixesButton from "./ai-fixes-button/AIFixesButton";
import IconButtonBase from "./IconButtonBase";

// // Function to convert a hex color to RGB
// function hexToRgb(hex) {
// 	hex = hex.replace('#', '');
// 	let bigint = parseInt(hex, 16);
// 	let r = (bigint >> 16) & 255;
// 	let g = (bigint >> 8) & 255;
// 	let b = bigint & 255;
// 	return [r, g, b];
// }
//
// // Function to convert RGB to a hex color
// function rgbToHex(r, g, b) {
// 	return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
// }
//
// // Function to calculate the average color
// function averageColor(hex1, hex2) {
// 	let rgb1 = hexToRgb(hex1);
// 	let rgb2 = hexToRgb(hex2);
// 	let avgRgb = [
// 		Math.round((rgb1[0] + rgb2[0]) / 2),
// 		Math.round((rgb1[1] + rgb2[1]) / 2),
// 		Math.round((rgb1[2] + rgb2[2]) / 2)
// 	];
// 	return rgbToHex(avgRgb[0], avgRgb[1], avgRgb[2]);
// }
//
// // Example usage
// let color1 = "#FAF3F7";
// let color2 = "#EFF6FF";
// let averageHexColor = averageColor(color1, color2);
// console.log(averageHexColor); // Output: #F4F4FB

let gradientColor = chroma.scale([ "#CD82AB", "#93C5FD" ]).classes([0,0.55,1]);
console.log("Output chroma", gradientColor);

let mixGradientColor = chroma.scale([ "#CD82AB", "#93C5FD" ]).gamma(2);
console.log("Output chroma", mixGradientColor);

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
	defaultStateBackground: `linear-gradient(to bottom right, #CD82AB, #93C5FD)`,
	defaultStateBorder: `linear-gradient(${direction}, ${yoastPrimary300}, ${blue300})`,
	hoverStateBackground: `linear-gradient(${direction}, ${yoastPrimary100}, ${blue100})`,
	hoverStateBorder: `linear-gradient(${direction}, ${yoastPrimary300}, ${blue300})`,
	pressedStateBackground: `linear-gradient(${direction}, ${yoastPrimary500}, ${blue500})`,
	pressedStateBorder: `none`,
};

const test = gradientEffect.defaultStateBackground;
console.log("Output test", test);

/**
 * Returns the IconAIFixesButton component.
 *
 * @param {Object} props Component props.
 *
 * @returns {JSX.Element} IconAIFixesButton component.
 */
const IconAIFixesButton = function (props) {
	return (
		<IconButtonBase
			disabled={false}
			type="button"
			onClick={props.onClick}
			pressed={props.pressed}
			unpressedBoxShadowColor={props.unpressedBoxShadowColor}
			pressedBoxShadowColor={ props.pressedBoxShadowColor }
			pressedBackground={ props.pressedBackground }
			unpressedBackground={props.unpressedBackground}
			id={props.id}
			aria-label={props.ariaLabel}
			aria-pressed={props.pressed}
			unpressedIconColor={ props.unpressedIconColor }
			pressedIconColor={props.pressedIconColor}
			hoverBorderColor={props.hoverBorderColor}
			className={props.className}
		>
			{props.children}
		</IconButtonBase>
	);
};

IconAIFixesButton.propTypes = {
	children: PropTypes.node,
	id: PropTypes.string.isRequired,
	ariaLabel: PropTypes.string.isRequired,
	onClick: PropTypes.func,
	unpressedBoxShadowColor: PropTypes.string,
	pressedBoxShadowColor: PropTypes.string,
	pressedBackground: PropTypes.string,
	unpressedBackground: PropTypes.string,
	pressedIconColor: PropTypes.string,
	unpressedIconColor: PropTypes.string,
	pressed: PropTypes.bool.isRequired,
	hoverBorderColor: PropTypes.string,
	className: PropTypes.string,
};

IconAIFixesButton.defaultProps = {
	unpressedBoxShadowColor: colors.$color_button_border,
	pressedBoxShadowColor: colors.$color_purple,
	pressedBackground: gradientColor,
	unpressedBackground: "linear-gradient(to bottom right, #CD82AB, #93C5FD)",
	pressedIconColor: colors.$color_white,
	unpressedIconColor: colors.$color_button_text,
	hoverBorderColor: colors.$color_white,
};

export default IconAIFixesButton;
