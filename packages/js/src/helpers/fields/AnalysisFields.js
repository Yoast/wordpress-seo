/**
 * This class is responsible for handling the interaction with the hidden fields for the analysis.
 */
export default class AnalysisFields {
	/**
	 * Getter for the keyphraseElement.
	 *
	 * @returns {HTMLElement|null} The keyphraseElement.
	 */
	static get keyphraseElement() {
		return document.getElementById( window.wpseoScriptData?.isPost ? "yoast_wpseo_focuskw" : "hidden_wpseo_focuskw" );
	}

	/**
	 * Getter for the isCornerstoneElement.
	 *
	 * @returns {HTMLElement|null} The isCornerstoneElement.
	 */
	static get isCornerstoneElement() {
		return document.getElementById( window.wpseoScriptData?.isPost ? "yoast_wpseo_is_cornerstone" : "hidden_wpseo_is_cornerstone" );
	}

	/**
	 * Getter for the SEO (overall) score hidden field.
	 *
	 * @returns {HTMLElement|null} The SEO score hidden field.
	 */
	static get seoScoreElement() {
		return document.getElementById( window.wpseoScriptData?.isPost ? "yoast_wpseo_linkdex" : "hidden_wpseo_linkdex" );
	}

	/**
	 * Getter for the Readability (overall) score hidden field.
	 *
	 * @returns {HTMLElement|null} The Readability score hidden field.
	 */
	static get readabilityScoreElement() {
		return document.getElementById( window.wpseoScriptData?.isPost ? "yoast_wpseo_content_score" : "hidden_wpseo_content_score" );
	}

	/**
	 * Getter for the inclusive language (overall) score hidden field.
	 *
	 * @returns {HTMLElement|null} The inclusive language score hidden field.
	 */
	static get inclusiveLanguageScoreElement() {
		return document.getElementById( window.wpseoScriptData?.isPost ? "yoast_wpseo_inclusive_language_score" : "hidden_wpseo_inclusive_language_score" );
	}

	/**
	 * Setter for the keyphrase.
	 *
	 * @param {string} value The keyphrase.
	 *
	 * @returns {void}
	 */
	static set keyphrase( value ) {
		if ( AnalysisFields.keyphraseElement ) {
			AnalysisFields.keyphraseElement.value = value;
		}
	}

	/**
	 * Getter for the keyphrase.
	 *
	 * @returns {string} The keyphrase.
	 */
	static get keyphrase() {
		return AnalysisFields.keyphraseElement?.value ?? "";
	}

	/**
	 * Setter for the isCornerstone. The element returns "true" and "false" but we should save "1" and "0".
	 *
	 * @param {boolean} value The isCornerstone.
	 *
	 * @returns {void}
	 */
	static set isCornerstone( value ) {
		if ( AnalysisFields.isCornerstoneElement ) {
			AnalysisFields.isCornerstoneElement.value = value ? "1" : "0";
		}
	}

	/**
	 * Getter for the isCornerstone. True if value = "1".
	 *
	 * @returns {boolean} The isCornerstone.
	 */
	static get isCornerstone() {
		return AnalysisFields.isCornerstoneElement?.value === "1";
	}

	/**
	 * Setter for the SEO (overall) score.
	 *
	 * @param {string} value The SEO (overall) score.
	 *
	 * @returns {void}
	 */
	static set seoScore( value ) {
		if ( AnalysisFields.seoScoreElement ) {
			AnalysisFields.seoScoreElement.value = value;
		}
	}

	/**
	 * Getter for the SEO (overall) score.
	 *
	 * @returns {string} The SEO (overall) score.
	 */
	static get seoScore() {
		return AnalysisFields.seoScoreElement?.value ?? "";
	}

	/**
	 * Setter for the Readability (overall) score.
	 *
	 * @param {string} value The Readability (overall) score.
	 *
	 * @returns {void}
	 */
	static set readabilityScore( value ) {
		if ( AnalysisFields.readabilityScoreElement ) {
			AnalysisFields.readabilityScoreElement.value = value;
		}
	}

	/**
	 * Getter for the Readability (overall) score.
	 *
	 * @returns {string} The Readability (overall) score.
	 */
	static get readabilityScore() {
		return AnalysisFields.readabilityScoreElement?.value ?? "";
	}

	/**
	 * Setter for the inclusive language (overall) score.
	 *
	 * @param {string} value The inclusive language (overall) score.
	 *
	 * @returns {void}
	 */
	static set inclusiveLanguageScore( value ) {
		if ( AnalysisFields.inclusiveLanguageScoreElement ) {
			AnalysisFields.inclusiveLanguageScoreElement.value = value;
		}
	}

	/**
	 * Getter for the inclusive language (overall) score.
	 *
	 * @returns {string} The inclusive language (overall) score.
	 */
	static get inclusiveLanguageScore() {
		return AnalysisFields.inclusiveLanguageScoreElement?.value ?? "";
	}
}
