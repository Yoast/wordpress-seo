import { dispatch, select } from "@wordpress/data";

/**
 * Returns whether the block-editor REST meta path is active (metabox hidden fields disabled).
 *
 * @returns {boolean} True when the REST path is active.
 */
function isRestMetaActive() {
	return Boolean( window.wpseoScriptData?.disableMetaboxInBlockEditor );
}

/**
 * This class is responsible for handling the interaction with the hidden fields for Advanced Settings.
 *
 * When `wpseoScriptData.disableMetaboxInBlockEditor` is true the hidden DOM fields are not rendered.
 * In that case getters read from the `core/editor` store and setters dispatch to it so that
 * WordPress saves the values via the REST API on post save.
 */
export default class AdvancedFields {
	/**
	 * Getter for the noIndexElement.
	 *
	 * @returns {HTMLElement} The noIndexElement.
	 */
	static get noIndexElement() {
		return document.getElementById( window.wpseoScriptData.isPost ? "yoast_wpseo_meta-robots-noindex" : "hidden_wpseo_noindex" );
	}

	/**
	 * Getter for the noFollowElement.
	 *
	 * @returns {HTMLElement} The noFollowElement.
	 */
	static get noFollowElement() {
		return document.getElementById( "yoast_wpseo_meta-robots-nofollow" );
	}

	/**
	 * Getter for the advancedElement.
	 *
	 * @returns {HTMLElement} The advancedElement.
	 */
	static get advancedElement() {
		return document.getElementById( "yoast_wpseo_meta-robots-adv" );
	}

	/**
	 * Getter for the breadcrumbsTitleElement.
	 *
	 * @returns {HTMLElement} The breadcrumbsTitleElement.
	 */
	static get breadcrumbsTitleElement() {
		return document.getElementById( window.wpseoScriptData.isPost ? "yoast_wpseo_bctitle" : "hidden_wpseo_bctitle" );
	}

	/**
	 * Getter for the canonicalElement.
	 *
	 * @returns {HTMLElement} The canonicalElement.
	 */
	static get canonicalElement() {
		return document.getElementById( window.wpseoScriptData.isPost ? "yoast_wpseo_canonical" : "hidden_wpseo_canonical" );
	}

	/**
	 * Getter for the No Index setting.
	 *
	 * @returns {string} The No Index setting.
	 */
	static get noIndex() {
		if ( isRestMetaActive() ) {
			return select( "core/editor" ).getEditedPostAttribute( "meta" )?.[ "_yoast_wpseo_meta-robots-noindex" ] ?? "";
		}
		return AdvancedFields.noIndexElement && AdvancedFields.noIndexElement.value  || "";
	}

	/**
	 * Setter for the No Index setting.
	 *
	 * @param {string} value The value to set.
	 *
	 * @returns {void}
	 */
	static set noIndex( value ) {
		if ( isRestMetaActive() ) {
			dispatch( "core/editor" ).editPost( { meta: { "_yoast_wpseo_meta-robots-noindex": value } } );
			return;
		}
		AdvancedFields.noIndexElement.value = value;
	}

	/**
	 * Getter for the No Follow setting.
	 *
	 * @returns {string} The No Follow setting.
	 */
	static get noFollow() {
		if ( isRestMetaActive() ) {
			return select( "core/editor" ).getEditedPostAttribute( "meta" )?.[ "_yoast_wpseo_meta-robots-nofollow" ] ?? "";
		}
		return AdvancedFields.noFollowElement && AdvancedFields.noFollowElement.value || "";
	}

	/**
	 * Setter for the No Follow setting.
	 *
	 * @param {string} value The value to set.
	 *
	 * @returns {void}
	 */
	static set noFollow( value ) {
		if ( isRestMetaActive() ) {
			dispatch( "core/editor" ).editPost( { meta: { "_yoast_wpseo_meta-robots-nofollow": value } } );
			return;
		}
		AdvancedFields.noFollowElement.value = value;
	}

	/**
	 * Getter for the Advanced (metarobots) setting.
	 *
	 * @returns {string} The Advanced (metarobots) setting.
	 */
	static get advanced() {
		if ( isRestMetaActive() ) {
			return select( "core/editor" ).getEditedPostAttribute( "meta" )?.[ "_yoast_wpseo_meta-robots-adv" ] ?? "";
		}
		return AdvancedFields.advancedElement && AdvancedFields.advancedElement.value || "";
	}

	/**
	 * Setter for the Advanced (metarobots) setting.
	 *
	 * @param {string} value The value to set.
	 *
	 * @returns {void}
	 */
	static set advanced( value ) {
		if ( isRestMetaActive() ) {
			dispatch( "core/editor" ).editPost( { meta: { "_yoast_wpseo_meta-robots-adv": value } } );
			return;
		}
		AdvancedFields.advancedElement.value = value;
	}

	/**
	 * Getter for the BreadCrumbsTitle setting.
	 *
	 * @returns {string} The BreadCrumbsTitle setting.
	 */
	static get breadcrumbsTitle() {
		if ( isRestMetaActive() ) {
			return select( "core/editor" ).getEditedPostAttribute( "meta" )?._yoast_wpseo_bctitle ?? "";
		}
		return AdvancedFields.breadcrumbsTitleElement && AdvancedFields.breadcrumbsTitleElement.value || "";
	}

	/**
	 * Setter for the BreadCrumbsTitle setting.
	 *
	 * @param {string} value The value to set.
	 *
	 * @returns {void}
	 */
	static set breadcrumbsTitle( value ) {
		if ( isRestMetaActive() ) {
			dispatch( "core/editor" ).editPost( { meta: { _yoast_wpseo_bctitle: value } } );
			return;
		}
		AdvancedFields.breadcrumbsTitleElement.value = value;
	}

	/**
	 * Getter for the Canonical URL setting.
	 *
	 * @returns {string} The Canonical URL setting.
	 */
	static get canonical() {
		if ( isRestMetaActive() ) {
			return select( "core/editor" ).getEditedPostAttribute( "meta" )?._yoast_wpseo_canonical ?? "";
		}
		return AdvancedFields.canonicalElement && AdvancedFields.canonicalElement.value  || "";
	}

	/**
	 * Setter for the Canonical URL setting.
	 *
	 * @param {string} value The value to set.
	 *
	 * @returns {void}
	 */
	static set canonical( value ) {
		if ( isRestMetaActive() ) {
			dispatch( "core/editor" ).editPost( { meta: { _yoast_wpseo_canonical: value } } );
			return;
		}
		AdvancedFields.canonicalElement.value = value;
	}
}
