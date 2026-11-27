// External dependencies.
import React from "react";
import styled from "styled-components";
import flow from "lodash/flow";
import omit from "lodash/omit";

// Yoast dependencies.
import { colors } from "@yoast/style-guide";
import SvgIcon from "../SvgIcon";

// Internal dependencies.
import { addActiveStyle, addFocusStyle, addHoverStyle } from "./Button";

/**
 * Returns a component with all button selector styles applied.
 *
 * @param {ReactElement} component The original component.
 *
 * @returns {ReactElement} Component with applied styles.
 */
const addButtonStyles = flow( [
	/*
	 * Styled-components applies the generated CSS classes in a reversed order,
	 * but we want them in the order: base - hover - focus - active.
	 */
	addActiveStyle,
	addFocusStyle,
	addHoverStyle,
] );

/**
 * Returns a basic styled button.
 *
 * @param {Object} props Component props.
 *
 * @returns {ReactElement} Styled button.
 */
const IconLabelledBaseButton = addButtonStyles(
	styled.button`
		display: inline-flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		cursor: pointer;
		box-sizing: border-box;
		border: 1px solid transparent;
		margin: 0;
		padding: 8px;
		overflow: visible;
		font-family: inherit;
		font-weight: inherit;
		color: ${ props => props.textColor };
		background: ${ props => props.backgroundColor };
		font-size: ${ props => props.textFontSize };

		svg {
			margin: 0 0 8px;
			flex-shrink: 0;
			fill: currentColor;
			// Safari 10
			align-self: center;
		}

		&:active {
			box-shadow: none;
		}
	`
);

/**
 * Returns an icon button that can optionally contain text.
 *
 * @param {Object} props Component props.
 * @param {string} [props.type="button"] The type of the button.
 * @param {string} props.icon The name of the icon.
 * @param {string} [props.textColor] The color of the text and the icon.
 * @param {string} [props.textFontSize="inherit"] The font size of the text.
 * @param {string} [props.backgroundColor="transparent"] The background color of the button.
 * @param {string} [props.borderColor="transparent"] The border color of the button.
 * @param {string} [props.hoverColor] The text color on hover.
 * @param {string} [props.hoverBackgroundColor] The background color on hover.
 * @param {string} [props.hoverBorderColor] The border color on hover.
 * @param {string} [props.activeColor] The text color when active.
 * @param {string} [props.activeBackgroundColor] The background color when active.
 * @param {string} [props.activeBorderColor] The border color when active.
 * @param {string} [props.focusColor] The text color on focus.
 * @param {string} [props.focusBackgroundColor] The background color on focus.
 * @param {string} [props.focusBorderColor] The border color on focus.
 * @param {string} [props.focusBoxShadowColor] The box shadow color on focus.
 * @param {(import("react").ReactNode[]|import("react").ReactNode|string)} props.children The label of the button.
 *
 * @returns {ReactElement} Styled icon button.
 */
const IconLabeledButton = ( {
	type = "button",
	textColor = colors.$color_blue,
	textFontSize = "inherit",
	backgroundColor = "transparent",
	borderColor = "transparent",
	hoverColor = colors.$color_white,
	hoverBackgroundColor = colors.$color_blue,
	hoverBorderColor = colors.$color_button_border_hover,
	activeColor = colors.$color_white,
	activeBackgroundColor = colors.$color_blue,
	activeBorderColor = colors.$color_button_border_active,
	focusColor = colors.$color_white,
	focusBackgroundColor = colors.$color_blue,
	focusBorderColor = colors.$color_blue,
	focusBoxShadowColor = colors.$color_blue_dark,
	...props
} ) => {
	const { children, icon } = props;

	const newProps = omit( {
		...props,
		type,
		textColor,
		textFontSize,
		backgroundColor,
		borderColor,
		hoverColor,
		hoverBackgroundColor,
		hoverBorderColor,
		activeColor,
		activeBackgroundColor,
		activeBorderColor,
		focusColor,
		focusBackgroundColor,
		focusBorderColor,
		focusBoxShadowColor,
	}, "icon" );

	return (
		<IconLabelledBaseButton { ...newProps }>
			<SvgIcon icon={ icon } color={ textColor } />
			{ children }
		</IconLabelledBaseButton>
	);
};

export default IconLabeledButton;
