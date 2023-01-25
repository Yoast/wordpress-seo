/* global wpseoApi */
/**
 * Fetches meta keys from the API.
 *
 * @param {string} query  The search value.
 * @param {int}    postId The post ID.
 *
 * @returns {Object} The API Post followed by a resolve.
 */
export function SNIPPET_EDITOR_FIND_CUSTOM_FIELDS( { query, postId } ) {
	return new Promise( ( resolve ) => {
		// eslint-disable-next-line camelcase
		wpseoApi.get( "meta/search", { query, post_id: postId }, response => {
			resolve( response.meta );
		} );
	} );
}
