/**
 * A text.
 */
class Text {
	/**
	 * Creates a new text.
	 *
	 * @param {string} value This text's value, e.g. its content.
	 */
	constructor( value ) {
		this.name = "#text";
		/**
		 * This text's content.
		 *
		 * @type {string}
		 */
		this.value = value;
	}
}

export default Text;
