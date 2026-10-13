import React from "react";
import PropTypes from "prop-types";
/* Yoast dependencies */
import { colors } from "@yoast/style-guide";
/* Internal dependencies */
import SvgIcon from "./SvgIcon";
import IconButtonBase from "./IconButtonBase";

const changingIconButtonDefaults = {
	unpressedBoxShadowColor: colors.$color_button_border,
	pressedBoxShadowColor: colors.$color_purple,
	pressedBackground: colors.$color_pink_dark,
	unpressedBackground: colors.$color_button,
	pressedIconColor: colors.$color_white,
	unpressedIconColor: colors.$color_button_text,
	hoverBorderColor: colors.$color_white,
	marksButtonStatus: "enabled",
	disabledIconColor: colors.$color_grey,
};

/**
 * Returns the ChangingIconButton component.
 *
 * @param {Object} componentProps Component props.
 *
 * @returns {ReactElement} ChangingIconButton component.
 */
const ChangingIconButton = function( componentProps ) {
	/*
	 * React 19's automatic JSX runtime no longer applies defaultProps to function components, which
	 * would drop these colours to undefined and render the button unstyled. Merging the defaults here
	 * keeps them on both runtimes; defaultProps is kept as well for classic consumers.
	 */
	const props = { ...changingIconButtonDefaults, ...componentProps };
	const buttonsAreDisabled = props.marksButtonStatus === "disabled";

	let iconColor;
	if ( buttonsAreDisabled ) {
		iconColor = props.disabledIconColor;
	} else {
		iconColor = props.pressed ? props.pressedIconColor : props.unpressedIconColor;
	}

	return (
		<IconButtonBase
			disabled={ buttonsAreDisabled }
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
			unpressedIconColor={ buttonsAreDisabled ? props.disabledIconColor : props.unpressedIconColor }
			pressedIconColor={ props.pressedIconColor }
			hoverBorderColor={ props.hoverBorderColor }
			className={ props.className }
		>
			<SvgIcon
				icon={ props.icon }
				color={ iconColor }
				size="18px"
			/>
		</IconButtonBase>
	);
};

ChangingIconButton.propTypes = {
	id: PropTypes.string.isRequired,
	ariaLabel: PropTypes.string.isRequired,
	onClick: PropTypes.func.isRequired,
	unpressedBoxShadowColor: PropTypes.string,
	pressedBoxShadowColor: PropTypes.string,
	pressedBackground: PropTypes.string,
	unpressedBackground: PropTypes.string,
	pressedIconColor: PropTypes.string,
	unpressedIconColor: PropTypes.string,
	icon: PropTypes.string.isRequired,
	pressed: PropTypes.bool.isRequired,
	hoverBorderColor: PropTypes.string,
	marksButtonStatus: PropTypes.string,
	disabledIconColor: PropTypes.string,
	className: PropTypes.string,
};

// Kept for classic-runtime consumers; the in-component merge applies these on React 19.
ChangingIconButton.defaultProps = changingIconButtonDefaults;

export default ChangingIconButton;
