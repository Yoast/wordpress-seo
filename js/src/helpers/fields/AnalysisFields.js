/**
 * This class is responsible for handling the interaction with the hidden fields for the analysis.
 */
export default class AnalysisFields {
	/**
	 * Getter for the keyphraseElement.
	 *
	 * @returns {HTMLElement} The keyphraseElement.
	 */
	static get keyphraseElement() {
		return document.getElementById( window.wpseoScriptData.isPost ? "yoast_wpseo_focuskw" : "hidden_wpseo_focuskw" );
	}

	/**
	 * Getter for the isCornerstoneElement.
	 *
	 * @returns {HTMLElement} The isCornerstoneElement.
	 */
	static get isCornerstoneElement() {
		return document.getElementById( window.wpseoScriptData.isPost ? "yoast_wpseo_is_cornerstone" : "hidden_wpseo_is_cornerstone" );
	}

	/**
	 * Setter for the keyphrase.
	 *
	 * @param {string} value The keyphrase.
	 *
	 * @returns {void}
	 */
	static set keyphrase( value ) {
		AnalysisFields.keyphraseElement.value = value;
	}

	/**
	 * Getter for the keyphrase.
	 *
	 * @returns {string} The keyphrase.
	 */
	static get keyphrase() {
		return AnalysisFields.keyphraseElement.value;
	}

	/**
	 * Setter for the isCornerstone.
	 *
	 * @param {boolean} value The isCornerstone.
	 *
	 * @returns {void}
	 */
	static set isCornerstone( value ) {
		AnalysisFields.isCornerstoneElement.value = value ? "true" : "false";
	}

	/**
	 * Getter for the isCornerstone.
	 *
	 * @returns {boolean} The isCornerstone.
	 */
	static get isCornerstone() {
		return AnalysisFields.isCornerstoneElement.value === "true";
	}
}
