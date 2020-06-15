import React from "react";
import PropTypes from "prop-types";
import "./buttons.css";

export const sharedButtonPropTypes = {
	children: PropTypes.oneOfType(
		[
			PropTypes.node,
			PropTypes.arrayOf( PropTypes.node ),
		]
	),
	onClick: PropTypes.func,
	href: PropTypes.string,
};

export const sharedButtonDefaultProps = {
	children: null,
	onClick: null,
	href: null,
};

const iconToClassName = {
	"caret-right": "yoast-button--buy__caret",
	buy: "yoast-button--buy__caret",
};

const variantToClassName = {
	primary: "primary",
	secondary: "secondary",
	buy: "buy",
	upsell: "buy",
	purple: "primary",
	grey: "secondary",
	yellow: "buy",
};

/**
 * A function that looks up the correct className that belongs to a certain variant.
 *
 * @param {string} variant The variant for which to lookup the className.
 *
 * @returns {string} The className that contains the css for the requested variant.
 */
const getClassName = variant => `yoast-button yoast-button--${ variantToClassName[ variant ] }`;

/**
 * Gets the span that has the svg icon as a background.
 *
 * @param {string} desiredIcon The icon which should be added as a background to a span.
 *
 * @returns {HTMLSpanElement} A span with an svg set as background.
 */
const getIconSpan = desiredIcon => <span className={ iconToClassName[ desiredIcon ] } />;

/**
 * A button with some functionality for Yoast styling.
 *
 * Can be provided with a variant string (see the variantToClassName object )
 * and iconBefore and iconAfter strings (see the iconToClassName object).
 *
 * @param {Object} props The props object.
 *
 * @returns {HTMLButtonElement} A button.
 */
export const Button = ( props ) => {
	// Split Button.js specific props from all other props.
	const {
		children,
		variant,
		iconBefore,
		iconAfter,
		type,
		...restProps
	} = props;

	const displayIconBefore = ! ! iconBefore;
	const displayIconAfter = ! ! iconAfter;

	return <button
		className={ getClassName( variant ) }
		type={ type }
		{ ...restProps }
	>
		{ displayIconBefore && getIconSpan( iconBefore ) }
		{ children }
		{ displayIconAfter && getIconSpan( iconAfter ) }
	</button>;
};

Button.propTypes = {
	children: PropTypes.oneOfType(
		[
			PropTypes.node,
			PropTypes.arrayOf( PropTypes.node ),
		]
	),
	onClick: PropTypes.func,
	type: PropTypes.string,
	variant: PropTypes.string,
	iconBefore: PropTypes.string,
	iconAfter: PropTypes.string,
};

Button.defaultProps = {
	type: "button",
	variant: "primary",
	children: null,
	onClick: null,
	iconBefore: "",
	iconAfter: "",
};

/**
 * A link, styled to look like a button.
 *
 * Can be provided with a variant string (see the variantToClassName object )
 * and iconBefore and iconAfter strings (see the iconToClassName object).
 *
 * @param {Object} props The props object.
 *
 * @returns {HTMLAnchorElement} An anchor tag, styled like a button.
 */
export const ButtonStyledLink = ( props ) => {
	const {
		children,
		iconBefore,
		iconAfter,
		variant,
		...restProps
	} = props;

	const displayIconBefore = ! ! iconBefore;
	const displayIconAfter = ! ! iconAfter;

	return <a
		className={ getClassName( variant ) }
		{ ...restProps }
	>
		{ displayIconBefore && getIconSpan( iconBefore ) }
		{ children }
		{ displayIconAfter && getIconSpan( iconAfter ) }
	</a>;
};

ButtonStyledLink.propTypes = {
	href: PropTypes.string.isRequired,
	variant: PropTypes.string,
	children: PropTypes.oneOfType(
		[
			PropTypes.node,
			PropTypes.arrayOf( PropTypes.node ),
		]
	),
	iconBefore: PropTypes.string,
	iconAfter: PropTypes.string,
};

ButtonStyledLink.defaultProps = {
	...sharedButtonDefaultProps,
	variant: "primary",
	children: null,
	iconBefore: "",
	iconAfter: "",
};
