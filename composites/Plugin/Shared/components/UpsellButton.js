import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import colors from "../../../../style-guide/colors.json";
import { YoastButtonBase } from "../components/YoastButton";
import SvgIcon from "./SvgIcon";

const settings = {
	minHeight: 48,
	verticalPadding: 8,
	borderWidth: 0,
};

const ieMinHeight = settings.minHeight - ( settings.verticalPadding * 2 ) - ( settings.borderWidth * 2 );

const IconComponent = styled( SvgIcon )`
		margin: 2px 4px 0 4px;
		flex-shrink: 0;
`;

/**
 * Returns a component with a upsell button-like style.
 *
 * The styles provided here are meant to be applied to both button and link
 * elements that need to look like styled buttons.
 *
 * @param {ReactElement} component The original component.
 *
 * @returns {ReactElement} Component with applied button styles.
 */
export function addButtonStyles( component ) {
	return styled( component )`
		display: inline-flex;
		align-items: center;
		justify-content: center;
		vertical-align: middle;
		min-height: ${ `${ settings.minHeight }px` };
		margin: 0;
		overflow: auto;
		min-width: 152px;
		padding: 0 16px;
		padding: ${ `${ settings.verticalPadding }px` } 8px ${ `${ settings.verticalPadding }px` } 16px;
		border: 0;
		border-radius: 4px;
		box-sizing: border-box;
		font: 400 16px/24px "Open Sans", sans-serif;
		box-shadow: inset 0 -4px 0 rgba(0, 0, 0, 0.2);
		filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
		transition: box-shadow 150ms ease-out;

		&:hover,
		&:focus,
		&:active {
			background: ${ colors.$color_button_upsell_hover };
		}

		&:active {
			transform: translateY( 1px );
			box-shadow: none;
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
 * Returns a Button with the upsell button style.
 *
 * See the Safari 10 bug description in the YoastButtonBase JSDoc.
 *
 * @param {object} props The component's props.
 *
 * @returns {ReactElement} The upsell button.
 */
export const UpsellButtonBase = addButtonStyles(
	styled( YoastButtonBase )`
		color: ${ props => props.textColor };
		background: ${ props => props.backgroundColor };
		overflow: visible;
		cursor: pointer;

		&::-moz-focus-inner {
			border-width: 0;
		}

		// Only needed for Safari 10 and only for buttons.
		span {
			display: inherit;
			align-items: inherit;
			justify-content: inherit;
			width: 100%;
		}
	`
);

UpsellButtonBase.propTypes = {
	backgroundColor: PropTypes.string,
	hoverColor: PropTypes.string,
	textColor: PropTypes.string,
};

UpsellButtonBase.defaultProps = {
	backgroundColor: colors.$color_button_upsell,
	hoverColor: colors.$color_button_hover_upsell,
	textColor: colors.$color_black,
};

export const UpsellButton = ( props ) => {
	const { children: text } = props;

	return (
		<UpsellButtonBase { ...props }>
			{ text }
			<IconComponent icon={ "caret-right" } color={ colors.$color_black } size={ "16px" } />
		</UpsellButtonBase>
	);
};
