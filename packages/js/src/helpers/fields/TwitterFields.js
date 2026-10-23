import {
	metaKeyTwitterTitle,
	metaKeyTwitterDescription,
	metaKeyTwitterImageId,
	metaKeyTwitterImage,
} from "../../shared-admin/constants";
import { getMetaValue, setMetaValue } from "./rest-meta";

/**
 * This class is responsible for handling the interaction with the hidden fields for Twitter.
 *
 * When `wpseoScriptData.disableMetaboxInBlockEditor` is true the hidden DOM fields are not rendered.
 * In that case getters read from the `core/editor` store and setters dispatch to it so that
 * WordPress saves the values via the REST API on post save.
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
		return getMetaValue( metaKeyTwitterTitle, TwitterFields.titleElement, "" );
	}

	/**
	 * Setter for the Twitter title.
	 *
	 * @param {string} value The value to set.
	 *
	 * @returns {void}
	 */
	static set title( value ) {
		setMetaValue( metaKeyTwitterTitle, TwitterFields.titleElement, value );
	}

	/**
	 * Setter for the Twitter description.
	 *
	 * @param {string} value The Twitter description.
	 *
	 * @returns {void}
	 */
	static set description( value ) {
		setMetaValue( metaKeyTwitterDescription, TwitterFields.descriptionElement, value );
	}

	/**
	 * Getter for the Twitter description.
	 *
	 * @returns {string} The Twitter description.
	 */
	static get description() {
		return getMetaValue( metaKeyTwitterDescription, TwitterFields.descriptionElement, "" );
	}

	/**
	 * Setter for the Twitter imageId.
	 *
	 * @param {string} value The Twitter imageId.
	 *
	 * @returns {void}
	 */
	static set imageId( value ) {
		setMetaValue( metaKeyTwitterImageId, TwitterFields.imageIdElement, value );
	}

	/**
	 * Getter for the Twitter imageId.
	 *
	 * @returns {string} The Twitter imageId.
	 */
	static get imageId() {
		return getMetaValue( metaKeyTwitterImageId, TwitterFields.imageIdElement, "" );
	}

	/**
	 * Setter for the Twitter imageUrl.
	 *
	 * @param {string} value The Twitter imageUrl.
	 *
	 * @returns {void}
	 */
	static set imageUrl( value ) {
		setMetaValue( metaKeyTwitterImage, TwitterFields.imageUrlElement, value );
	}

	/**
	 * Getter for the Twitter imageUrl.
	 *
	 * @returns {string} The Twitter imageUrl.
	 */
	static get imageUrl() {
		return getMetaValue( metaKeyTwitterImage, TwitterFields.imageUrlElement, "" );
	}
}
