/**
 * Helper that holds the media object.
 *
 * @returns {void}
 */
export default class wpMediaHelper {
	/**
	 * Getter for the wp media object.
	 *
	 * @returns {*} The WordPress media object.
	 */
	get media() {
		if ( ! this.media ) {
			this.media = window.wp.media();
		}

		return this.media;
	}
}
