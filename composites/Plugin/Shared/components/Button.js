import React from "react";
import styled from "styled-components";
import _flow from "lodash/flow";
import _omit from "lodash/omit";
import PropTypes from "prop-types";

import colors from "../../../../style-guide/colors.json";
import { Icon } from "./Icon";
import { rgba } from "../../../../style-guide/helpers";

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
			background-color: ${ colors.$color_white };
			box-shadow: 0 0 3px ${ rgba( colors.$color_blue_dark, .8 ) };
		}
	`;
}

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
			background: ${ colors.$color_button_hover };
			border-color: ${ colors.$color_button_border_hover };
			color: ${ colors.$color_button_text_hover };
		}
	`;
}

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
			background: ${ colors.$color_button };
			border-color: ${ colors.$color_button_border_hover };
			box-shadow: inset 0 2px 5px -3px ${ rgba( colors.$color_button_border_active, 0.5 ) };
		}
	`;
}

/**
 * Returns a component with all button selector styles applied.
 *
 * @param {ReactElement} component The original component.
 *
 * @returns {ReactElement} Component with applied styles.
 */
export const addButtonStyles = _flow( [ addFocusStyle, addHoverStyle, addActiveStyle ] );

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
		border: 1px solid ${ props => props.borderColor };
		background: ${ props => props.backgroundColor };
		box-shadow: 0 1px 0 ${ props => rgba( props.boxShadowColor, 1 ) };
		vertical-align: middle;
		margin: 0;
		padding: 4px 10px;
		border-radius: 3px;
		cursor: pointer;
		box-sizing: border-box;
		font-size: inherit;
		font-family: inherit;
		font-weight: inherit;
		text-align: left;
		outline: none;
		min-height: 32px;
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
export const Button = styled( BaseButton )`
	font-size: 0.8rem;
	line-height: 1.4;
`;

/**
 * Returns a button with inline flex styles.
 *
 * @param {object} props Component props.
 *
 * @returns {ReactElement} Styled component.
 */
const InlineFlexButton = styled( Button )`
	display: inline-flex;
	flex-direction: row;
`;

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
		display: flex;
		align-self: center;
		flex-shrink: 0;
	`;
}

export const RadioButtonBase = styled.input.attrs( {
	type: "radio",
} )`
	display: none;
`;

export const RadioButtonLabel = styled.label`
	box-sizing: border-box;
	touch-action: manipulation;
	-webkit-appearance: none;
	width: 32px;
	display: inline-block;
	text-align: center;
	border: 1px solid ${ colors.$color_button_border };
	background: ${ props => props.checked ? props.checkedBackground : props.uncheckedBackground };
	box-shadow: ${ props => props.checked
		? `inset 0 2px 0 ${ rgba( props.checkedBoxShadowColor, 0.7 ) }`
		: `0 1px 0 ${ rgba( props.uncheckedBoxShadowColor, 0.7 ) }` };
	border-radius: 3px;
	cursor: pointer;
	outline: none;
	padding-top: ${ props => props.checked ? "2px" : "2px" };
	height: ${ props => props.checked ? "25px" : "24px" };
`;

export const IconRadioButton = ( props ) => {
	return (
		<span>
			<RadioButtonBase
				type="radio"
				id={ props.id }
				name={ props.name }/>
			<RadioButtonLabel
				className="label"
				checked={ props.checked }
				htmlFor={ props.id }
				uncheckedBoxShadowColor={ props.uncheckedBoxShadowColor }
				checkedBoxShadowColor={ props.checkedBoxShadowColor }
				checkedBackground={ props.checkedBackground }
				uncheckedBackground={ props.uncheckedBackground }
			>
				{ props.checked
					? <Icon icon={ props.checkedIcon } color={ props.checkedIconColor }/>
					: <Icon icon={ props.uncheckedIcon } color={ props.uncheckedIconColor }/>
				}
			</RadioButtonLabel>
		</span>
	);
};

IconRadioButton.propTypes = {
	id: PropTypes.string.isRequired,
	boxShadowColor: PropTypes.string,
	uncheckedBoxShadowColor: PropTypes.string,
	checkedBoxShadowColor: PropTypes.string,
	checkedBackground: PropTypes.string,
	uncheckedBackground: PropTypes.string,
	checkedIconColor: PropTypes.string,
	uncheckedIconColor: PropTypes.string,
	checkedIcon: PropTypes.func.isRequired,
	uncheckedIcon: PropTypes.func.isRequired,
	name: PropTypes.string.isRequired,
	checked: PropTypes.bool.isRequired,
};

IconRadioButton.defaultProps = {
	uncheckedBoxShadowColor: colors.$color_button_border,
	checkedBoxShadowColor: colors.$color_purple,
	checkedBackground: colors.$color_pink_dark,
	uncheckedBackground: colors.$color_button,
	checkedIconColor: colors.$color_white,
	uncheckedIconColor: colors.$color_button_text,
};

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
	if( text ) {
		IconComponent = addIconTextStyle( IconComponent );
	}

	const newProps = _omit( props, "icon" );

	return (
		<InlineFlexButton { ...newProps } >
			<IconComponent icon={ icon } color={ iconColor } />
			{ text }
		</InlineFlexButton>
	);
};

IconButton.propTypes = {
	icon: PropTypes.func.isRequired,
	iconColor: PropTypes.string.isRequired,
	children: PropTypes.string,
};
