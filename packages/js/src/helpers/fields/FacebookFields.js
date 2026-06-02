import { dispatch, select } from "@wordpress/data";
import {
	metaKeyOgTitle,
	metaKeyOgDescription,
	metaKeyOgImageId,
	metaKeyOgImage,
} from "../../shared-admin/constants";
import isRestMetaActive from "./is-rest-meta-active";

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
		if ( isRestMetaActive() ) {
			return select( "core/editor" ).getEditedPostAttribute( "meta" )?.[ metaKeyOgTitle ] ?? "";
		}
		return FacebookFields.titleElement?.value ?? "";
	}

	/**
	 * Setter for the Facebook title.
	 *
	 * @param {string} value The value to set.
	 *
	 * @returns {void}
	 */
	static set title( value ) {
		if ( isRestMetaActive() ) {
			dispatch( "core/editor" ).editPost( { meta: { [ metaKeyOgTitle ]: value } } );
			return;
		}
		if ( FacebookFields.titleElement ) {
			FacebookFields.titleElement.value = value;
		}
	}

	/**
	 * Setter for the Facebook description.
	 *
	 * @param {string} value The Facebook description.
	 *
	 * @returns {void}
	 */
	static set description( value ) {
		if ( isRestMetaActive() ) {
			dispatch( "core/editor" ).editPost( { meta: { [ metaKeyOgDescription ]: value } } );
			return;
		}
		if ( FacebookFields.descriptionElement ) {
			FacebookFields.descriptionElement.value = value;
		}
	}

	/**
	 * Getter for the Facebook description.
	 *
	 * @returns {string} The Facebook description.
	 */
	static get description() {
		if ( isRestMetaActive() ) {
			return select( "core/editor" ).getEditedPostAttribute( "meta" )?.[ metaKeyOgDescription ] ?? "";
		}
		return FacebookFields.descriptionElement?.value ?? "";
	}

	/**
	 * Setter for the Facebook imageId.
	 *
	 * @param {string} value The Facebook imageId.
	 *
	 * @returns {void}
	 */
	static set imageId( value ) {
		if ( isRestMetaActive() ) {
			dispatch( "core/editor" ).editPost( { meta: { [ metaKeyOgImageId ]: value } } );
			return;
		}
		if ( FacebookFields.imageIdElement ) {
			FacebookFields.imageIdElement.value = value;
		}
	}

	/**
	 * Getter for the Facebook imageId.
	 *
	 * @returns {string} The Facebook imageId.
	 */
	static get imageId() {
		if ( isRestMetaActive() ) {
			return select( "core/editor" ).getEditedPostAttribute( "meta" )?.[ metaKeyOgImageId ] ?? "";
		}
		return FacebookFields.imageIdElement?.value ?? "";
	}

	/**
	 * Setter for the Facebook imageUrl.
	 *
	 * @param {string} value The Facebook imageUrl.
	 *
	 * @returns {void}
	 */
	static set imageUrl( value ) {
		if ( isRestMetaActive() ) {
			dispatch( "core/editor" ).editPost( { meta: { [ metaKeyOgImage ]: value } } );
			return;
		}
		if ( FacebookFields.imageUrlElement ) {
			FacebookFields.imageUrlElement.value = value;
		}
	}

	/**
	 * Getter for the Facebook imageUrl.
	 *
	 * @returns {string} The Facebook imageUrl.
	 */
	static get imageUrl() {
		if ( isRestMetaActive() ) {
			return select( "core/editor" ).getEditedPostAttribute( "meta" )?.[ metaKeyOgImage ] ?? "";
		}
		return FacebookFields.imageUrlElement?.value ?? "";
	}
}
