import React from "react";
import PropTypes from "prop-types";
import "./buttons.css";

// Load often occurring classes on a const.
const buttonClasses = "yoast-button yoast-button--";

// A map from variant to icon span className, with iconAfter or iconBefore as a key.
const variantToIcon = {
	buy: { iconAfter: "yoast-button--buy__caret" },
	edit: { iconBefore: "yoast-button--edit" },

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
	edit: buttonClasses + "primary",
};

/**
 * A function that looks up the correct className that belongs to a certain variant.
 *
 * @param {string} variant The variant for which to lookup the className.
 * @param {Boolean} small  Whether or we should return the small variant of a button.
 *
 * @returns {string} The className that contains the css for the requested variant.
 */
const getClassName = ( variant, small ) => {
	let className = variantToClassName[ variant ];
	if ( small ) {
		className += " yoast-button--small";
	}
	return className;
};

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
		small,
		type,
		buttonRef,
		...restProps
	} = props;

	const variantIcons = getVariantIcons( variant );
	const iconBefore = variantIcons && variantIcons.iconBefore;
	const iconAfter = variantIcons && variantIcons.iconAfter;

	return <button
		ref={ buttonRef }
		className={ className || getClassName( variant, small ) }
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
	buttonRef: PropTypes.object,
	small: PropTypes.bool,
	variant: PropTypes.oneOf( Object.keys( variantToClassName ) ),
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
	small: false,
	children: null,
	onClick: null,
	buttonRef: null,
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
		small,
		buttonRef,
		...restProps
	} = props;

	const variantIcons = getVariantIcons( variant );
	const iconBefore = variantIcons && variantIcons.iconBefore;
	const iconAfter = variantIcons && variantIcons.iconAfter;

	return <a
		className={ className || getClassName( variant, small ) }
		ref={ buttonRef }
		{ ...restProps }
	>
		{ ! ! iconBefore && <span className={ iconBefore } /> }
		{ children }
		{ ! ! iconAfter && <span className={ iconAfter } /> }
	</a>;
};

ButtonStyledLink.propTypes = {
	href: PropTypes.string.isRequired,
	variant: PropTypes.oneOf( Object.keys( variantToClassName ) ),
	small: PropTypes.bool,
	className: PropTypes.string,
	buttonRef: PropTypes.object,
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
	small: false,
	children: null,
	buttonRef: null,
};
