import React from "react";
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
 * @deprecated Use the Button component from @yoast/ui-library instead.
 *
 * @param {Object} componentProps Component props.
 * @param {string} componentProps.id The id of the button.
 * @param {string} componentProps.ariaLabel The aria-label of the button.
 * @param {Function} componentProps.onClick The function to call when the button is clicked.
 * @param {string} [componentProps.unpressedBoxShadowColor] The box shadow color when the button is not pressed.
 * @param {string} [componentProps.pressedBoxShadowColor] The box shadow color when the button is pressed.
 * @param {string} [componentProps.pressedBackground] The background color when the button is pressed.
 * @param {string} [componentProps.unpressedBackground] The background color when the button is not pressed.
 * @param {string} [componentProps.pressedIconColor] The icon color when the button is pressed.
 * @param {string} [componentProps.unpressedIconColor] The icon color when the button is not pressed.
 * @param {string} componentProps.icon The name of the icon.
 * @param {boolean} componentProps.pressed Whether the button is pressed.
 * @param {string} [componentProps.hoverBorderColor] The border color on hover.
 * @param {string} [componentProps.marksButtonStatus="enabled"] The status of the button. The button is disabled when "disabled".
 * @param {string} [componentProps.disabledIconColor] The icon color when the button is disabled.
 * @param {string} [componentProps.className] The class name of the button.
 *
 * @returns {ReactElement} ChangingIconButton component.
 */
const ChangingIconButton = function( componentProps ) {
	console.warn( "The IconButtonToggle component has been deprecated and will be removed in a future release. Use the Button component from @yoast/ui-library instead." );

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

// Kept for classic-runtime consumers; the in-component merge applies these on React 19.
ChangingIconButton.defaultProps = changingIconButtonDefaults;

export default ChangingIconButton;
