// External dependencies.
import styled from "styled-components";
import PropTypes from "prop-types";

// Yoast dependencies.
import { colors, rgba } from "@yoast/style-guide";
import { getDirectionalStyle } from "@yoast/helpers";

const settings = {
	minHeight: 32,
	verticalPadding: 4,
	borderWidth: 1,
};

const ieMinHeight = settings.minHeight - ( settings.verticalPadding * 2 ) - ( settings.borderWidth * 2 );

/**
 * Builds a styled-components `attrs` callback that fills in the given defaults for any prop that is
 * not provided. React 19's automatic JSX runtime no longer applies `defaultProps` to function /
 * `forwardRef` components (styled components included), so applying the defaults here keeps them
 * working on both runtimes; `defaultProps` is kept as well for classic consumers.
 *
 * @param {Object} defaults The default prop values.
 *
 * @returns {function(Object): Object} An `attrs` callback returning only the missing defaults.
 */
function withDefaults( defaults ) {
	return ( props ) => {
		const filled = {};
		Object.keys( defaults ).forEach( ( key ) => {
			if ( typeof props[ key ] === "undefined" ) {
				filled[ key ] = defaults[ key ];
			}
		} );
		return filled;
	};
}

/**
 * Returns a component with applied base button styles.
 *
 * The defaults are applied here, on the outermost styled layer, via `.attrs`. Because this is the
 * outermost layer the defaulted props propagate to every inner style layer (hover/focus/active),
 * so each button keeps its own defaults on the React 19 automatic runtime, which ignores
 * `defaultProps`.
 *
 * @param {ReactElement} component   The original component.
 * @param {Object}       [defaults]  Default prop values to apply via `.attrs`.
 *
 * @returns {ReactElement} Component with applied base button styles.
 */
export function addBaseStyle( component, defaults = {} ) {
	return styled( component ).attrs( withDefaults( defaults ) )`
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
		text-align: ${ getDirectionalStyle( "left", "right" ) };
		overflow: visible;
		min-height: ${ `${ settings.minHeight }px` };
		transition: var(--yoast-transition-default);

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
			border-color: ${ props => props.focusBorderColor };
			color: ${ props => props.focusColor };
			background-color: ${ props => props.focusBackgroundColor };
			box-shadow: 0 0 3px ${ props => rgba( props.focusBoxShadowColor, .8 ) }
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
			color: ${ props => props.hoverColor };
			background-color: ${ props => props.hoverBackgroundColor };
			border-color: var(--yoast-color-border--default);
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
			color: ${ props => props.activeColor };
			background-color: ${ props => props.activeBackgroundColor };
			border-color: ${ props => props.hoverBorderColor };
			box-shadow: inset 0 2px 5px -3px ${ props => rgba( props.activeBorderColor, 0.5 ) }
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
export const addButtonStyles = ( component, defaults ) =>
	/*
	 * Styled-components applies the generated CSS classes in a reversed order, but we want them in
	 * the order: base - hover - focus - active. The defaults are applied on the outermost (base)
	 * layer so they reach every inner layer's interpolations on the React 19 automatic runtime.
	 */
	addBaseStyle( addHoverStyle( addFocusStyle( addActiveStyle( component ) ) ), defaults );

const baseButtonDefaults = {
	type: "button",
	backgroundColor: colors.$color_button,
	textColor: colors.$color_button_text,
	borderColor: colors.$color_button_border,
	boxShadowColor: colors.$color_button_border,
	hoverColor: colors.$color_button_text_hover,
	hoverBackgroundColor: colors.$color_button_hover,
	activeColor: colors.$color_button_text_hover,
	activeBackgroundColor: colors.$color_button,
	activeBorderColor: colors.$color_button_border_active,
	focusColor: colors.$color_button_text_hover,
	focusBackgroundColor: colors.$color_white,
	focusBorderColor: colors.$color_blue,
	focusBoxShadowColor: colors.$color_blue_dark,
};

/**
 * Returns a basic styled button.
 *
 * @param {object} props Component props.
 *
 * @returns {ReactElement} styled button.
 */
export const BaseButton = addButtonStyles(
	styled.button`
		color: ${ props => props.textColor };
		border-color: ${ props => props.borderColor };
		background: ${ props => props.backgroundColor };
		box-shadow: 0 1px 0 ${ props => rgba( props.boxShadowColor, 1 ) };
	`,
	baseButtonDefaults
);

BaseButton.propTypes = {
	type: PropTypes.string,
	backgroundColor: PropTypes.string,
	textColor: PropTypes.string,
	borderColor: PropTypes.string,
	boxShadowColor: PropTypes.string,
	hoverColor: PropTypes.string,
	hoverBackgroundColor: PropTypes.string,
	activeColor: PropTypes.string,
	activeBackgroundColor: PropTypes.string,
	activeBorderColor: PropTypes.string,
	focusColor: PropTypes.string,
	focusBackgroundColor: PropTypes.string,
	focusBorderColor: PropTypes.string,
	focusBoxShadowColor: PropTypes.string,
};

// Kept for classic-runtime consumers; addButtonStyles applies these via .attrs for React 19.
BaseButton.defaultProps = baseButtonDefaults;

/**
 * Returns a styled Button with set font size.
 *
 * @param {object} props Component props.
 *
 * @returns {ReactElement} styled button.
 */
export default BaseButton;
