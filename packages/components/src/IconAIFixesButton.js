import React from "react";
import PropTypes from "prop-types";

/* Yoast dependencies */
import { colors } from "@yoast/style-guide";

/* Internal dependencies */
import AIFixesButton from "./AIFixesButton";

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
	defaultStateBackground: `linear-gradient(to bottom right, #FAF3F7, #EFF6FF)`,
	defaultStateBorder: `linear-gradient(${direction}, ${yoastPrimary300}, ${blue300})`,
	hoverStateBackground: `linear-gradient(${direction}, ${yoastPrimary100}, ${blue100})`,
	hoverStateBorder: `linear-gradient(${direction}, ${yoastPrimary300}, ${blue300})`,
	pressedStateBackground: `linear-gradient(to bottom right, #A61E69, #3B82F6)`,
	pressedStateBorder: `none`,
};

/**
 * Returns the IconAIFixesButton component.
 *
 * @param {Object} props Component props.
 *
 * @returns {JSX.Element} IconAIFixesButton component.
 */
const IconAIFixesButton = function (props) {
	return (
		<AIFixesButton
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
		</AIFixesButton>
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
	pressedBackground: "linear- gradient(to bottom right, #A61E69, #3B82F6) ",
	unpressedBackground: "linear-gradient(to bottom right, #FAF3F7, #EFF6FF)",
	pressedIconColor: colors.$color_white,
	unpressedIconColor: colors.$color_button_text,
	hoverBorderColor: colors.$color_white,
};

export default IconAIFixesButton;
