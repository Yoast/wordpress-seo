/* global wpseoReplaceVarsL10n */

import isUndefined from "lodash/isUndefined";

class TinyMceDataCollector {
	/**
	 * Gets the parent title.
	 *
	 * @param {number|string} parentId The parent id to get the title for.
	 * @param {function}      callback Callback to call when parent title has been fetched.
	 *
	 * @returns {string} Parent title.
	 */
	getParentTitle( parentId, callback ) {
		const select = jQuery( "#parent_id, #parent" ).eq( 0 );

		if ( ! this.hasParentTitle( select ) ) {
			return "";
		}

		callback( this.getParentTitleReplacement( select ) );
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

	/**
	 * Gets the parent id.
	 *
	 * @returns {string} The parent id.
	 */
	getParentId() {
		const select = jQuery( "#parent_id, #parent" ).eq( 0 );
		return select.find( "option:selected" ).val();
	}
}

export default TinyMceDataCollector;
