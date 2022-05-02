import { __ } from "@wordpress/i18n";

import classNames from "classnames";

export const socialMedia = [
	{ name: "Facebook", placeholder: __( "E.g. https://www.facebook.com/yoast", "wordpress-seo" ) },
	{ name: "Instagram", placeholder: __( "E.g. https://www.instagram.com/yoast", "wordpress-seo" ) },
	{ name: "LinkedIn", placeholder: __( "E.g. https://www.linkedin.com/yoast", "wordpress-seo" ) },
	{ name: "MySpace", placeholder: __( "E.g. https://www.myspace.com/yoast", "wordpress-seo" ) },
	{ name: "Pinterest", placeholder: __( "E.g. https://www.pinterest.com/yoast", "wordpress-seo" ) },
	{ name: "SoundCloud", placeholder: __( "E.g. https://www.soundcloud.com/yoast", "wordpress-seo" ) },
	{ name: "Tumblr", placeholder: __( "E.g. https://www.tumblr.com/yoast", "wordpress-seo" ) },
	{ name: "Twitter", placeholder: __( "E.g. https://www.twitter.com/yoast", "wordpress-seo" ) },
	{ name: "YouTube", placeholder: __( "E.g. https://www.youtube.com/yoast", "wordpress-seo" ) },
	{ name: "Wikipedia", placeholder: __( "E.g. https://www.wikipedia.com/yoast", "wordpress-seo" ) },
];

/**
 * Creates the error ID for the error component.
 *
 * @param {string} inputId The id of the input component.
 *
 * @returns {string} The ID for the error component.
 */
export const getErrorId = ( inputId ) => `error-${ inputId }`;

/**
  * Get props needed to properly display an error in input components.
  *
  * @param {string} inputId The id of the input component.
  * @param {ValidationError} error The error object.
  * @param {boolean} error.isVisible The error object.
  *
  * @returns {Object} Object containing relevant props for displaying.
  */
export const getErrorAriaProps = ( inputId, { isVisible } ) => isVisible ? {
	"aria-invalid": true,
	"aria-describedby": getErrorId( inputId ),
} : {};

/**
 * Helper function to get active styles for select options.
 *
 * @param {boolean} options.active Whether the option is active.
 *
 * @returns {string} Styles for an active option.
 */
export function getOptionActiveStyles( { active, selected } ) {
	return classNames(
		"yst-relative yst-cursor-default yst-select-none yst-py-2 yst-pl-3 yst-pr-9 yst-my-0",
		selected && "yst-bg-primary-500 yst-text-white",
		( active && ! selected ) && "yst-bg-primary-200 yst-text-gray-700",
		( ! active && ! selected ) && "yst-text-gray-700"
	);
}
