// Assumes one mark element per mark object.
function getOffsets( mark ) {
	const marked = mark.getMarked();

	const startMark = "<yoastmark class='yoast-text-mark'>";
	let endMark = "</yoastmark>";

	let startOffset = marked.indexOf( startMark );
	let endOffset = marked.indexOf( endMark );

	endOffset = endOffset - startMark.length;

	return { startOffset, endOffset };
}

/**
 * Test
 *
 * @param {*} paper Test.
 * @param {*} marks Test.
 *
 * @returns {void}
 */
export function decorate( paper, marks ) {
	const blocks = wp.data.select( "core/editor" ).getBlocks();
	const annotations = [];

	blocks.forEach( ( block ) => {
		if ( block.name !== "core/paragraph" ) {
			return;
		}

		const { attributes } = block;
		const { content } = attributes;

		// For each mark see if it applies to this block.
		marks.forEach( ( mark ) => {
			// Content is an array so we need to loop over it.
			content.forEach( ( contentPiece, index ) => {
				if ( ! contentPiece.indexOf ) {
					return;
				}

				const found = contentPiece.indexOf( mark.getOriginal() );

				if ( found !== -1 ) {
					const offsets = getOffsets( mark );

					const startOffset = found + offsets.startOffset;
					const endOffset = found + offsets.endOffset;
					const startXPath = `text()[${ index + 1 }]`;
					const endXPath = `text()[${ index + 1 }]`;

					const annotation = {
						block: block.uid,
						startXPath,
						endXPath,
						startOffset,
						endOffset,
					};

					annotations.push( annotation );
				}
			} );
		} );
	} );

	annotations.forEach( ( annotation ) => {
		wp.data.dispatch( "core/editor" ).addAnnotation(
			annotation.block,
			annotation.startXPath,
			annotation.startOffset,
			annotation.endXPath,
			annotation.endOffset,
		);
	} );
}
