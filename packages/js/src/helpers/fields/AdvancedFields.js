/**
 * This class is responsible for handling the interaction with the hidden fields for Advanced Settings.
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
	 * Getter for the timestamplElement.
	 *
	 * @returns {HTMLElement} The timestampElement.
	 */
	static get timestampElement() {
		return document.getElementById( window.wpseoScriptData.isPost ? "yoast_wpseo_timestamp" : "hidden_wpseo_timestamp" );
	}

	/**
	 * Getter for the No Index setting.
	 *
	 * @returns {string} The No Index setting.
	 */
	static get noIndex() {
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
		AdvancedFields.noIndexElement.value = value;
	}

	/**
	 * Getter for the No Follow setting.
	 *
	 * @returns {string} The No Follow setting.
	 */
	static get noFollow() {
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
		AdvancedFields.noFollowElement.value = value;
	}

	/**
	 * Getter for the Advanced (metarobots) setting.
	 *
	 * @returns {string} The Advanced (metarobots) setting.
	 */
	static get advanced() {
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
		AdvancedFields.advancedElement.value = value;
	}

	/**
	 * Getter for the BreadCrumbsTitle setting.
	 *
	 * @returns {string} The BreadCrumbsTitle setting.
	 */
	static get breadcrumbsTitle() {
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
		AdvancedFields.breadcrumbsTitleElement.value = value;
	}

	/**
	 * Getter for the Canonical URL setting.
	 *
	 * @returns {string} The Canonical URL setting.
	 */
	static get canonical() {
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
		AdvancedFields.canonicalElement.value = value;
	}

	/**
	 * Getter for the Timestamp setting.
	 *
	 * @returns {boolean} The Timestamp setting.
	 */
	static get timestamp() {
		return AdvancedFields.timestampElement && AdvancedFields.timestampElement.value || false;
	}

	/**
	 * Setter for the Timestamp setting.
	 *
	 * @param {boolean} value The value to set.
	 *
	 * @returns {void}
	 */
	static set timestamp( value ) {
		AdvancedFields.timestampElement.value = value;
	}
}
