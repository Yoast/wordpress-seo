import { dispatch } from "@wordpress/data";

/**
 * This class is responsible for handling the interaction with the hidden fields for the analysis.
 */
export default class PostMeta {
	isPost = window.wpseoScriptData?.isPost;
	mapIds = {
		focuskw: this.isPost ? "yoast_wpseo_focuskw" : "hidden_wpseo_focuskw",
		isCornerstone: this.isPost ? "yoast_wpseo_is_cornerstone" : "hidden_wpseo_is_cornerstone",
		seoScore: this.isPost ? "yoast_wpseo_linkdex" : "hidden_wpseo_linkdex",
		readabilityScore: this.isPost ? "yoast_wpseo_content_score" : "hidden_wpseo_content_score",
		inclusiveLanguageScore: this.isPost ? "yoast_wpseo_inclusive_language_score" : "hidden_wpseo_inclusive_language_score",
	};

	booleanFields = [ "isCornerstone", "wordproof_timestamp" ];

	/**
	 * Get input element by id for classic editor.
	 * @param {string} id The id of the input element.
	 * @returns {HTMLElement} The input element.
	 */
	static getInputElement( id ) {
		return document.getElementById( this.mapIds[ id ] );
	}

	/**
	 * Get the initial value of a field.
	 *
	 * @param {string} fieldId The field id.
	 * @returns {value} The initial value of the field.
	 */
	static getInitialValue( fieldId ) {
		return window.wpseoScriptData?.metabox.metadata[ this.mapIds[ fieldId ] ] ?? "";
	}

	/**
	 * Prepare the value of a field.
	 * @param {string} fieldId The field id.
	 * @param {value} value The value of the field.
	 * @returns {value} The prepared value of the field.
	 */
	static preparedValue( fieldId, value ) {
		if ( this.booleanFields.includes( fieldId ) ) {
			return value ? "1" : "0";
		}
		return value ?? "";
	}

	/**
	 * Set the value of a field.
	 * @param {string} fieldId The field id.
	 * @param {value} value The value of the field.
	 * @returns {void}
	 */
	static setFieldValue( fieldId, value ) {
		const inputElement = this.getInputElement( fieldId );
		const preparedValue = this.preparedValue( fieldId, value );
		// If Classic Editor
		if ( inputElement ) {
			inputElement.value = preparedValue;
			return;
		}

		// If Block Editor
		try {
			const editPost = dispatch( "core/editor" ).editPost;
			editPost( {
				// eslint-disable-next-line camelcase
				meta: { [ `_yoast_wpseo_${fieldId}` ]: preparedValue },
			} );
			return;
		} catch ( e ) {
			// Do nothing.
		}

		// If Site Editor
	}
}
