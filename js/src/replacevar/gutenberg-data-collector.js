/* global wp */

/**
 * External dependencies
 */
import get from "lodash/get";

/**
 * Internal dependencies
 */
import DataCollector from "./data-collector";

/**
 * Gutenberg replacevar data collector.
 */
class GutenbergDataCollector extends DataCollector {
	/**
	 * Gets the parent id.
	 *
	 * @returns {string} The parent id.
	 */
	getParentId() {
		return wp.data.select( "core/editor" ).getEditedPostAttribute( "parent" );
	}

	/**
	 * Gets the parent title.
	 *
	 * Gets the parent title via the WordPress REST API, and caches the result,
	 * and calls the refresh callback once the parent title has been cached.
	 *
	 * @param {number|string} parentId The parent id to get the title for.
	 *
	 * @returns {Promise} A Promise containing the Parent Title.
	 */
	getParentTitle( parentId ) {
		const model = new wp.api.models.Page( { id: parentId } );

		return model.fetch( { data: { _fields: [ "title" ] } } ).then( data => get( data, "title.rendered", "" ) );
	}
}

export default GutenbergDataCollector;
