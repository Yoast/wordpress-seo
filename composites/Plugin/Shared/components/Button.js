import React from "react";
import styled from "styled-components";
import _flow from "lodash/flow";
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
		display: inline-block;
		text-decoration: none;
		padding: 5px 10px;
		border-radius: 3px;
		cursor: pointer;
		box-sizing: border-box;
		font-size: inherit;
		font-family: inherit;
		font-weight: inherit;
		outline: none;
		min-height: 32px;
		vertical-align: top;
	`
);

BaseButton.propTypes = {
	backgroundColor: PropTypes.string,
	textColor: PropTypes.string,
	borderColor: PropTypes.string,
	boxShadowColor: PropTypes.string,
}

BaseButton.defaultProps = {
	backgroundColor: colors.$color_button,
	textColor: colors.$color_button_text,
	borderColor: colors.$color_button_border,
	boxShadowColor: colors.$color_button_border,
	type: "button",
};

/**
 * Returns a button styled for the SnippetPreview.
 *
 * @param {object} props Component props.
 *
 * @returns {ReactElement} Styled button.
 */
export const SnippetPreviewButton = styled( BaseButton )`
	line-height: 15px;
	font-size: 0.8rem;
`;

/**
 * Applies styles to icon for IconButton with text.
 *
 * @param {ReactElement} icon The original icon.
 *
 * @returns {ReactElement} Icon with text styles applied.
 */
function applyIconTextStyle( icon ) {
	return styled( icon )`
		margin: 0 8px 0 0;
		float: left;
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
	if( text ) {
		IconComponent = applyIconTextStyle( IconComponent );
	}

	return (
		<SnippetPreviewButton { ...props } >
			<IconComponent icon={ icon } color={ iconColor } />
			{ text }
		</SnippetPreviewButton>
	);
};

IconButton.propTypes = {
	icon: PropTypes.func.isRequired,
	iconColor: PropTypes.string.isRequired,
	children: PropTypes.string,
};
