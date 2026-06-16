import {
	metaKeyNoIndex,
	metaKeyNoFollow,
	metaKeyAdvanced,
	metaKeyBcTitle,
	metaKeyCanonical,
} from "../../shared-admin/constants";
import { getMetaValue, setMetaValue } from "./rest-meta";

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
		return getMetaValue( metaKeyNoIndex, AdvancedFields.noIndexElement ) || "0";
	}

	/**
	 * Setter for the No Index setting.
	 *
	 * @param {string} value The value to set.
	 *
	 * @returns {void}
	 */
	static set noIndex( value ) {
		setMetaValue( metaKeyNoIndex, AdvancedFields.noIndexElement, value );
	}

	/**
	 * Getter for the No Follow setting.
	 *
	 * @returns {string} The No Follow setting.
	 */
	static get noFollow() {
		return getMetaValue( metaKeyNoFollow, AdvancedFields.noFollowElement ) || "0";
	}

	/**
	 * Setter for the No Follow setting.
	 *
	 * @param {string} value The value to set.
	 *
	 * @returns {void}
	 */
	static set noFollow( value ) {
		setMetaValue( metaKeyNoFollow, AdvancedFields.noFollowElement, value );
	}

	/**
	 * Getter for the Advanced (metarobots) setting.
	 *
	 * @returns {string} The Advanced (metarobots) setting.
	 */
	static get advanced() {
		return getMetaValue( metaKeyAdvanced, AdvancedFields.advancedElement, "" );
	}

	/**
	 * Setter for the Advanced (metarobots) setting.
	 *
	 * @param {string} value The value to set.
	 *
	 * @returns {void}
	 */
	static set advanced( value ) {
		setMetaValue( metaKeyAdvanced, AdvancedFields.advancedElement, value );
	}

	/**
	 * Getter for the BreadCrumbsTitle setting.
	 *
	 * @returns {string} The BreadCrumbsTitle setting.
	 */
	static get breadcrumbsTitle() {
		return getMetaValue( metaKeyBcTitle, AdvancedFields.breadcrumbsTitleElement, "" );
	}

	/**
	 * Setter for the BreadCrumbsTitle setting.
	 *
	 * @param {string} value The value to set.
	 *
	 * @returns {void}
	 */
	static set breadcrumbsTitle( value ) {
		setMetaValue( metaKeyBcTitle, AdvancedFields.breadcrumbsTitleElement, value );
	}

	/**
	 * Getter for the Canonical URL setting.
	 *
	 * @returns {string} The Canonical URL setting.
	 */
	static get canonical() {
		return getMetaValue( metaKeyCanonical, AdvancedFields.canonicalElement, "" );
	}

	/**
	 * Setter for the Canonical URL setting.
	 *
	 * @param {string} value The value to set.
	 *
	 * @returns {void}
	 */
	static set canonical( value ) {
		setMetaValue( metaKeyCanonical, AdvancedFields.canonicalElement, value );
	}
}
