import { createInterpolateElement } from "@wordpress/element";

/**
 * Capitalize the first letter of a string.
 *
 * @param   {string} string The string to capitalize.
 *
 * @returns {string}        The string with the first letter capitalized.
 */
export function firstToUpperCase( string ) {
	return string.charAt( 0 ).toUpperCase() + string.slice( 1 );
}

/**
 * Strips HTML from a string.
 *
 * @param {string} string  The string to strip HTML from.
 *
 * @returns {string} The string with HTML stripped.
 */
export function stripHTML( string ) {
	const tmp = document.createElement( "DIV" );
	tmp.innerHTML = string;
	return tmp.textContent || tmp.innerText || "";
}

/**
 * Adds a link to a string containing anchor tags (in string form).
 *
 * @example "This is an example text in which <a>this part should be a link</a> and this part shouldn't."
 *
 * @param {string} text   The text to add links to. Make sure it contains <a> and </a> tags surrounding the link part.
 * @param {string} linkTo The target URL for the link (href).
 *
 * @returns {WPElement} A Fragment with the text and a link.
 */
export function addLinkToString( text, linkTo ) {
	return createInterpolateElement(
		text,
		{
			// eslint-disable-next-line jsx-a11y/anchor-has-content
			a: <a href={ linkTo } target="_blank" rel="noopener noreferrer" />,
		}
	);
}
