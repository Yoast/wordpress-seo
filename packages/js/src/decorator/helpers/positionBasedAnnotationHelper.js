import { forEachRight } from "lodash";
import { helpers } from "yoastseo";

/**
 * Regex to detect HTML tags.
 * Please note that this regex will also detect non-HTML tags that are also wrapped in `<>`.
 * For example, in the following sentence, `<strong class="">cats <dogs> rabbit </strong>`,
 * we will match `<strong class="">`, `<dogs>` and `</strong>`. This is an edge case though.
 * @type {RegExp}
 */
const htmlTagsRegex = /(<([a-z]|\/)[^<>]+>)/ig;

/**
 * Regex to detect HTML entities.
 * @type {RegExp}
 */
const { htmlEntitiesRegex } = helpers.htmlEntities;

/**
 * Adjusts the block start and end offset for a given Mark from the first section of a Yoast sub-block.
 *
 * For the first section Marks, we need to adjust the block start and end offset.
 *
 * This is because the first section of a Yoast block is always wrapped in `<strong>` tags.
 * In `yoastseo`, when calculating the position information of the matched token, we also take
 * into account the length of `<strong>` tags.
 * However, here, the HTML for the first section doesn't include the `<strong>` tags.
 * As a result, the position information of the matched token will be incorrect.
 * Hence, the block start and end offset of the Mark will be subtracted by the length
 * of the opening of the `<strong>` tag.
 *
 * @param {number}	blockStartOffset	The block start offset of the Mark to adjust.
 * @param {number}	blockEndOffset		The block end offset of the Mark to adjust.
 * @param {string}	blockName			The block name.
 *
 * @returns {{blockStartOffset: number, blockEndOffset: number}} The adjusted start offset and end offset of the Mark.
 */
