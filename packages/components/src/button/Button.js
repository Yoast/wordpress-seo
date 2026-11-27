import React from "react";
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
 * @param {boolean} small  Whether or we should return the small variant of a button.
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
 * @param {Function} [props.onClick=null] The function to call when the button is clicked.
 * @param {string} [props.type="button"] The type of the button.
 * @param {string} [props.className=""] The class name of the button. Overrides the variant.
 * @param {Object} [props.buttonRef=null] The ref of the button.
 * @param {boolean} [props.small=false] Whether to use the small variant of the button.
 * @param {("primary"|"secondary"|"buy"|"hide"|"remove"|"upsell"|"purple"|"grey"|"yellow"|"edit")} [props.variant="primary"] The button variant.
 * @param {import("react").ReactNode} [props.children=null] The content of the button.
 *
 * @returns {HTMLButtonElement} A button.
 */
export const Button = ( {
	// Split Button.js specific props from all other props.
	children = null,
	className = "",
	variant = "primary",
	small = false,
	type = "button",
	buttonRef = null,
	onClick = null,
	...restProps
} ) => {
	const variantIcons = getVariantIcons( variant );
	const iconBefore = variantIcons && variantIcons.iconBefore;
	const iconAfter = variantIcons && variantIcons.iconAfter;

	return <button
		ref={ buttonRef }
		className={ className || getClassName( variant, small ) }
		type={ type }
		onClick={ onClick }
		{ ...restProps }
	>
		{ ! ! iconBefore && <span className={ iconBefore } /> }
		{ children }
		{ ! ! iconAfter && <span className={ iconAfter } /> }
	</button>;
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
 * @param {string} props.href The URL the link points to.
 * @param {("primary"|"secondary"|"buy"|"hide"|"remove"|"upsell"|"purple"|"grey"|"yellow"|"edit")} [props.variant="primary"] The link variant.
 * @param {boolean} [props.small=false] Whether to use the small variant of the link.
 * @param {string} [props.className=""] The class name of the link. Overrides the variant.
 * @param {Object} [props.buttonRef=null] The ref of the link.
 * @param {import("react").ReactNode} [props.children=null] The content of the link.
 *
 * @returns {HTMLAnchorElement} An anchor tag, styled like a button.
 */
export const ButtonStyledLink = ( {
	children = null,
	className = "",
	variant = "primary",
	small = false,
	buttonRef = null,
	...restProps
} ) => {
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
