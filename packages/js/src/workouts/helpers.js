import apiFetch from "@wordpress/api-fetch";
import { colors } from "@yoast/style-guide";

/**
 * Unescapes HTML entities from a HTML string.
 *
 * @param {string} text The string to unescape
 * @returns {string} The escaped string.
 */
export function unescape( text ) {
	return jQuery( "<div>" ).html( text ).text();
}

/**
 * Retrieves the icons and colors for the icon for a certain result.
 *
 * @param {string} score The score for which to return the icon and color.
 *
 * @returns {Object} The icon and color for the score.
 */
export function getIconForScore( score ) {
	const icon = { icon: "circle", color: colors.$color_grey_disabled };

	switch ( score ) {
		case "loading":
			icon.color = colors.$color_green_medium_light;
			break;
		case "good":
			icon.color = colors.$color_green_medium;
			break;
		case "ok":
			icon.color = colors.$color_ok;
			break;
		case "bad":
			icon.color = colors.$color_red;
			break;
	}

	return icon;
}

/**
 * Searches WP for content.
 *
 * @param {string} term The search term.
 * @param {function} setSearchResult Sets the searchresults.
 * @returns {boolean} If the action was successful.
 */
export async function search( term, setSearchResult ) {
	try {
		const response = await apiFetch( {
			path: "wp/v2/search/?search=" + term,
		} );
		let searchResult = await response;
		searchResult = searchResult.map(
			( x ) => {
				return {
					value: x.id,
					label: x.title + " (" + x.url + ")",
					type: x.type,
				};
			}
		);
		setSearchResult( searchResult );
		return searchResult;
	} catch ( e ) {
		// URL() constructor throws a TypeError exception if url is malformed.
		setSearchResult( [] );
		console.error( e.message );
		return false;
	}
}

/**
 * Scrolls a target into view.
 *
 * @param {Int} stepNumber The number of the step to scroll to.
 *
 * @returns { void }
 */
export function scrollToStep( stepNumber ) {
	if ( stepNumber === 1 ) {
		window.scrollTo( { top: 0, behavior: "smooth" } );
		return;
	}

	const element = document.getElementById( `hr-scroll-target-step-${ stepNumber }` );
	const yOffset = -50;
	const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;

	window.scrollTo( { top: y, behavior: "smooth", block: "start" } );
}
