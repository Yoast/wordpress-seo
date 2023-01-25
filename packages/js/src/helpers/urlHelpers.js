/**
 * Removes the query parameter from the given url.
 *
 * @param {string} url       The url to remove the parameter from
 * @param {string} parameter The parameter to remove
 *
 * @returns {string} The altered url object.
 */
export function removeSearchParam( url, parameter ) {
	const currentURL = new URL( url );

	currentURL.searchParams.delete( parameter );

	return currentURL.href;
}

/**
 * Replaces the history state.
 *
 * @param {any}    data  The data to set.
 * @param {string} title The new title.
 * @param {string} url   The new url.
 *
 * @returns {void}
 */
export function addHistoryState( data, title, url ) {
	window.history.pushState( data, title, url );
}
