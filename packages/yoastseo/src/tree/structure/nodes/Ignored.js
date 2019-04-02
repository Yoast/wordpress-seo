import Node from "./Node";
/**
 * Represents a piece of structured data that is ignored in further analysis.
 *
 * Examples from HTML include content within `<script>` and `<style>` elements.
 *
 * @extends module:tree/structure.Node
 *
 * @memberOf module:tree/structure
 */
class Ignored extends Node {
	/**
	 * Makes a new `Ignored` element, representing content that is ignored in further analysis.
	 *
	 * Examples from HTML include content within `<script>` and `<style>` elements.
	 *
	 * @param {string} tag The element tag.
	 *
	 * @returns {void}
	 */
	constructor( tag ) {
		super( "Ignored" );
		/**
		 * Type of content (e.g. "script", "code" etc.).
		 * @type {string}
		 */
		this.tag = tag;
		/**
		 * Element's content (without opening and closing tags).
		 * @type {string}
		 */
		this.content = "";
	}
}

export default Ignored;
