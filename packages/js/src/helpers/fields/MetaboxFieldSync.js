import { get } from "lodash";
/**
 * This class is responsible for syncing hidden fields with store.
 */
export default class MetaboxFieldSync {
	static isPost =  get( window, "wpseoScriptData.isPost", false );
	static metaPrefix = "_yoast_wpseo_";

    // Whether we are handling a post or a term.
    static idPrefix = this.isPost ? "yoast_wpseo_" : "hidden_wpseo_";

	static booleanFields = [ "isCornerstone", "wordproof_timestamp" ];

	/**
	 * Get input element by key.
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
		return window.wpseoScriptData?.metabox?.metaData[ fieldKey ];
	}

	/**
	 * Get no index value.
	 * @param {string} value The value.
	 * @returns {void}
	 */
	static getNoIndex() {
		if ( this.isPost ) {
			return get( window, "wpseoScriptData.metabox.metaData.meta-robots-noindex", "" );
		}
		return get( window, "wpseoScriptData.metabox.metaData.noindex", "" );
	}

	/**
	 * Toggle the hidden field value.
	 *
	 * @param {string} fieldkey The field key.
	 * @returns {void}
	 */
	static toggleFieldValue( fieldkey ) {
		const inputElement = this.getInputElement( fieldkey );
		if ( inputElement ) {
			const newValue = inputElement.value === "1" ? "0" : "1";
			this.setFieldValue( fieldkey, newValue );
		}
	}

	/**
	 * Set the value of a boolean field.
	 * @param {string} fieldKey The field key.
	 * @param {value} value The value of the field.
	 * @returns {value} The prepared value of the field.
	 */
	static setBooleanFieldValue( fieldKey, value ) {
		const inputElement = this.getInputElement( fieldKey );

		if ( inputElement ) {
			inputElement.value = value ? "1" : "0";
		}
	}

	/**
	 * Set the value of a field.
	 * @param {string} fieldId The field id.
	 * @param {value} value The value of the field.
	 * @returns {void}
	 */
	static setFieldValueBySingleId( fieldId, value ) {
		const inputElement = document.getElementById( fieldId );

		if ( inputElement ) {
			inputElement.value = value ?? "";
		}
	}

	/**
	 * Set no index value.
	 * @param {string} value The value.
	 * @returns {void}
	 */
	static setNoIndex( value ) {
		const inputElement = document.getElementById( this.isPost ? "yoast_wpseo_meta-robots-noindex" : "hidden_wpseo_noindex" );
		if ( inputElement ) {
			inputElement.value = value;
		}
	}

	/**
	 * Set the value of a field.
	 * @param {string} fieldKey The field key.
	 * @param {value} value The value of the field.
	 * @returns {void}
	 */
	static setFieldValue( fieldKey, value ) {
		const inputElement = this.getInputElement( fieldKey );

		if ( inputElement && inputElement.value ) {
			inputElement.value = value ?? "";
			return;
		}
	}
}
