import React from "react";
import PropTypes from "prop-types";

/* Yoast dependencies */
import { colors } from "@yoast/style-guide";

/* Internal dependencies */
import AIFixesButton from "./AIFixesButton";

/**
 * Returns the IconAIFixesButton component.
 *
 * @param {Object} props Component props.
 *
 * @returns {JSX.Element} IconAIFixesButton component.
 */
const IconAIFixesButton = function( props ) {
	return (
		<AIFixesButton
			disabled={ props.disabled }
			type="button"
			onClick={ props.onClick }
			pressed={ props.pressed }
			onPointerEnter={ props.onPointerEnter }
			onPointerLeave={ props.onPointerLeave }
			unpressedBoxShadowColor={ props.unpressedBoxShadowColor }
			pressedBoxShadowColor={ props.pressedBoxShadowColor }
			pressedBackground={ props.pressedBackground }
			unpressedBackground={ props.unpressedBackground }
			id={ props.id }
			aria-label={ props.ariaLabel }
			aria-pressed={ props.pressed }
			pressedIconColor={ props.pressedIconColor }
			className={ props.className }
		>
			{ props.children }
		</AIFixesButton>
	);
};

IconAIFixesButton.propTypes = {
	disabled: PropTypes.bool,
	children: PropTypes.node,
	id: PropTypes.string.isRequired,
	ariaLabel: PropTypes.string,
	onClick: PropTypes.func,
	onPointerEnter: PropTypes.func,
	onPointerLeave: PropTypes.func,
	unpressedBoxShadowColor: PropTypes.string,
	pressedBoxShadowColor: PropTypes.string,
	pressedBackground: PropTypes.string,
	unpressedBackground: PropTypes.string,
	pressedIconColor: PropTypes.string,
	pressed: PropTypes.bool.isRequired,
	className: PropTypes.string,
};

IconAIFixesButton.defaultProps = {
	disabled: false,
	unpressedBoxShadowColor: colors.$color_button_border,
	pressedBoxShadowColor: colors.$color_purple,
	pressedBackground: "linear- gradient(to bottom right, #A61E69, #3B82F6)",
	unpressedBackground: "linear-gradient(to bottom right, #FAF3F7, #EFF6FF)",
	pressedIconColor: colors.$color_white,
	onClick: () => {},
	onPointerEnter: () => {},
	onPointerLeave: () => {},
};

export default IconAIFixesButton;
