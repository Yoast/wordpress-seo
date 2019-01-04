import Node from "./Node";
/**
 * Represents a piece of structured data that is not relevant for further analysis.
 *
 * Examples from HTML include content within `<script>` and `<style>` elements.
 *
 * @memberOf module:tree/structure
 */
class StructuredIrrelevant extends Node {
	/**
	 * Represents a piece of structured data that is not relevant for further analysis.
	 *
	 * Examples from HTML include content within `<script>` and `<style>` elements.
	 *
	 * @param {string} tag The element tag.
	 *
	 * @returns {void}
	 */
	constructor( tag ) {
		super( "StructuredIrrelevant" );
		/**
		 * Type of node (e.g. "script", "code" etc.).
		 * @type {string}
		 */
		this.tag = tag;
		/**
		 * Node's content (without opening and closing tags).
		 * @type {string}
		 */
		this.content = "";
	}
}

export default StructuredIrrelevant;
