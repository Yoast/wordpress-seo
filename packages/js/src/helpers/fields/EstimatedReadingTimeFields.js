import { metaKeyEstimatedReadingTime } from "../../shared-admin/constants";
import { getMetaValue, setMetaValue } from "./rest-meta";

/**
 * This class is responsible for handling the interaction with the hidden fields for Estimated Reading Time (ert).
 *
 * When `wpseoScriptData.disableMetaboxInBlockEditor` is true the hidden DOM field is not rendered.
 * In that case the getter reads from the `core/editor` store and the setter dispatches to it so that
 * WordPress saves the value via the REST API on post save.
 */
export default class EstimatedReadingTimeFields {
	/**
	 * Getter for the estimated reading time element.
	 *
	 * @returns {HTMLElement} The estimatedReadingTimeElement.
	 */
	static get estimatedReadingTimeElement() {
		return document.getElementById( "yoast_wpseo_estimated-reading-time-minutes" );
	}

	/**
	 * Getter for the estimated reading time.
	 *
	 * @returns {string} The estimated reading time.
	 */
	static get estimatedReadingTime() {
		return getMetaValue( metaKeyEstimatedReadingTime, EstimatedReadingTimeFields.estimatedReadingTimeElement, "" );
	}

	/**
	 * Setter for the estimated reading time.
	 *
	 * @param {string} value The value to set.
	 *
	 * @returns {void}
	 */
	static set estimatedReadingTime( value ) {
		setMetaValue( metaKeyEstimatedReadingTime, EstimatedReadingTimeFields.estimatedReadingTimeElement, value, true );
	}
}
