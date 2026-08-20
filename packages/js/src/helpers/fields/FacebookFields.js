import {
	metaKeyOgTitle,
	metaKeyOgDescription,
	metaKeyOgImageId,
	metaKeyOgImage,
} from "../../shared-admin/constants";
import { getMetaValue, setMetaValue } from "./rest-meta";

/**
 * This class is responsible for handling the interaction with the hidden fields for Facebook.
 *
 * When `wpseoScriptData.disableMetaboxInBlockEditor` is true the hidden DOM fields are not rendered.
 * In that case getters read from the `core/editor` store and setters dispatch to it so that
 * WordPress saves the values via the REST API on post save.
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
		return getMetaValue( metaKeyOgTitle, FacebookFields.titleElement, "" );
	}

	/**
	 * Setter for the Facebook title.
	 *
	 * @param {string} value The value to set.
	 *
	 * @returns {void}
	 */
	static set title( value ) {
		setMetaValue( metaKeyOgTitle, FacebookFields.titleElement, value );
	}

	/**
	 * Setter for the Facebook description.
	 *
	 * @param {string} value The Facebook description.
	 *
	 * @returns {void}
	 */
	static set description( value ) {
		setMetaValue( metaKeyOgDescription, FacebookFields.descriptionElement, value );
	}

	/**
	 * Getter for the Facebook description.
	 *
	 * @returns {string} The Facebook description.
	 */
	static get description() {
		return getMetaValue( metaKeyOgDescription, FacebookFields.descriptionElement, "" );
	}

	/**
	 * Setter for the Facebook imageId.
	 *
	 * @param {string} value The Facebook imageId.
	 *
	 * @returns {void}
	 */
	static set imageId( value ) {
		setMetaValue( metaKeyOgImageId, FacebookFields.imageIdElement, value );
	}

	/**
	 * Getter for the Facebook imageId.
	 *
	 * @returns {string} The Facebook imageId.
	 */
	static get imageId() {
		return getMetaValue( metaKeyOgImageId, FacebookFields.imageIdElement, "" );
	}

	/**
	 * Setter for the Facebook imageUrl.
	 *
	 * @param {string} value The Facebook imageUrl.
	 *
	 * @returns {void}
	 */
	static set imageUrl( value ) {
		setMetaValue( metaKeyOgImage, FacebookFields.imageUrlElement, value );
	}

	/**
	 * Getter for the Facebook imageUrl.
	 *
	 * @returns {string} The Facebook imageUrl.
	 */
	static get imageUrl() {
		return getMetaValue( metaKeyOgImage, FacebookFields.imageUrlElement, "" );
	}
}
