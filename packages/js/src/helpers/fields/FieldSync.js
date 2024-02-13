import { dispatch } from "@wordpress/data";

/**
 * This class is responsible for syncing hidden fields with store.
 */
export default class FieldSync {
	static isPost = window.wpseoScriptData?.isPost;
	static metaPrefix = "_yoast_wpseo_";

    // Whether we are handling a post or a term.
    static idPrefix = this.isPost ? "yoast_wpseo_" : "hidden_wpseo_";

	static booleanFields = [ "isCornerstone", "wordproof_timestamp" ];

	/**
	 * Get input element by id for classic editor.
     *
	 * @param {string} fieldKey The key of the input element.
	 * @returns {HTMLElement} The input element.
	 */
	static getInputElement( fieldKey ) {
		return document.getElementById( this.idPrefix + fieldKey );
	}

	/**
	 * Get the initial value of a field. Same location in window object for post and term.
	 *
	 * @param {string} fieldKey The field key.
	 * @returns {value} The initial value of the field.
	 */
	static getInitialValue( fieldKey ) {
		return window.wpseoScriptData?.metabox.metadata[ fieldKey ];
	}

	/**
	 * Toggle the hidden field value.
	 *
	 * @param {string} fieldkey The field key.
	 * @returns {void}
	 */
	static toggleFieldValue( fieldkey ) {
		try {
			const value = this.getInputElement( fieldkey );
			const newValue = value === "1" ? "0" : "1";
			this.setFieldValue( fieldkey, newValue );
		} finally {
			// Do nothing.
		}
	}

	/**
	 * Prepare the value of a field.
	 * @param {string} fieldKey The field key.
	 * @param {value} value The value of the field.
	 * @returns {value} The prepared value of the field.
	 */
	static preparedValue( fieldKey, value ) {
		if ( this.booleanFields.includes( fieldKey ) ) {
			return value ? "1" : "0";
		}
		return value ?? "";
	}

	/**
	 * Set the value of a field.
	 * @param {string} fieldKey The field id.
	 * @param {value} value The value of the field.
	 * @returns {void}
	 */
	static setFieldValue( fieldKey, value ) {
		const inputElement = this.getInputElement( fieldKey );

		// If Classic Editor
		if ( inputElement ) {
			inputElement.value = value;
			return;
		}

		// If Block Editor and a post
		try {
			const editPost = dispatch( "core/editor" ).editPost;
			editPost( {
				meta: { [ this.metaPrefix + fieldKey ]: value },
			} );
			return;
		} catch ( e ) {
			// Do nothing.
		}

		// If Site Editor
	}
}
