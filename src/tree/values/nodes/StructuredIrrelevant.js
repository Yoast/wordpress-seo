/**
 * Represents a piece of structured data that is not relevant for further analysis.
 *
 * Examples from HTML include content within `<script>` and `<style>` elements.
 */
class StructuredIrrelevant {
	/**
	 * Represents a piece of structured data that is not relevant for further analysis.
	 *
	 * Examples from HTML include content within `<script>` and `<style>` elements.
	 *
	 * @param {string} content 	The raw content of this node.
	 */
	constructor( content ) {
		this.content = content;
	}
}

export default StructuredIrrelevant;
