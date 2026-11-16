// External dependencies.
import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

// Yoast dependencies.
import { colors, rgba } from "@yoast/style-guide";

// Internal dependencies.
import { withDefaults } from "../withDefaults";

const settings = {
	minHeight: 48,
	verticalPadding: 0,
	borderWidth: 0,
};

const ieMinHeight = settings.minHeight - ( settings.verticalPadding * 2 ) - ( settings.borderWidth * 2 );

/**
 * Returns a component with a Yoast button-like style.
 *
 * The styles provided here are meant to be applied to both button and link
 * elements that need to look like styled buttons.
 *
 * @param {ReactElement} component  The original component.
 * @param {Object}       [defaults] Default prop values to apply via `.attrs`.
 *
 * @returns {ReactElement} Component with applied button styles.
 */
export function addButtonStyles( component, defaults = {} ) {
	return styled( component ).attrs( withDefaults( defaults ) )`
		display: inline-flex;
		align-items: center;
		justify-content: center;
		vertical-align: middle;
		min-height: ${ `${ settings.minHeight }px` };
		margin: 0;
		padding: 0 16px;
		padding: ${ `${ settings.verticalPadding }px` } 16px;
		border: 0;
		border-radius: 4px;
		box-sizing: border-box;
		font: 400 14px/24px "Open Sans", sans-serif;
		text-transform: uppercase;
		box-shadow: 0 2px 8px 0 ${ rgba( colors.$color_black, 0.3 ) };
		transition: box-shadow 150ms ease-out;

		&:hover,
		&:focus,
		&:active {
			box-shadow:
				0 4px 10px 0 ${ rgba( colors.$color_black, 0.2 ) },
				inset 0 0 0 100px ${ rgba( colors.$color_black, 0.1 ) };
			color: ${ props => props.textColor };
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
 * Returns a component with a button and an inner span element.
 *
 * The inner span is only needed to fix a Safari 10 bug with flexbox and button
 * elements. This bug is fixed in Safari Technology Previs and in the future it
 * will be possible to remove this component and directly style a button element.
 * See https://github.com/philipwalton/flexbugs#9-some-html-elements-cant-be-flex-containers
 *
 * @param {Object} props Component props.
 * @param {string} [props.className] The class name of the button.
 * @param {Function} [props.onClick] The function to call when the button is clicked.
 * @param {string} [props.type="button"] The type of the button.
 * @param {boolean} [props.isExpanded] Whether the element controlled by the button is expanded.
 * @param {(import("react").ReactNode[]|import("react").ReactNode|string)} [props.children] The content of the button.
 *
 * @returns {ReactElement} The button with inner span.
 */
export const YoastButtonBase = ( { className, onClick, type = "button", children, isExpanded } ) => (
	<button className={ className } onClick={ onClick } type={ type } aria-expanded={ isExpanded }>
		<span>
			{ children }
		</span>
	</button>
);

const yoastButtonDefaults = {
	backgroundColor: colors.$color_green_medium_light,
	textColor: colors.$color_white,
	withTextShadow: true,
};

/**
 * Returns a Button with the Yoast button style.
 *
 * See the Safari 10 bug description in the YoastButtonBase JSDoc.
 *
 * @param {Object} props Component props.
 *
 * @returns {ReactElement} styled button.
 */
export const YoastButton = addButtonStyles(
	styled( YoastButtonBase )`
		color: ${ props => props.textColor };
		background: ${ props => props.backgroundColor };
		min-width: 152px;
		${ props => props.withTextShadow ? `text-shadow: 0 0 2px ${ colors.$color_black }` : "" };
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
	`,
	yoastButtonDefaults
);

YoastButton.propTypes = {
	backgroundColor: PropTypes.string,
	textColor: PropTypes.string,
	withTextShadow: PropTypes.bool,
};

// Kept for classic-runtime consumers; addButtonStyles applies these via .attrs for React 19.
YoastButton.defaultProps = yoastButtonDefaults;
