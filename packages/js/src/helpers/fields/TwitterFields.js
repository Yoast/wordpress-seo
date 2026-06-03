import { dispatch, select } from "@wordpress/data";
import {
	metaKeyTwitterTitle,
	metaKeyTwitterDescription,
	metaKeyTwitterImageId,
	metaKeyTwitterImage,
} from "../../shared-admin/constants";
import { isRestMetaActive, shouldSkipMetaWrite } from "./rest-meta";

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
		if ( isRestMetaActive() ) {
			return select( "core/editor" ).getEditedPostAttribute( "meta" )?.[ metaKeyTwitterTitle ] ?? "";
		}
		return TwitterFields.titleElement?.value ?? "";
	}

	/**
	 * Setter for the Twitter title.
	 *
	 * @param {string} value The value to set.
	 *
	 * @returns {void}
	 */
	static set title( value ) {
		if ( isRestMetaActive() ) {
			if ( ! shouldSkipMetaWrite( metaKeyTwitterTitle, value ) ) {
				dispatch( "core/editor" ).editPost( { meta: { [ metaKeyTwitterTitle ]: value } } );
			}
			return;
		}
		if ( TwitterFields.titleElement ) {
			TwitterFields.titleElement.value = value;
		}
	}

	/**
	 * Setter for the Twitter description.
	 *
	 * @param {string} value The Twitter description.
	 *
	 * @returns {void}
	 */
	static set description( value ) {
		if ( isRestMetaActive() ) {
			if ( ! shouldSkipMetaWrite( metaKeyTwitterDescription, value ) ) {
				dispatch( "core/editor" ).editPost( { meta: { [ metaKeyTwitterDescription ]: value } } );
			}
			return;
		}
		if ( TwitterFields.descriptionElement ) {
			TwitterFields.descriptionElement.value = value;
		}
	}

	/**
	 * Getter for the Twitter description.
	 *
	 * @returns {string} The Twitter description.
	 */
	static get description() {
		if ( isRestMetaActive() ) {
			return select( "core/editor" ).getEditedPostAttribute( "meta" )?.[ metaKeyTwitterDescription ] ?? "";
		}
		return TwitterFields.descriptionElement?.value ?? "";
	}

	/**
	 * Setter for the Twitter imageId.
	 *
	 * @param {string} value The Twitter imageId.
	 *
	 * @returns {void}
	 */
	static set imageId( value ) {
		if ( isRestMetaActive() ) {
			if ( ! shouldSkipMetaWrite( metaKeyTwitterImageId, value ) ) {
				dispatch( "core/editor" ).editPost( { meta: { [ metaKeyTwitterImageId ]: value } } );
			}
			return;
		}
		if ( TwitterFields.imageIdElement ) {
			TwitterFields.imageIdElement.value = value;
		}
	}

	/**
	 * Getter for the Twitter imageId.
	 *
	 * @returns {string} The Twitter imageId.
	 */
	static get imageId() {
		if ( isRestMetaActive() ) {
			return select( "core/editor" ).getEditedPostAttribute( "meta" )?.[ metaKeyTwitterImageId ] ?? "";
		}
		return TwitterFields.imageIdElement?.value ?? "";
	}

	/**
	 * Setter for the Twitter imageUrl.
	 *
	 * @param {string} value The Twitter imageUrl.
	 *
	 * @returns {void}
	 */
	static set imageUrl( value ) {
		if ( isRestMetaActive() ) {
			if ( ! shouldSkipMetaWrite( metaKeyTwitterImage, value ) ) {
				dispatch( "core/editor" ).editPost( { meta: { [ metaKeyTwitterImage ]: value } } );
			}
			return;
		}
		if ( TwitterFields.imageUrlElement ) {
			TwitterFields.imageUrlElement.value = value;
		}
	}

	/**
	 * Getter for the Twitter imageUrl.
	 *
	 * @returns {string} The Twitter imageUrl.
	 */
	static get imageUrl() {
		if ( isRestMetaActive() ) {
			return select( "core/editor" ).getEditedPostAttribute( "meta" )?.[ metaKeyTwitterImage ] ?? "";
		}
		return TwitterFields.imageUrlElement?.value ?? "";
	}
}
