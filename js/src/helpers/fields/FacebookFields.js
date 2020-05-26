/**
 * This class is responsible for handling the interaction with the hidden fields for Facebook.
 */
export default class FacebookFields {
	/**
	 * Getter for the titleElement.
	 *
	 * @returns {HTMLElement} The titleElement.
	 */
	static get titleElement() {
		return document.getElementById( window.wpseoScriptData.isPost ? "yoast_wpseo_opengraph-title" : "hidden_wpseo_opengraph-title" );
	}

	/**
	 * Getter for the descriptionElement.
	 *
	 * @returns {HTMLElement} The descriptionElement.
	 */
	static get descriptionElement() {
		return document.getElementById( window.wpseoScriptData.isPost ? "yoast_wpseo_opengraph-description" : "hidden_wpseo_opengraph-description" );
	}

	/**
	 * Getter for the imageIdElement.
	 *
	 * @returns {HTMLElement} The imageIdElement.
	 */
	static get imageIdElement() {
		return document.getElementById( window.wpseoScriptData.isPost ? "yoast_wpseo_opengraph-image-id" : "hidden_wpseo_opengraph-image-id" );
	}

	/**
	 * Getter for the imageUrlElement.
	 *
	 * @returns {HTMLElement} The imageUrlElement.
	 */
	static get imageUrlElement() {
		return document.getElementById( window.wpseoScriptData.isPost ? "yoast_wpseo_opengraph-image" : "hidden_wpseo_opengraph-image" );
	}

	/**
	 * Getter for the Facebook title.
	 *
	 * @returns {string} The Facebook title.
	 */
	static get title() {
		return FacebookFields.titleElement.value;
	}

	/**
	 * Setter for the Facebook title.
	 *
	 * @param {string} value The value to set.
	 *
	 * @returns {void}
	 */
	static set title( value ) {
		FacebookFields.titleElement.value = value;
	}

	/**
	 * Setter for the Facebook description.
	 *
	 * @param {string} value The Facebook description.
	 *
	 * @returns {void}
	 */
	static set description( value ) {
		FacebookFields.descriptionElement.value = value;
	}

	/**
	 * Getter for the Facebook description.
	 *
	 * @returns {string} The Facebook description.
	 */
	static get description() {
		return FacebookFields.descriptionElement.value;
	}

	/**
	 * Setter for the Facebook imageId.
	 *
	 * @param {string} value The Facebook imageId.
	 *
	 * @returns {void}
	 */
	static set imageId( value ) {
		FacebookFields.imageIdElement.value = value;
	}

	/**
	 * Getter for the Facebook imageId.
	 *
	 * @returns {string} The Facebook imageId.
	 */
	static get imageId() {
		return FacebookFields.imageIdElement.value;
	}

	/**
	 * Setter for the Facebook imageUrl.
	 *
	 * @param {string} value The Facebook imageUrl.
	 *
	 * @returns {void}
	 */
	static set imageUrl( value ) {
		FacebookFields.imageUrlElement.value = value;
	}

	/**
	 * Getter for the Facebook imageUrl.
	 *
	 * @returns {string} The Facebook imageUrl.
	 */
	static get imageUrl() {
		return FacebookFields.imageUrlElement.value;
	}
}
