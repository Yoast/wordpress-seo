import Node from "./Node";
/**
 * Represents a piece of structured data that is not relevant for further analysis.
 *
 * Examples from HTML include content within `<script>` and `<style>` elements.
 */
class StructuredIrrelevant extends Node {
	/**
	 * Represents a piece of structured data that is not relevant for further analysis.
	 *
	 * Examples from HTML include content within `<script>` and `<style>` elements.
	 *
	 * @param {string} tag 	The element tag.
	 *
	 * @returns {void}
	 */
	constructor( tag ) {
		super( "StructuredIrrelevant" );
		this.tag = tag;
		this.content = "";
	}
}

export default StructuredIrrelevant;
