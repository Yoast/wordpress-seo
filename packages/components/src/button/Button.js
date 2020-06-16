import React from "react";
import PropTypes from "prop-types";
import "./buttons.css";

// Load often occurring classes on a const.
const buttonClasses = "yoast-button yoast-button--";

// A map from variant to icon span className, with iconAfter or iconBefore as a key.
const variantToIcon = {
	buy: { iconAfter: "yoast-button--buy__caret" },

	// Aliases
	upsell: { iconAfter: "yoast-button--buy__caret" },
};

// A map from variant to icon span className.
const variantToClassName = {
	primary: buttonClasses + "primary",
	secondary: buttonClasses + "secondary",
	buy: buttonClasses + "buy",
	hide: "yoast-hide",
	remove: "yoast-remove",

	// Aliases
	upsell: buttonClasses + "buy",
	purple: buttonClasses + "primary",
	grey: buttonClasses + "secondary",
	yellow: buttonClasses + "buy",
};

/**
 * A function that looks up the correct className that belongs to a certain variant.
 *
 * @param {string} variant The variant for which to lookup the className.
 *
 * @returns {string} The className that contains the css for the requested variant.
 */
const getClassName = variant => variantToClassName[ variant ];

/**
 * A function that looks up the correct icons that belong to a certain variant.
 *
 * They are behind a iconBefore and/or iconAfter key, in order to set the position.
 *
 * @param {string} variant The variant for which to lookup the before/after icon.
 *
 * @returns {Object|null} The icons for the requested variant.
 */
const getVariantIcons = variant => variantToIcon[ variant ] || null;

/**
 * A button with some functionality for Yoast styling.
 *
 * Can be provided with a variant string to set the styling
 * (see the variantToClassName and variantToIcon objects for options).
 *
 * Optionally, you can pass a className, to override the variant.
 *
 * @param {Object} props The props object.
 *
 * @returns {HTMLButtonElement} A button.
 */
export const Button = ( props ) => {
	// Split Button.js specific props from all other props.
	const {
		children,
		className,
		variant,
		type,
		...restProps
	} = props;

	const variantIcons = getVariantIcons( variant );
	const iconBefore = variantIcons && variantIcons.iconBefore;
	const iconAfter = variantIcons && variantIcons.iconAfter;

	return <button
		className={ className || getClassName( variant ) }
		type={ type }
		{ ...restProps }
	>
		{ ! ! iconBefore && <span className={ iconBefore } /> }
		{ children }
		{ ! ! iconAfter && <span className={ iconAfter } /> }
	</button>;
};

Button.propTypes = {
	onClick: PropTypes.func,
	type: PropTypes.string,
	className: PropTypes.string,
	variant: PropTypes.string,
	children: PropTypes.oneOfType(
		[
			PropTypes.node,
			PropTypes.arrayOf( PropTypes.node ),
		]
	),
};

Button.defaultProps = {
	className: "",
	type: "button",
	variant: "primary",
	children: null,
	onClick: null,
};

/**
 * A link, styled to look like a button.
 *
 * Can be provided with a variant string to set the styling
 * (see the variantToClassName and variantToIcon objects for options).
 *
 * Optionally, you can pass a className, to override the variant.
 *
 * @param {Object} props The props object.
 *
 * @returns {HTMLAnchorElement} An anchor tag, styled like a button.
 */
export const ButtonStyledLink = ( props ) => {
	const {
		children,
		className,
		variant,
		...restProps
	} = props;

	const variantIcons = getVariantIcons( variant );
	const iconBefore = variantIcons && variantIcons.iconBefore;
	const iconAfter = variantIcons && variantIcons.iconAfter;

	return <a
		className={ className || getClassName( variant ) }
		{ ...restProps }
	>
		{ ! ! iconBefore && <span className={ iconBefore } /> }
		{ children }
		{ ! ! iconAfter && <span className={ iconAfter } /> }
	</a>;
};

ButtonStyledLink.propTypes = {
	href: PropTypes.string.isRequired,
	variant: PropTypes.string,
	className: PropTypes.string,
	children: PropTypes.oneOfType(
		[
			PropTypes.node,
			PropTypes.arrayOf( PropTypes.node ),
		]
	),
};

ButtonStyledLink.defaultProps = {
	className: "",
	variant: "primary",
	children: null,
};
