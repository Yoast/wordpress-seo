/**
 * This class is responsible for handling the interaction with the hidden fields for the Wincher SEO analysis.
 */
export default class WincherSEOAnalysisFields {
	/**
	 * Getter for the isTrackableElement.
	 *
	 * @returns {HTMLElement} The isTrackableElement.
	 */
	static get isTrackableElement() {
		return document.getElementById( window.wpseoScriptData.isPost ? "yoast_wpseo_is_tracking" : "hidden_wpseo_is_tracking" );
	}

	/**
	 * Setter for the isTrackable. The element returns "true" and "false" but we should save "1" and "0".
	 *
	 * @param {boolean} value The isTrackableElement.
	 *
	 * @returns {void}
	 */
	static set isTracking( value ) {
		WincherSEOAnalysisFields.isTrackableElement.value = value ? "1" : "0";
	}

	/**
	 * Getter for the isTrackable. True if value = "1".
	 *
	 * @returns {boolean} The isTrackable.
	 */
	static get isTracking() {
		return WincherSEOAnalysisFields.isTrackableElement.value === "1";
	}
	/**
	 * Getter for the TrackedKeyphrasesElement.
	 *
	 * @returns {HTMLElement} The TrackedKeyphrasesElement.
	 */
	static get TrackedKeyphrasesElement() {
		return document.getElementById(
			window.wpseoScriptData.isPost ? "yoast_wpseo_wincher_tracked_keyphrases" : "hidden_yoast_wpseo_wincher_tracked_keyphrases"
		);
	}

	/**
	 * Setter for the TrackedKeyphrasesElement.
	 *
	 * @param {array} keyphrases The keyphrases that are being tracked.
	 *
	 * @returns {void}
	 */
	static set trackingKeyphrases( keyphrases ) {
		WincherSEOAnalysisFields.TrackedKeyphrasesElement.value = JSON.stringify( keyphrases );
	}

	/**
	 * Getter for the TrackedKeyphrasesElement.
	 *
	 * @returns {array} The tracked keyphrases.
	 */
	static get trackingKeyphrases() {
		return JSON.parse( WincherSEOAnalysisFields.TrackedKeyphrasesElement.value );
	}

	/**
	 * Getter for the Wincher website ID.
	 *
	 * @returns {int} The Wincher website ID.
	 */
	static get websiteId() {
		return window.wpseoScriptData.metabox.wincherWebsiteId;
	}
}
