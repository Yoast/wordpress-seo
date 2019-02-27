import { removeHTML, normalizeWhitespace } from "../text/transform";

/**
 * Collects all the textual content from the children of a certain block.
 *
 * @param {Object} block The block to collect from.
 *
 * @returns {string} The actual textual content.
 */
export function collectTextualContent( block ) {
	const glue = " ";
	const { innerBlocks } = block;

	const content = innerBlocks.map( ( innerBlock ) => {
		const { attributes } = innerBlock;

		switch ( innerBlock.name ) {
			case "core/paragraph":
			case "core/heading":
			case "core/verse":
				return normalizeWhitespace( removeHTML( attributes.content ) );

			case "core/quote":
				return normalizeWhitespace( removeHTML( attributes.value ) ) + " " + normalizeWhitespace( removeHTML( attributes.citation ) );

			case "core/shortcode":
				// Undecided
				break;

			case "core/list":
				// Undecided
				break;

			case "core/code":
				// Undecided
				break;


			case "core/table":
				// Undecided
				break;

			case "core/media-text":
				return collectTextualContent( innerBlock );
		}
	} );

	return content.join( glue );
}
