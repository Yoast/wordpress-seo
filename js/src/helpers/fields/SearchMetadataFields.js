/**
 * This class is responsible for handling the interaction with the hidden fields for the search metadata.
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
		return SearchMetadataFields.titleElement.value;
	}

	/**
	 * Setter for the title.
	 *
	 * @param {string} value The title.
	 *
	 * @returns {void}
	 */
	static set title( value ) {
		SearchMetadataFields.titleElement.value = value;
	}

	/**
	 * Getter for the description.
	 *
	 * @returns {string} The description.
	 */
	static get description() {
		return SearchMetadataFields.descriptionElement.value;
	}

	/**
	 * Setter for the description.
	 *
	 * @param {string} value The description.
	 *
	 * @returns {void}
	 */
	static set description( value ) {
		SearchMetadataFields.descriptionElement.value = value;
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
