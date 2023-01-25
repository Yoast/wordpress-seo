/**
 * This class is responsible for handling the interaction with the hidden fields for Estimated Reading Time (ert).
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
		return EstimatedReadingTimeFields.estimatedReadingTimeElement &&
		EstimatedReadingTimeFields.estimatedReadingTimeElement.value || "";
	}

	/**
	 * Setter for the estimated reading time.
	 *
	 * @param {string} value The value to set.
	 *
	 * @returns {void}
	 */
	static set estimatedReadingTime( value ) {
		if ( EstimatedReadingTimeFields.estimatedReadingTimeElement ) {
			EstimatedReadingTimeFields.estimatedReadingTimeElement.value = value;
		}
	}
}
