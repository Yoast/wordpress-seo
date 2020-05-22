/**
 * This class is responsible for handling the interaction with the hidden fields for Twitter.
 */
export default class TwitterFields {
	/**
	 * Getter for the titleElement.
	 *
	 * @returns {HTMLElement} The titleElement.
	 */
	static get titleElement() {
		return document.getElementById( window.wpseoScriptData.isPost ? "yoast_wpseo_twitter-title" : "hidden_wpseo_twitter-title" );
	}

	/**
	 * Getter for the descriptionElement.
	 *
	 * @returns {HTMLElement} The descriptionElement.
	 */
	static get descriptionElement() {
		return document.getElementById( window.wpseoScriptData.isPost ? "yoast_wpseo_twitter-description" : "hidden_wpseo_twitter-description" );
	}

	/**
	 * Getter for the imageIdElement.
	 *
	 * @returns {HTMLElement} The imageIdElement.
	 */
	static get imageIdElement() {
		return document.getElementById( window.wpseoScriptData.isPost ? "yoast_wpseo_twitter-image-id" : "hidden_wpseo_twitter-image-id" );
	}

	/**
	 * Getter for the imageUrlElement.
	 *
	 * @returns {HTMLElement} The imageUrlElement.
	 */
	static get imageUrlElement() {
		return document.getElementById( window.wpseoScriptData.isPost ? "yoast_wpseo_twitter-image" : "hidden_wpseo_twitter-image" );
	}

	/**
	 * Getter for the Twitter title.
	 *
	 * @returns {string} The Twitter title.
	 */
	static get title() {
		return TwitterFields.titleElement.value;
	}

	/**
	 * Setter for the Twitter title.
	 *
	 * @param {string} value The value to set.
	 *
	 * @returns {void}
	 */
	static set title( value ) {
		TwitterFields.titleElement.value = value;
	}

	/**
	 * Setter for the Twitter description.
	 *
	 * @param {string} value The Twitter description.
	 *
	 * @returns {void}
	 */
	static set description( value ) {
		TwitterFields.descriptionElement.value = value;
	}

	/**
	 * Getter for the Twitter description.
	 *
	 * @returns {string} The Twitter description.
	 */
	static get description() {
		return TwitterFields.descriptionElement.value;
	}

	/**
	 * Setter for the Twitter imageId.
	 *
	 * @param {string} value The Twitter imageId.
	 *
	 * @returns {void}
	 */
	static set imageId( value ) {
		TwitterFields.imageIdElement.value = value;
	}

	/**
	 * Getter for the Twitter imageId.
	 *
	 * @returns {string} The Twitter imageId.
	 */
	static get imageId() {
		return TwitterFields.imageIdElement.value;
	}

	/**
	 * Setter for the Twitter imageUrl.
	 *
	 * @param {string} value The Twitter imageUrl.
	 *
	 * @returns {void}
	 */
	static set imageUrl( value ) {
		TwitterFields.imageUrlElement.value = value;
	}

	/**
	 * Getter for the Twitter imageUrl.
	 *
	 * @returns {string} The Twitter imageUrl.
	 */
	static get imageUrl() {
		return TwitterFields.imageUrlElement.value;
	}
}
