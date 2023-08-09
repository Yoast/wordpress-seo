/*
 * The regex to detect html tags.
 * Please note that this regex will also detect non-html tags that are also wrapped in  `<>`.
 * For example, in the following sentence, <strong class="">cats <dogs> rabbit </strong>,
 * we will match <strong class="">, <dogs> and </strong>. This is an edge case though.
 * @type {RegExp}
 */
const htmlTagsRegex = /(<([a-z]|\/)[^<>]+>)/ig;

/**
 * Adjusts the block start and end offset for a given mark from the first section of a Yoast sub-block.
 *
 * For the first section marks, we need to adjust the block start and end offset.
 *
 * This is because the first section of a Yoast block is always wrapped in `<strong>` tags.
 * In `yoastseo`, when calculating the position information of the matched token, we also take
 * into account the length of `<strong>` tags.
 * However, here, the html for the first section doesn't include the `<strong>` tags.
 * As a result, the position information of the matched token will be incorrect.
 * Hence, the block start and end offset of the mark object will be subtracted by the length
 * of the opening of the `<strong>` tag.
 *
 *
 * @param {int}		blockStartOffset	The block start offset of the Mark object to adjust.
 * @param {int}		blockEndOffset		The block end offset of the Mark object to adjust.
 * @param {String}	blockName			The block name.
 *
 * @returns {{blockStartOffset: int, blockEndOffset: int}} The adjusted start offset and end offset of the Mark object.
 */
const adjustFirsSectionOffsets = ( blockStartOffset, blockEndOffset, blockName ) => {
	/*
	 * Get the opening html tag for the first section of a Yoast sub-block.
	 *
	 * The Yoast sub-block's first section is always wrapped in `<strong>` tag with the following class name:
	 * - For Yoast FAQ block, the class name is "schema-faq-question",
	 * - For Yoast How-To block, the class name is "schema-how-to-step-name",
	 */
	const firstSectionOpenTag = blockName === "yoast/faq-block"
		? "<strong class=\"schema-faq-question\">"
		: "<strong class=\"schema-how-to-step-name\">";

	blockStartOffset = blockStartOffset - firstSectionOpenTag.length;
	blockEndOffset = blockEndOffset - firstSectionOpenTag.length;

	return {
		blockStartOffset,
		blockEndOffset,
	};
};

/**
 * Adjusts the block start and end offsets of a given mark when the block html contains tags.
 *
 * @param {int}		blockStartOffset	The block start offset of the Mark object to adjust.
 * @param {int}		blockEndOffset		The block end offset of the Mark object to adjust.
 * @param {string}	blockHtml			The html of the block.
 *
 * @returns {[{endOffset, startOffset}]} The array of adjusted block start and end offsets of a given mark.
 */
const adjustMarkOffsets = ( blockStartOffset, blockEndOffset, blockHtml ) => {
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
	 * Example:
	 * From `yoastseo`:
	 * - Text: This is a giant <strong>panda</strong>.
	 * - Range of "panda": 24 - 29
	 * In the block:
	 * - Text: This is a giant panda.
	 * - Range of "panda": 16 -21
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
};

/**
 * Creates an annotation range if the given mark has position information.
 * A helper for position-based highlighting.
 *
 * @param {Mark}   mark				The mark to apply to the content.
 * @param {string} blockClientId	The client id of the block.
 * @param {string} blockName		The name of the block.
 * @param {string} blockHtml		The HTML of the block: possibly contains html tags.
 * @param {string} richText			The rich text of the block: the text without html tags.
 *
 * @returns {Array} The array of annotation range object.
 */
export function createAnnotationsFromPositionBasedMarks( mark, blockClientId, blockName, blockHtml, richText ) {
	// If the block client id is the same as the mark's block client id, it means that this mark object is intended for this block.
	if ( blockClientId === mark.getBlockClientId() ) {
		let blockStartOffset = mark.getBlockPositionStart();
		let blockEndOffset = mark.getBlockPositionEnd();

		// If the mark is created for the first section of a Yoast sub-block, we need to adjust the block start and end offsets of the mark.
		if ( mark.isMarkForFirstBlockSection() ) {
			const adjustedFirstSectionOffsets = adjustFirsSectionOffsets( blockStartOffset, blockEndOffset, blockName );
			blockStartOffset = adjustedFirstSectionOffsets.blockStartOffset;
			blockEndOffset = adjustedFirstSectionOffsets.blockEndOffset;
		}

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
		return adjustMarkOffsets( blockStartOffset, blockEndOffset, blockHtml );
	}
	return [];
}
