import { dispatch, select } from "@wordpress/data";
import {
	metaKeyNoIndex,
	metaKeyNoFollow,
	metaKeyAdvanced,
	metaKeyBcTitle,
	metaKeyCanonical,
} from "../../shared-admin/constants";
import isRestMetaActive, { shouldSkipMetaWrite } from "./is-rest-meta-active";

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
			return select( "core/editor" ).getEditedPostAttribute( "meta" )?.[ metaKeyNoIndex ] || "0";
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
			if ( ! shouldSkipMetaWrite( metaKeyNoIndex, value ) ) {
				dispatch( "core/editor" ).editPost( { meta: { [ metaKeyNoIndex ]: value } } );
			}
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
			return select( "core/editor" ).getEditedPostAttribute( "meta" )?.[ metaKeyNoFollow ] || "0";
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
			if ( ! shouldSkipMetaWrite( metaKeyNoFollow, value ) ) {
				dispatch( "core/editor" ).editPost( { meta: { [ metaKeyNoFollow ]: value } } );
			}
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
			return select( "core/editor" ).getEditedPostAttribute( "meta" )?.[ metaKeyAdvanced ] ?? "";
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
			if ( ! shouldSkipMetaWrite( metaKeyAdvanced, value ) ) {
				dispatch( "core/editor" ).editPost( { meta: { [ metaKeyAdvanced ]: value } } );
			}
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
			return select( "core/editor" ).getEditedPostAttribute( "meta" )?.[ metaKeyBcTitle ] ?? "";
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
			if ( ! shouldSkipMetaWrite( metaKeyBcTitle, value ) ) {
				dispatch( "core/editor" ).editPost( { meta: { [ metaKeyBcTitle ]: value } } );
			}
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
			return select( "core/editor" ).getEditedPostAttribute( "meta" )?.[ metaKeyCanonical ] ?? "";
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
			if ( ! shouldSkipMetaWrite( metaKeyCanonical, value ) ) {
				dispatch( "core/editor" ).editPost( { meta: { [ metaKeyCanonical ]: value } } );
			}
			return;
		}
		AdvancedFields.canonicalElement.value = value;
	}

	/**
	 * Returns the current advanced settings together with a loading flag.
	 *
	 * In REST mode the values come from the core/editor store, which only has the post meta
	 * once the entity record has been fetched. Calling this before that happens would populate
	 * yoast-seo/editor with empty strings and mark it as done loading, preventing the correct
	 * saved values from ever being reflected in the UI.
	 *
	 * When the entity meta is not yet available this method signals that loading is still in
	 * progress (isLoading: true) so the caller can retry. The AdvancedSettings component
	 * already retries on every render while isLoading is true.
	 *
	 * @returns {{noIndex: string, noFollow: string, advanced: string[], breadcrumbsTitle: string, canonical: string, isLoading: boolean}}
	 */
	static getLoadableSettings() {
		const metaReady = ! isRestMetaActive() || Boolean( select( "core/editor" ).getEditedPostAttribute( "meta" ) );
		return {
			noIndex: AdvancedFields.noIndex,
			noFollow: AdvancedFields.noFollow,
			advanced: AdvancedFields.advanced.split( "," ),
			breadcrumbsTitle: AdvancedFields.breadcrumbsTitle,
			canonical: AdvancedFields.canonical,
			isLoading: ! metaReady,
		};
	}
}
