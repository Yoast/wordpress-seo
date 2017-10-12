import React from "react";
import styled from "styled-components";
import flow from "lodash/flow";
import omit from "lodash/omit";
import PropTypes from "prop-types";

import colors from "../../../../style-guide/colors.json";
import { Icon } from "./Icon";
import { rgba } from "../../../../style-guide/helpers";

const settings = {
	minHeight: 32,
	verticalPadding: 4,
	borderWidth: 1,
};

const ieMinHeight = settings.minHeight - ( settings.verticalPadding * 2 ) - ( settings.borderWidth * 2 );

/**
 * Returns a component with applied base button styles.
 *
 * @param {ReactElement} component The original component.
 *
 * @returns {ReactElement} Component with applied base button styles.
 */
export function addBaseStyle( component ) {
	return styled( component )`
		display: inline-flex;
		align-items: center;
		justify-content: center;
		vertical-align: middle;
		border-width: ${ `${ settings.borderWidth }px` };
		border-style: solid;
		margin: 0;
		padding: ${ `${ settings.verticalPadding }px` } 10px;
		border-radius: 3px;
		cursor: pointer;
		box-sizing: border-box;
		font-size: inherit;
		font-family: inherit;
		font-weight: inherit;
		text-align: left;
		overflow: visible;
		min-height: ${ `${ settings.minHeight }px` };

		svg {
			// Safari 10
			align-self: center;
		}

		// Only needed for IE 10+.
		@media all and ( -ms-high-contrast: none ), ( -ms-high-contrast: active ) {
			::after {
				display: inline-block;
				content: "";
				min-height: ${ `${ ieMinHeight }px` };
			}
		}
	`;
}

/**
 * Returns a component with applied focus styles.
 *
 * @param {ReactElement} component The original component.
 *
 * @returns {ReactElement} Component with applied focus styles.
 */
export function addFocusStyle( component ) {
	return styled( component )`
		&::-moz-focus-inner {
			border-width: 0;
		}

		&:focus {
			outline: none;
			border-color: ${ colors.$color_blue };
			background-color: ${ props => props.focusBackgroundColor };
			box-shadow: 0 0 3px ${ rgba( colors.$color_blue_dark, .8 ) };
		}
	`;
}

addFocusStyle.propTypes = {
	focusBackgroundColor: PropTypes.string,
};

addFocusStyle.defaultProps = {
	focusBackgroundColor: colors.$color_white,
};

/**
 * Returns a component with applied hover styles.
 *
 * @param {ReactElement} component The original component.
 *
 * @returns {ReactElement} Component with applied hover styles.
 */
export function addHoverStyle( component ) {
	return styled( component )`
		&:hover {
			background-color: ${ props => props.hoverBackgroundColor };
			border-color: ${ props => props.hoverBorderColor };
			color: ${ colors.$color_button_text_hover };
		}
	`;
}

addHoverStyle.propTypes = {
	hoverBackgroundColor: PropTypes.string,
	hoverBorderColor: PropTypes.string,
};

addHoverStyle.defaultProps = {
	hoverBackgroundColor: colors.$color_button_hover,
	hoverBorderColor: colors.$color_button_border_hover,
};

/**
 * Returns a component with applied active styles.
 *
 * @param {ReactElement} component The original component.
 *
 * @returns {ReactElement} Component with applied active styles.
 */
export function addActiveStyle( component ) {
	return styled( component )`
		&:active {
			background-color: ${ props => props.activeBackgroundColor };
			border-color: ${ props => props.activeBorderColor };
			box-shadow: inset 0 2px 5px -3px ${ rgba( colors.$color_button_border_active, 0.5 ) };
		}
	`;
}

addActiveStyle.propTypes = {
	activeBackgroundColor: PropTypes.string,
	activeBorderColor: PropTypes.string,
};

addActiveStyle.defaultProps = {
	activeBackgroundColor: colors.$color_button,
	activeBorderColor: colors.$color_button_border_hover,
};

/**
 * Returns a component with applied font size style.
 *
 * @param {ReactElement} component The original component.
 *
 * @returns {ReactElement} Component with applied font size styles.
 */
export function addFontSizeStyles( component ) {
	return styled( component )`
		font-size: 0.8rem;
	`;
}

/**
 * Returns a component with all button selector styles applied.
 *
 * @param {ReactElement} component The original component.
 *
 * @returns {ReactElement} Component with applied styles.
 */
export const addButtonStyles = flow( [ addBaseStyle, addFocusStyle, addHoverStyle, addActiveStyle ] );

/**
 * Returns a basic styled button.
 *
 * @param {object} props Component props.
 *
 * @returns {ReactElement} Styled button.
 */
export const BaseButton = addButtonStyles(
	styled.button`
		color: ${ props => props.textColor };
		border-color: ${ props => props.borderColor };
		background: ${ props => props.backgroundColor };
		box-shadow: 0 1px 0 ${ props => rgba( props.boxShadowColor, 1 ) };
	`
);

BaseButton.propTypes = {
	backgroundColor: PropTypes.string,
	textColor: PropTypes.string,
	borderColor: PropTypes.string,
	boxShadowColor: PropTypes.string,
};

