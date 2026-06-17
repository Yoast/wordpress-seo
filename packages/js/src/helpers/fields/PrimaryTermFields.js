import { getMetaValue, setMetaValue } from "./rest-meta";

/**
 * Returns the REST meta key for the given taxonomy.
 *
 * @param {string} taxonomyName The taxonomy name.
 *
 * @returns {string} The meta key.
 */
function metaKey( taxonomyName ) {
	return `_yoast_wpseo_primary_${ taxonomyName }`;
}

/**
 * This class is responsible for handling the interaction with primary term hidden fields.
 *
 * Unlike the other Fields helpers the meta key is dynamic (one per taxonomy), so methods
 * accept the taxonomy name rather than operating on fixed constants.
 *
 * When `wpseoScriptData.disableMetaboxInBlockEditor` is true the hidden DOM fields are not
 * rendered. In that case getters read from the `core/editor` store and setters dispatch to it
 * so that WordPress saves the values via the REST API on post save.
 */
export default class PrimaryTermFields {
	/**
	 * Returns the initial primary term ID for a taxonomy as a string.
	 *
	 * Reads from the hidden DOM input when it is present; falls back to the value supplied by
	 * PHP via props. Normalising to a string here ensures callers never receive a number,
	 * which avoids mixed-type comparisons elsewhere in the component tree.
	 *
	 * @param {HTMLElement|null}   inputElement The hidden input element, or null if not rendered.
	 * @param {number|string|null} fallback     The fallback value from props.taxonomy.primary.
	 *
	 * @returns {string} The initial primary term ID as a string.
	 */
	static getPrimaryTermElement( fieldId ) {
		return document.getElementById( fieldId );
	}

	/**
	 * Gets the current primary term ID for the given taxonomy.
	 *
	 * @param {string}           taxonomyName The taxonomy name.
	 * @param {HTMLElement|null} inputElement The hidden input element, or null if not rendered.
	 *
	 * @returns {string} The primary term ID as a string, or an empty string when unset.
	 */
	static get( taxonomyName, fieldId ) {
		return getMetaValue( metaKey( taxonomyName ), PrimaryTermFields.getPrimaryTermElement( fieldId ), "" );
	}

	/**
	 * Sets the primary term ID for the given taxonomy.
	 *
	 * Writes to the hidden DOM input in classic-editor or metabox-enabled block-editor mode.
	 * Dispatches an editPost action in REST-first block-editor mode. Pass -1 to clear the value.
	 *
	 * @param {string}           taxonomyName The taxonomy name.
	 * @param {number}           termId       The term ID. Pass -1 to clear.
	 * @param {string}           fieldId      The field ID of the hidden input element.
	 *
	 * @returns {void}
	 */
	static set( taxonomyName, fieldId, termId ) {
		const value = termId === -1 ? "" : String( termId );
		setMetaValue( metaKey( taxonomyName ), PrimaryTermFields.getPrimaryTermElement( fieldId ), value );
	}
}
