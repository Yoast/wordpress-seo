/* global wp */

import DataProvider from "./data-provider";

class GutenbergDataCollector extends DataProvider {
	/**
	 * Gets the parent title.
	 *
	 * Gets the parent title via the WordPress REST API, and caches the result,
	 * and calls the refresh callback once the parent title has been cached.
	 *
	 * @param {number|string} parentId The parent id to get the title for.
	 * @param {function}      callback Callback to call when parent title has been fetched.
	 *
	 * @returns {string} Parent title.
	 */
	getParentTitle( parentId, callback ) {
		const model = new wp.api.models.Page( { id: parentId } );
		model.fetch().done( data => {
			callback( data.title.rendered );
		} ).fail( () => {} );
	}

	/**
	 * Gets the parent id.
	 *
	 * @returns {string} The parent id.
	 */
	getParentId() {
		return wp.data.select( "core/editor" ).getEditedPostAttribute( "parent" );
	}
}


export default GutenbergDataCollector;
