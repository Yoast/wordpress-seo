import React from "react";
import PropTypes from "prop-types";

/* Yoast dependencies */
import { colors } from "@yoast/style-guide";

/* Internal dependencies */
import IconButtonBase from "./IconButtonBase";

/**
 * Returns the IconAIFixesButton component.
 *
 * @param {Object} props Component props.
 *
 * @returns {ReactElement} IconAIFixesButton component.
 */
const IconAIFixesButton = function( props ) {
	const className = props.pressed ? "" : props.className;
	return (
		<IconButtonBase
			disabled={ false }
			type="button"
			onClick={ props.onClick }
			pressed={ props.pressed }
			unpressedBoxShadowColor={ props.unpressedBoxShadowColor }
			pressedBoxShadowColor={ props.pressedBoxShadowColor }
			pressedBackground={ props.pressedBackground }
			unpressedBackground={ props.unpressedBackground }
			id={ props.id }
			aria-label={ props.ariaLabel }
			aria-pressed={ props.pressed }
			unpressedIconColor={ props.unpressedIconColor }
			pressedIconColor={ props.pressedIconColor }
			hoverBorderColor={ props.hoverBorderColor }
			className={ className }
		>
			{ props.children }
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
	disabledIconColor: PropTypes.string,
	className: PropTypes.string,
};

IconAIFixesButton.defaultProps = {
	unpressedBoxShadowColor: colors.$color_button_border,
	pressedBoxShadowColor: colors.$color_purple,
	pressedBackground: colors.$color_pink_dark,
	unpressedBackground: colors.$color_button,
	pressedIconColor: colors.$color_white,
	unpressedIconColor: colors.$color_button_text,
	hoverBorderColor: colors.$color_white,
	disabledIconColor: colors.$color_grey,
};

export default IconAIFixesButton;
