import React from "react";
import styled from "styled-components";
import flow from "lodash/flow";
import omit from "lodash/omit";
import PropTypes from "prop-types";

import colors from "../../../../style-guide/colors.json";
import SvgIcon from "./SvgIcon";
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

		// Only needed for IE 10+. Don't add spaces within brackets for this to work.
		@media all and (-ms-high-contrast: none), (-ms-high-contrast: active) {
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
 * Applies styles to SvgIcon for IconButton with text.
 *
 * @param {ReactElement} icon The original SvgIcon.
 *
 * @returns {ReactElement} SvgIcon with text styles applied.
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

	let IconComponent = SvgIcon;
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
	icon: PropTypes.string.isRequired,
	iconColor: PropTypes.string,
	children: PropTypes.oneOfType( [
		PropTypes.arrayOf( PropTypes.node ),
		PropTypes.node,
		PropTypes.string,
	] ),
};

IconButton.defaultProps = {
	iconColor: "#000",
};

/**
 * Returns an icons button that can optionally contain a prefix and / or a suffix icon.
 *
 * @param {object} props Component props.
 *
 * @returns {ReactElement} Styled icon button.
 */
export const IconsButton = ( props ) => {
	const { children: text, prefixIcon, prefixIconColor, suffixIcon, suffixIconColor } = props;

	const newProps = omit( props, [ "prefixIcon", "prefixIconColor", "suffixIcon", "suffixIconColor" ] );

	return (
		<Button { ...newProps }>
			{ prefixIcon ? <SvgIcon icon={ prefixIcon } color={ prefixIconColor } /> : null }
			{ text }
			{ suffixIcon ? <SvgIcon icon={ suffixIcon } color={ suffixIconColor } /> : null }
		</Button>
	);
};

IconsButton.propTypes = {
	prefixIcon: PropTypes.string,
	prefixIconColor: PropTypes.string,
	suffixIcon: PropTypes.string,
	suffixIconColor: PropTypes.string,
	children: PropTypes.oneOfType( [
		PropTypes.arrayOf( PropTypes.node ),
		PropTypes.node,
		PropTypes.string,
	] ),
};

IconsButton.defaultProps = {
	prefixIconColor: "#000",
	suffixIconColor: "#000",
};
