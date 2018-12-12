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
	 * @param {string} type 	The element type.
	 *
	 * @returns {void}
	 */
	constructor( type ) {
		super( "StructuredIrrelevant" );
		this.type = type;
	}
}

export default StructuredIrrelevant;
