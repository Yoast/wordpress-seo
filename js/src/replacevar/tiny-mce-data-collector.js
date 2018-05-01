/* global wpseoReplaceVarsL10n jQuery */
/**
 * External dependencies
 */
import isUndefined from "lodash/isUndefined";

/**
 * Internal dependencies
 */
import DataCollector from "./data-collector";

/**
 * TinyMCE replacevar data collector.
 */
class TinyMceDataCollector extends DataCollector {
	/**
	 * Gets the parent id.
	 *
	 * @returns {string} The parent id.
	 */
	getParentId() {
		const select = jQuery( "#parent_id, #parent" ).eq( 0 );
		return select.find( "option:selected" ).val();
	}

	/**
	 * Gets the parent title.
	 *
	 * @returns {Promise} A Promise containing the Parent Title.
	 */
	getParentTitle() {
		const select = jQuery( "#parent_id, #parent" ).eq( 0 );
		const parentTitle = this.hasParentTitle( select ) ? this.getParentTitleReplacement( select ) : "";

		return new Promise( () => parentTitle );
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
