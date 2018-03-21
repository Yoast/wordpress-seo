/* global wp wpseoReplaceVarsL10n */
import isUndefined from "lodash/isUndefined";
import get from "lodash/get";
import noop from "lodash/noop";
import isGutenbergDataAvailable from "../helpers/isGutenbergDataAvailable";

class GutenbergDataCollector {
	constructor( refresh ) {
		console.log( refresh );
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
		if ( parentId === 0 ) {
			return "";
		}
		const cachedParentTitle = get( this.parentTitles, parentId );
		if( cachedParentTitle ) {
			return cachedParentTitle;
		}
		const model = new wp.api.models.Page( { id: parentId } );
		model.fetch().done( data => {
			this.parentTitles[ parentId ] = data.title.rendered;
			this.refresh();
		} ).fail( () => {} );
	}
}


class TinyMceDataCollector {
	/**
	 * Gets the parent title from the select box.
	 *
	 * @returns {string} Parent title.
	 */
	getParentTitle() {
		const select = jQuery( "#parent_id, #parent" ).eq( 0 );

		if ( ! this.hasParentTitle( select ) ) {
			return "";
		}

		return this.getParentTitleReplacement( select );
	}

	/**
	 * Checks whether or not there's a parent title available.
	 *
	 * @param {Object} parent The parent element.
	 *
	 * @returns {boolean} Whether or not there is a parent title present.
	 */
	hasParentTitle( parent ) {
		return ( ! isUndefined( parent ) && ! isUndefined( parent.prop( "options" ) ) );
	}

	/**
	 * Gets the replacement for the parent title.
	 *
	 * @param {Object} parent The parent object to use to look for the selected option.
	 * @returns {string} The string to replace the placeholder with.
	 */
	getParentTitleReplacement( parent ) {
		const parentText = parent.find( "option:selected" ).text();

		if ( parentText === wpseoReplaceVarsL10n.no_parent_text ) {
			return "";
		}

		return parentText;
	}
}

/**
 * Adapter for retrieving the replacevars in either the classic editor or TinyMCE.
 */
class ReplacevarData {
	/**
	 * @param {function} refresh Callback to be called when data has changed.
	 */
	constructor( refresh ) {
		if ( isGutenbergDataAvailable() ) {
			this.dataCollector = new GutenbergDataCollector( refresh );
		} else {
			this.dataCollector = new TinyMceDataCollector();
		}
	}

	/**
	 * Gets the parent title from the select box.
	 *
	 * @returns {string} Parent title.
	 */
	getParentTitle() {
		return this.dataCollector.getParentTitle();
	}
}

export default ReplacevarData;
