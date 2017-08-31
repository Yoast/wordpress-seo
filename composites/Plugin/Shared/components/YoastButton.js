import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import colors from "../../../../style-guide/colors.json";
import { rgba } from "../../../../style-guide/helpers";

/**
 * Returns a component with a Yoast button-like style.
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
		display: inline-block;
		height: 48px;
		margin: 0;
		padding: 0 16px;
		border: 0;
		vertical-align: middle;
		border-radius: 4px;
		box-sizing: border-box;
		font: 400 14px/24px "Open Sans", sans-serif;
		text-transform: uppercase;
		box-shadow: 0 2px 8px 0 ${ rgba( colors.$color_black, 0.3 ) };
		transition: box-shadow 150ms ease-out;

		&:hover,
		&:focus {
			box-shadow:
				0 4px 10px 0 ${ rgba( colors.$color_black, 0.2 ) },
				inset 0 0 0 100px ${ rgba( colors.$color_black, 0.1 ) };
		}

		&:active {
			transform: translateY( 1px );
			box-shadow: none;
		}
	`;
}

/**
 * Returns a Button with the Yoast button style.
 *
 * @param {object} props Component props.
 *
 * @returns {ReactElement} Styled button.
 */
export const YoastButton = addButtonStyles(
	styled.button`
		color: ${ props => props.textColor };
		background: ${ props => props.backgroundColor };
		min-width: 152px;
		${ props => props.withTextShadow ? `text-shadow: 0 0 2px ${ colors.$color_black }` : "" };
		overflow: visible;
		cursor: pointer;

		&::-moz-focus-inner {
			border-width: 0;
		}
	`
);

YoastButton.propTypes = {
	backgroundColor: PropTypes.string,
	textColor: PropTypes.string,
	type: PropTypes.string,
	withTextShadow: PropTypes.bool,
};

YoastButton.defaultProps = {
	backgroundColor: colors.$color_green_medium_light,
	textColor: colors.$color_white,
	type: "button",
	withTextShadow: true,
};
