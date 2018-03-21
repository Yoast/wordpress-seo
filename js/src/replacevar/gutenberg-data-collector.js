/* global wp */
import noop from "lodash/noop";
import get from "lodash/get";

import DataProvider from "./data-provider";

class GutenbergDataCollector extends DataProvider {
	constructor( refresh ) {
		super( ...arguments );
		this.refresh = refresh || noop;
		this.parentTitles = {};
	}

	/**
	 * Gets the parent title.
	 *
	 * Gets the parent title via the WordPress REST API, and caches the result,
	 * and calls the refresh callback once the parent title has been cached.
	 *
	 * @returns {string} Parent title.
	 */
	getParentTitle() {
		const parentId = wp.data.select( "core/editor" ).getEditedPostAttribute( "parent" );
		if ( ! parentId || parentId === 0 ) {
			return null;
		}
		const cachedParentTitle = get( this.parentTitles, parentId );
		if( cachedParentTitle ) {
			return cachedParentTitle;
		}
		const model = new wp.api.models.Page( { id: parentId } );
		model.fetch().done( data => {
			console.log( data );
			this.parentTitles[ parentId ] = data.title.rendered;
			this.refresh();
		} ).fail( () => {} );
	}
}


export default GutenbergDataCollector;
