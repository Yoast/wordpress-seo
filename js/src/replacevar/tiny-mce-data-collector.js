/* global wpseoReplaceVarsL10n */

import isUndefined from "lodash/isUndefined";

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

export default TinyMceDataCollector;
