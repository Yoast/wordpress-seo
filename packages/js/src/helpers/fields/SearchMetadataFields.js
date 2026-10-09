import { metaKeyTitle, metaKeyMetaDesc } from "../../shared-admin/constants";
import { getMetaValue, setMetaValue } from "./rest-meta";

/**
 * This class is responsible for handling the interaction with the hidden fields for the search metadata.
 *
 * When `wpseoScriptData.disableMetaboxInBlockEditor` is true the hidden DOM fields are not rendered.
 * In that case getters read from the `core/editor` store and setters dispatch to it so that
 * WordPress saves the values via the REST API on post save.
 */
export default class SearchMetadataFields {
	/**
	 * Getter for the titleElement.
	 *
	 * @returns {HTMLElement} The titleElement.
	 */
	static get titleElement() {
		return document.getElementById( window.wpseoScriptData.isPost ? "yoast_wpseo_title" : "hidden_wpseo_title" );
	}

	/**
	 * Getter for the descriptionElement.
	 *
	 * @returns {HTMLElement} The descriptionElement.
	 */
	static get descriptionElement() {
		return document.getElementById( window.wpseoScriptData.isPost ? "yoast_wpseo_metadesc" : "hidden_wpseo_desc" );
	}

	/**
	 * Getter for the slugElement.
	 *
	 * @returns {HTMLElement} The slugElement.
	 */
	static get slugElement() {
		return document.getElementById( "yoast_wpseo_slug" );
	}

	/**
	 * Getter for the title.
	 *
	 * @returns {string} The title.
	 */
	static get title() {
		return getMetaValue( metaKeyTitle, SearchMetadataFields.titleElement, "" );
	}

	/**
	 * Setter for the title.
	 *
	 * @param {string} value The title.
	 *
	 * @returns {void}
	 */
	static set title( value ) {
		setMetaValue( metaKeyTitle, SearchMetadataFields.titleElement, value );
	}

	/**
	 * Getter for the description.
	 *
	 * @returns {string} The description.
	 */
	static get description() {
		return getMetaValue( metaKeyMetaDesc, SearchMetadataFields.descriptionElement, "" );
	}

	/**
	 * Setter for the description.
	 *
	 * @param {string} value The description.
	 *
	 * @returns {void}
	 */
	static set description( value ) {
		setMetaValue( metaKeyMetaDesc, SearchMetadataFields.descriptionElement, value );
	}

	/**
	 * Getter for the slug.
	 *
	 * @returns {string} The slug.
	 */
	static get slug() {
		return SearchMetadataFields.slugElement.value;
	}

	/**
	 * Setter for the slug.
	 *
	 * @param {string} value The slug.
	 *
	 * @returns {void}
	 */
	static set slug( value ) {
		SearchMetadataFields.slugElement.value = value;
	}
}
