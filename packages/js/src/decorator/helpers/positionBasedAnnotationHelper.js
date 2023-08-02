/*
 * The regex to detect html tags.
 * Please note that this regex will also detect non-html tags that are also wrapped in  `<>`.
 * For example, in the following sentence, <strong class="">cats <dogs> rabbit </strong>,
 * we will match <strong class="">, <dogs> and </strong>. This is an edge case though.
 * @type {RegExp}
 */
const htmlTagsRegex = /(<([a-z]|\/)[^<>]+>)/ig;

/**
 * Creates an annotation if the given mark is position based.
 * A helper for position-based highlighting.
 *
 * @param {string} blockClientId	The client id of the block.
 * @param {Mark}   mark				The mark to apply to the content.
 * @param {string} blockHtml		The HTML of the block: possibly contains html tags.
 * @param {string} richText			The rich text of the block: the text without html tags.
 *
 * @returns {Array} The annotations to apply.
 */
export function createAnnotationsFromPositionBasedMarks( blockClientId, mark, blockHtml, richText ) {
	// If the block client id is the same as the mark's block client id, it means that this mark object is intended for this block.
	if ( blockClientId === mark.getBlockClientId() ) {
		let blockStartOffset = mark.getBlockPositionStart();
		let blockEndOffset = mark.getBlockPositionEnd();

		// Get the html part from the block start offset of the mark until the block end offset of the mark.
		const slicedHtml = blockHtml.slice( blockStartOffset, blockEndOffset );
		// Get the rich text part from the block start offset of the mark until the block end offset of the mark.
		const slicedRichText = richText.slice( blockStartOffset, blockEndOffset );

		/*
		 * If the html and the rich text contain the same text in the specified index,
		 * don't adjust the block start and end offsets of the mark.
		 * If the html and the rich text do not contain the same text in the specified index,
		 * adjust the block start and end offsets of the mark.
		 */
		if ( slicedHtml === slicedRichText ) {
			return [
				{
					startOffset: blockStartOffset,
					endOffset: blockEndOffset,
				},
			];
		}

		// Retrieve the html from the start until the block startOffset of the mark.
		blockHtml = blockHtml.slice( 0, blockStartOffset );

		// Find all html tags.
		const foundHtmlTags = [ ...blockHtml.matchAll( htmlTagsRegex ) ];
		/*
		 * Loop through the found html tags backwards, and adjust the start and end offsets of the mark
		 * by subtracting them with the length of the found html tags.
		 *
		 * This step is necessary to account for the difference in the way we "parse" the block and calculate the token position
		 * between `yoastseo` package and block annotation API.
		 * Inside `yoastseo`, the token's position information also takes into account all the HTML tags surrounding it in a block.
		 * However, the block annotation API applies annotations to "clean" text/html without any HTML tags.
		 * As a result, the token position information we retrieve from `yoastseo` wouldn't match that of block annotation API.
		 */
		for ( let i = foundHtmlTags.length - 1; i >= 0; i-- ) {
			const [ foundTag ] = foundHtmlTags[ i ];

			blockStartOffset -= foundTag.length;
			blockEndOffset -= foundTag.length;
		}
		return [
			{
				startOffset: blockStartOffset,
				endOffset: blockEndOffset,
			},
		];
	}
	return [];
}
