/**
 * Checks if an argument is present in the url.
 *
 * @param {string} key The key of the argument to check.
 * @param {string} value The value of the argument to check.
 * @returns {boolean} True if the user has opted in to the llm txt feature via the notification.
 */
export const checkUrlArgs = ( key, value ) => {
	// Get all URL arguments
	const url = new URL( window.location.href );
	const urlArgs = new URLSearchParams( url.search );
	const queryParams = Object.fromEntries( urlArgs.entries() );
	return queryParams[ key ] === value;
};
