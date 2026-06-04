import { select } from "@wordpress/data";
import { metaKeyEstimatedReadingTime } from "../../shared-admin/constants";
import { isRestMetaActive, shouldSkipMetaWrite, writeMetaWithoutUndo } from "./rest-meta";

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
		if ( isRestMetaActive ) {
			return select( "core/editor" ).getEditedPostAttribute( "meta" )?.[ metaKeyEstimatedReadingTime ] ?? "";
		}
		return EstimatedReadingTimeFields.estimatedReadingTimeElement?.value || "";
	}

	/**
	 * Setter for the estimated reading time.
	 *
	 * @param {string} value The value to set.
	 *
	 * @returns {void}
	 */
	static set estimatedReadingTime( value ) {
		if ( isRestMetaActive ) {
			if ( ! shouldSkipMetaWrite( metaKeyEstimatedReadingTime, value ) ) {
				writeMetaWithoutUndo( { [ metaKeyEstimatedReadingTime ]: value } );
			}
			return;
		}
		if ( EstimatedReadingTimeFields.estimatedReadingTimeElement ) {
			EstimatedReadingTimeFields.estimatedReadingTimeElement.value = value;
		}
	}
}
