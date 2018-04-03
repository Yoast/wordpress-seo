/* global wp */
/**
 * External dependencies
 */
import watch from "redux-watch";
import get from "lodash/get";

/**
 * Internal dependencies
 */
import DataCollector from "./data-collector";
import { getParentTitle } from "../redux/actions";

class GutenbergDataCollector extends DataCollector {
	constructor( store ) {
		super( store );
	}
	/**
	 * Gets the parent title.
	 *
	 * Gets the parent title via the WordPress REST API, and caches the result,
	 * and calls the refresh callback once the parent title has been cached.
	 *
	 * @param {number|string} parentId The parent id to get the title for.
	 * @param {function}      callback Callback to call when parent title has been fetched.
	 *
	 * @returns {void}
	 */
	getParentTitle( parentId, callback ) {
		const state = this.store.getState();
		const parentTitle = get( state, `replacevars.parentTitle.${ parentId }.value` );
		if( parentTitle ) {
			return parentTitle;
		}
		const w = watch( this.store.getState, `replacevars.parentTitle.${ parentId }` );
		const unsubscribe = this.store.subscribe( w( parentTitle => {
			if( parentTitle.isLoaded ) {
				unsubscribe();
				return callback( parentTitle.value );
			}
		} ) );
		this.store.dispatch( getParentTitle( parentId ) );
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
