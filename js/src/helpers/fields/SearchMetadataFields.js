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
	 * Getter for the keyphraseElement.
	 *
	 * @returns {HTMLElement} The keyphraseElement.
	 */
	static get keyphraseElement() {
		return document.getElementById( window.wpseoScriptData.isPost ? "yoast_wpseo_focuskw" : "hidden_wpseo_focuskw" );
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
	 * Setter for the keyphrase.
	 *
	 * @param {string} value The keyphrase.
	 *
	 * @returns {void}
	 */
	static set keyphrase( value ) {
		SearchMetadataFields.keyphraseElement.value = value;
	}

	/**
	 * Getter for the keyphrase.
	 *
	 * @returns {string} The keyphrase.
	 */
	static get keyphrase() {
		return SearchMetadataFields.keyphraseElement.value;
	}
}