const adjustFirstSectionOffsets = ( blockStartOffset, blockEndOffset, blockName ) => {
	/*
	 * Get the opening HTML tag for the first section of a Yoast sub-block.
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

	return { blockStartOffset, blockEndOffset };
};

/**
 * Retrieves the length for HTML tags, adjusts the length for `<br>` tags.
 * @param {[Object]} htmlTags Array of HTML tags.
 * @returns {number} The length of the given HTML tags.
 */
const getTagsLength = ( htmlTags ) => {
	let tagsLength = 0;
	forEachRight( htmlTags, ( htmlTag ) => {
		const [ tag ] = htmlTag;
		let tagLength = tag.length;
		// Here, we need to account for treating <br> tags as sentence delimiters, and subtract 1 from the tagLength.
		if ( /^<\/?br/.test( tag ) ) {
			tagLength -= 1;
		}

		tagsLength += tagLength;
	} );

	return tagsLength;
};

/**
 * Adjusts the block start and end offsets of a given Mark when the block HTML contains HTML tags.
 *
 * @param {string}	slicedBlockHtmlToStartOffset	The block HTML from the 0 index to the index of the block start offset.
 * @param {string}	slicedBlockHtmlToEndOffset		The block HTML from the 0 index to the index of the block end offset.
 * @param {number}	blockStartOffset				The block start offset of the Mark to adjust.
 * @param {number}	blockEndOffset					The block end offset of the Mark to adjust.
 * @returns {{blockStartOffset: number, blockEndOffset: number}} The adjusted start offset and end offset of the Mark.
 */
const adjustOffsetsForHtmlTags = ( slicedBlockHtmlToStartOffset, slicedBlockHtmlToEndOffset, blockStartOffset, blockEndOffset ) => {
	/*
	 * Loop through the found HTML tags backwards, and adjust the start and end offsets of the Mark
	 * by subtracting them with the length of the found HTML tags.
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
	const foundHtmlTagsToStartOffset = [ ...slicedBlockHtmlToStartOffset.matchAll( htmlTagsRegex ) ];
	blockStartOffset -= getTagsLength( foundHtmlTagsToStartOffset );

	const foundHtmlTagsToEndOffset = [ ...slicedBlockHtmlToEndOffset.matchAll( htmlTagsRegex ) ];
	blockEndOffset -= getTagsLength( foundHtmlTagsToEndOffset );

	return { blockStartOffset, blockEndOffset };
};

/**
 * Adjusts the block start and end offsets of a given Mark when the block HTML contains HTML entities.
 *
 * @param {string}	slicedBlockHtmlToStartOffset	The block HTML from the 0 index to the index of the block start offset.
 * @param {string}	slicedBlockHtmlToEndOffset		The block HTML from the 0 index to the index of the block end offset.
 * @param {number}	blockStartOffset				The block start offset of the Mark to adjust.
 * @param {number}	blockEndOffset					The block end offset of the Mark to adjust.
 * @returns {{blockStartOffset: number, blockEndOffset: number}} The adjusted start offset and end offset of the Mark.
 */
const adjustOffsetsForHtmlEntities = ( slicedBlockHtmlToStartOffset, slicedBlockHtmlToEndOffset, blockStartOffset, blockEndOffset ) => {
	/*
	 * In `yoastseo`, we process the HTML entities so that their length is the length of their extended version.
	 * For example, the ampersand `&` length is the length of `&amp;` => 5.
	 * However, in Gutenberg editor where we annotate the rich text, the ampersand is represented as `&`.
	 * Hence, to say that its length is 5 is incorrect and will result in an incorrect annotation.
	 * With this reason, we also need to adjust the Mark block start and end offset when the block's HTML contains HTML entities.
	 *
	 * Note: the comment below also applies to `adjustOffsetsForHtmlTags` function above.
	 *
	 * Additionally, it's important to have a separate step for adjusting the start and end offset.
	 * This is because in the offsets range of the Mark, it's still possible that an HTML entity (or multiple) or an HTML tag is present.
	 * This means that we also need to subtract the end offset by the length of the HTML entities/tags found in the Mark's offsets range.
	 *
	 * For example, we want to highlight the word "Bear™" of this HTML "The great <em><strong>Panda &amp; Bear</strong></em>&trade;"
	 * The Mark's offsets from `yoastseo` are { blockStartOffset: 34, blockEndOffset: 53 }
	 * However, since in Gutenberg we apply the annotation to the rich text "The great Panda & Bear™",
	 * we need to adjust the offsets above to { blockStartOffset: 18, blockEndOffset: 23 }.
	 * Only subtracting the end offset by the length of the HTML entities/tags found between the 0 index of the HTML
	 * to the start offset of the Mark will result in incorrect position information.
	 */
	let matchedHtmlEntities = [ ...slicedBlockHtmlToStartOffset.matchAll( htmlEntitiesRegex ) ];
	forEachRight( matchedHtmlEntities, ( matchedEntity ) => {
		/*
		 * If the matchedEntity is `&amp;`, matchedEntityWithoutAmp (the second element in the array) is `amp;`.
		 * To get the length of the HTML entity to be 1, we subtract the offset by the length of the matched entity minus the ampersand.
		 */
		const [ , matchedEntityWithoutAmp ] = matchedEntity;
		blockStartOffset -= matchedEntityWithoutAmp.length;
	} );

	matchedHtmlEntities = [ ...slicedBlockHtmlToEndOffset.matchAll( htmlEntitiesRegex ) ];
	forEachRight( matchedHtmlEntities, ( matchedEntity ) => {
		const [ , matchedEntityWithoutAmp ] = matchedEntity;
		blockEndOffset -= matchedEntityWithoutAmp.length;
	} );

	return { blockStartOffset, blockEndOffset };
};

/**
 * Adjusts the block start and end offsets of a given Mark when the block HTML contains HTML tags or entities.
 *
 * @param {number}	blockStartOffset	The block start offset of the Mark to adjust.
 * @param {number}	blockEndOffset		The block end offset of the Mark to adjust.
 * @param {string}	blockHtml			The HTML of the block.
 * @returns {{blockStartOffset: number, blockEndOffset: number}} The adjusted start offset and end offset of the Mark.
 */
const adjustMarkOffsets = ( blockStartOffset, blockEndOffset, blockHtml ) => {
	const slicedBlockHtmlToStartOffset = blockHtml.slice( 0, blockStartOffset );
	const slicedBlockHtmlToEndOffset = blockHtml.slice( 0, blockEndOffset );

	// Adjust the offsets when there are HTML tags found between the start of the HTML and the start/end offset of the Mark.
	const adjustedOffsetsInCaseOfHtmlTags = adjustOffsetsForHtmlTags(
		slicedBlockHtmlToStartOffset,
		slicedBlockHtmlToEndOffset,
		blockStartOffset,
		blockEndOffset
	);
	blockStartOffset = adjustedOffsetsInCaseOfHtmlTags.blockStartOffset;
	blockEndOffset = adjustedOffsetsInCaseOfHtmlTags.blockEndOffset;

	// Adjust the offsets when there are HTML entities found between the start of the HTML and the start/end offset of the Mark.
	const adjustedOffsetsInCaseOfHtmlEntities = adjustOffsetsForHtmlEntities(
		slicedBlockHtmlToStartOffset,
		slicedBlockHtmlToEndOffset,
		blockStartOffset,
		blockEndOffset
	);
	blockStartOffset = adjustedOffsetsInCaseOfHtmlEntities.blockStartOffset;
	blockEndOffset = adjustedOffsetsInCaseOfHtmlEntities.blockEndOffset;

	return { blockStartOffset, blockEndOffset };
};


/**
 * Creates an annotation range if the given Mark has position information.
 * A helper for position-based highlighting.
 *
 * @param {Mark}   mark				The Mark to apply to the content.
 * @param {string} blockClientId	The client id of the block.
 * @param {string} blockName		The name of the block.
 * @param {string} blockHtml		The HTML of the block: possibly contains HTML tags.
 * @param {string} richText			The rich text of the block: the text without HTML tags.
 *
 * @returns {[{startOffset: number, endOffset: number}]} The array of annotation range object.
 */
export function createAnnotationsFromPositionBasedMarks( mark, blockClientId, blockName, blockHtml, richText ) {
	// If the block client id is the same as the Mark's block client id, it means that this Mark is intended for this block.
	if ( blockClientId === mark.getBlockClientId() ) {
		let blockStartOffset = mark.getBlockPositionStart();
		let blockEndOffset = mark.getBlockPositionEnd();

		// If the Mark is created for the first section of a Yoast sub-block, we need to adjust the block start and end offsets of the Mark.
		if ( mark.isMarkForFirstBlockSection() ) {
			const adjustedFirstSectionOffsets = adjustFirstSectionOffsets( blockStartOffset, blockEndOffset, blockName );
			blockStartOffset = adjustedFirstSectionOffsets.blockStartOffset;
			blockEndOffset = adjustedFirstSectionOffsets.blockEndOffset;
		}

		// Get the HTML part from the block start offset of the Mark until the block end offset of the Mark.
		const slicedHtml = blockHtml.slice( blockStartOffset, blockEndOffset );
		// Get the rich text part from the block start offset of the Mark until the block end offset of the Mark.
		const slicedRichText = richText.slice( blockStartOffset, blockEndOffset );

		// If the HTML and the rich text are equal, return the current offsets.
		if ( slicedHtml === slicedRichText ) {
			return [
				{
					startOffset: blockStartOffset,
					endOffset: blockEndOffset,
				},
			];
		}

		// If not, adjust the offsets further by checking for HTML tags or entities.
		const adjustedMarkOffsets = adjustMarkOffsets( blockStartOffset, blockEndOffset, blockHtml );
		return [
			{
				startOffset: adjustedMarkOffsets.blockStartOffset,
				endOffset: adjustedMarkOffsets.blockEndOffset,
			},
		];
	}
	return [];
}