BaseButton.defaultProps = {
	backgroundColor: colors.$color_button,
	textColor: colors.$color_button_text,
	borderColor: colors.$color_button_border,
	boxShadowColor: colors.$color_button_border,
	type: "button",
};

/**
 * Returns a styled Button with set font size.
 *
 * @param {object} props Component props.
 *
 * @returns {ReactElement} Styled button.
 */
export const Button = addFontSizeStyles( BaseButton );

/**
 * Applies styles to icon for IconButton with text.
 *
 * @param {ReactElement} icon The original icon.
 *
 * @returns {ReactElement} Icon with text styles applied.
 */
function addIconTextStyle( icon ) {
	return styled( icon )`
		margin: 0 8px 0 0;
		flex-shrink: 0;
	`;
}

/**
 * Returns an icon button that can optionally contain text.
 *
 * @param {object} props Component props.
 *
 * @returns {ReactElement} Styled icon button.
 */
export const IconButton = ( props ) => {
	const { children: text, icon, iconColor } = props;

	let IconComponent = Icon;
	if ( text ) {
		IconComponent = addIconTextStyle( IconComponent );
	}

	const newProps = omit( props, "icon" );

	return (
		<Button { ...newProps }>
			<IconComponent icon={ icon } color={ iconColor } />
			{ text }
		</Button>
	);
};

IconButton.propTypes = {
	icon: PropTypes.func.isRequired,
	iconColor: PropTypes.string.isRequired,
	children: PropTypes.string,
};

export const ChangingIconButtonBase = ( props ) => {
	let backgroundColor = props.checked ? props.checkedBackground : props.uncheckedBackground;
	return <IconButton
		icon={ props.checked ? props.checkedIcon : props.uncheckedIcon }
		iconColor={ props.checked ? props.checkedIconColor : props.uncheckedIconColor }
		backgroundColor={ backgroundColor }
		hoverBackgroundColor={ backgroundColor }
		focusBackgroundColor={ backgroundColor }
		activeBackgroundColor={ backgroundColor }
		hoverBorderColor={ colors.$color_button_border }
		focusBorderColor={ colors.$color_button_border }
		activeBorderColor={ colors.$color_button_border }
		onClick={ props.onClick }
		height="24px"
		min-height="!important 0"
	/>;
};

ChangingIconButtonBase.propTypes = {
	onClick: PropTypes.func.isRequired,
	checked: PropTypes.bool,
	uncheckedIcon: PropTypes.string,
	checkedIcon: PropTypes.string,
	uncheckedIconColor: PropTypes.string,
	uncheckedBackground: PropTypes.string,
	checkedIconColor: PropTypes.string,
	checkedBackground: PropTypes.string,
	children: PropTypes.string,
};

/*
const ChangingIconButtonBase = styled( IconButton )`
	height: ${ props => props.checked ? "25px" : "24px" };
`;
*/

/**
 * Returns a component with applied changing icon button styles.
 *
 * @param {ReactElement} component The original component.
 *
 * @returns {ReactElement} Component with applied changing icon button styles.
 */
export function addChangingIconButtonStyles( component ) {
	return styled( component )`
		min-height: 0 !important; 
		height: 24px;
	`;
}

export const ChangingIconButton = ( props ) => {
	return (
		<ChangingIconButtonBase
			onClick={ props.onClick }
			checked={ props.checked }
			checkedIcon={ props.checkedIcon }
			checkedIconColor={ props.checkedIconColor }
			uncheckedIcon={ props.uncheckedIcon }
			uncheckedIconColor={ props.uncheckedIconColor }
			uncheckedBoxShadowColor={ props.uncheckedBoxShadowColor }
			checkedBoxShadowColor={ props.checkedBoxShadowColor }
			checkedBackground={ props.checkedBackground }
			uncheckedBackground={ props.uncheckedBackground }
			aria-checked={ props.checked }
		/>
	);
};

ChangingIconButton.propTypes = {
	onClick: PropTypes.func.isRequired,
	boxShadowColor: PropTypes.string,
	uncheckedBoxShadowColor: PropTypes.string,
	checkedBoxShadowColor: PropTypes.string,
	checkedBackground: PropTypes.string,
	uncheckedBackground: PropTypes.string,
	checkedIconColor: PropTypes.string,
	uncheckedIconColor: PropTypes.string,
	checkedIcon: PropTypes.func.isRequired,
	uncheckedIcon: PropTypes.func.isRequired,
	checked: PropTypes.bool.isRequired,
	height: PropTypes.string,
	minHeight: PropTypes.string,
};

ChangingIconButton.defaultProps = {
	uncheckedBoxShadowColor: colors.$color_button_border,
	checkedBoxShadowColor: colors.$color_purple,
	checkedBackground: colors.$color_pink_dark,
	uncheckedBackground: colors.$color_button,
	checkedIconColor: colors.$color_white,
	uncheckedIconColor: colors.$color_button_text,
};

export const ChangingIconButton2 = addChangingIconButtonStyles( ChangingIconButton );
