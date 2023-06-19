import keyphraseCount from "../../../src/languageProcessing/researches/keywordCount";
import Paper from "../../../src/values/Paper.js";
import factory from "../../specHelpers/factory";
import Mark from "../../../src/values/Mark";
import wordsCountHelper from "../../../src/languageProcessing/languages/ja/helpers/wordsCharacterCount";
import matchWordsHelper from "../../../src/languageProcessing/languages/ja/helpers/matchTextWithWord";
import memoizedSentenceTokenizer from "../../../src/languageProcessing/helpers/sentence/memoizedSentenceTokenizer";
import japaneseMemoizedSentenceTokenizer from "../../../src/languageProcessing/languages/ja/helpers/memoizedSentenceTokenizer";
import buildTree from "../../specHelpers/parse/buildTree";

/**
 * Adds morphological forms to the mock researcher.
 *
 * @param {Array} keyphraseForms The morphological forms to be added to the researcher.
 *
 * @returns {Researcher} The mock researcher with added morphological forms.
 */
const buildMorphologyMockResearcher = function( keyphraseForms ) {
	return factory.buildMockResearcher( {
		morphology: {
			keyphraseForms: keyphraseForms,
		},
	}, true, false, false, { memoizedTokenizer: memoizedSentenceTokenizer } );
};

const testCases = [
	{
		description: "counts/marks a string of text with a keyword in it.",
		paper: new Paper( "<p>a string of text with the keyword in it</p>", { keyword: "keyword" } ),
		keyphraseForms: [ [ "keyword", "keywords" ] ],
		expectedCount: 1,
		expectedMarkings: [
			new Mark( { marked: "a string of text with the <yoastmark class='yoast-text-mark'>keyword</yoastmark> in it",
				original: "a string of text with the keyword in it",
				position: {
					startOffset: 29,
					endOffset: 36,
					startOffsetBlock: 26,
					endOffsetBlock: 33,
				},
			} ),
		],
		skip: false,
	},
	{
		description: "counts a string of text with no keyword in it.",
		paper: new Paper( "<p>a string of text</p>", { keyword: "" } ),
		keyphraseForms: [ [ "" ] ],
		expectedCount: 0,
		expectedMarkings: [],
		skip: false,
	},
	{
		description: "counts multiple occurrences of a keyphrase consisting of multiple words.",
		paper: new Paper( "<p>a string of text with the key word in it, with more key words.</p>", { keyword: "key word" } ),
		keyphraseForms: [ [ "key", "keys" ], [ "word", "words" ] ],
		expectedCount: 2,
		expectedMarkings: [
			new Mark( {
				marked: "a string of text with the <yoastmark class='yoast-text-mark'>key word</yoastmark> in it, " +
					"with more <yoastmark class='yoast-text-mark'>key words</yoastmark>.",
				original: "a string of text with the key word in it, with more key words.",
				position: {
					startOffset: 29,
					endOffset: 37,
					startOffsetBlock: 26,
					endOffsetBlock: 34,
				},
			} ),
			new Mark( {
				marked: "a string of text with the <yoastmark class='yoast-text-mark'>key word</yoastmark> in it, " +
					"with more <yoastmark class='yoast-text-mark'>key words</yoastmark>.",
				original: "a string of text with the key word in it, with more key words.",
				position: {
					startOffset: 55,
					endOffset: 64,
					startOffsetBlock: 52,
					endOffsetBlock: 61,
				},
			} ),
		],
		skip: false,
	},
	{
		description: "counts a string of text with German diacritics and eszett as the keyword",
		paper: new Paper( "<p>Waltz keepin auf mitz auf keepin äöüß weiner blitz deutsch spitzen.</p>", { keyword: "äöüß" } ),
		keyphraseForms: [ [ "äöüß" ] ],
		expectedCount: 1,
		expectedMarkings: [
			new Mark( {
				marked: "Waltz keepin auf mitz auf keepin <yoastmark class='yoast-text-mark'>äöüß</yoastmark> weiner blitz deutsch spitzen.",
				original: "Waltz keepin auf mitz auf keepin äöüß weiner blitz deutsch spitzen.",
				position: {
					startOffset: 36,
					endOffset: 40,
					startOffsetBlock: 33,
					endOffsetBlock: 37,
				},
			} ),
		],
		skip: false,
	},
	{
		description: "counts a string with multiple keyword morphological forms",
		paper: new Paper( "<p>A string of text with a keyword and multiple keywords in it.</p>", { keyword: "keyword" } ),
		keyphraseForms: [ [ "keyword", "keywords" ] ],
		expectedCount: 2,
		expectedMarkings: [
			new Mark( {
				marked: "A string of text with a <yoastmark class='yoast-text-mark'>keyword</yoastmark> " +
				"and multiple <yoastmark class='yoast-text-mark'>keywords</yoastmark> in it.",
				original: "A string of text with a keyword and multiple keywords in it.",
				position: {
					startOffset: 27,
					endOffset: 34,
					startOffsetBlock: 24,
					endOffsetBlock: 31,
				},
			} ),
			new Mark( {
				marked: "A string of text with a <yoastmark class='yoast-text-mark'>keyword</yoastmark> " +
					"and multiple <yoastmark class='yoast-text-mark'>keywords</yoastmark> in it.",
				original: "A string of text with a keyword and multiple keywords in it.",
				position: {
					startOffset: 48,
					endOffset: 56,
					startOffsetBlock: 45,
					endOffsetBlock: 53,
				},
			} ),
		],
		skip: false,
	},
	{
		description: "counts a string with a keyword with a '-' in it",
		paper: new Paper( "<p>A string with a key-word.</p>", { keyword: "key-word" } ),
		keyphraseForms: [ [ "key-word", "key-words" ] ],
		expectedCount: 1,
		expectedMarkings: [
			new Mark( {
				marked: "A string with a <yoastmark class='yoast-text-mark'>key-word</yoastmark>.",
				original: "A string with a key-word.",
				position: {
					startOffset: 19,
					endOffset: 27,
					startOffsetBlock: 16,
					endOffsetBlock: 24,
				},
			} ),
		],
		skip: false,
	},
	{
		description: "counts 'key word' in 'key-word'.",
		paper: new Paper( "<p>A string with a key-word.</p>", { keyword: "key word" } ),
		keyphraseForms: [ [ "key", "keys" ], [ "word", "words" ] ],
		expectedCount: 0,
		expectedMarkings: [],
		skip: false,
		// Note: this behavior might change in the future.
	},
	{
		description: "counts a string with a keyword with a '_' in it",
		paper: new Paper( "<p>A string with a key_word.</p>", { keyword: "key_word" } ),
		keyphraseForms: [ [ "key_word", "key_words" ] ],
		expectedCount: 1,
		expectedMarkings: [
			new Mark( {
				marked: "A string with a <yoastmark class='yoast-text-mark'>key_word</yoastmark>.",
				original: "A string with a key_word.",
				position: {
					startOffset: 19,
					endOffset: 27,
					startOffsetBlock: 16,
					endOffsetBlock: 24,
				},
			} ),
		],
		skip: false,
	},
	{
		description: "counts a string with with a 'ı' in the keyphrase",
		paper: new Paper( "<p>A string with 'kapaklı' as a keyword in it</p>", { keyword: "kapaklı" } ),
		keyphraseForms: [ [ "kapaklı" ] ],
		expectedCount: 1,
		expectedMarkings: [
			new Mark( {
				marked: "A string with '<yoastmark class='yoast-text-mark'>kapaklı</yoastmark>' as a keyword in it",
				original: "A string with 'kapaklı' as a keyword in it",
				position: {
					startOffset: 18,
					endOffset: 25,
					startOffsetBlock: 15,
					endOffsetBlock: 22,
				},
			} ),
		],
		skip: false,
	},
	{
		description: "counts a string with with '&' in the string and the keyword",
		paper: new Paper( "<p>A string with key&word in it</p>", { keyword: "key&word" } ),
		keyphraseForms: [ [ "key&word" ] ],
		expectedCount: 1,
		expectedMarkings: [
			new Mark( {
				marked: "A string with <yoastmark class='yoast-text-mark'>key&word</yoastmark> in it",
				original: "A string with key&word in it",
				position: {
					startOffset: 17,
					endOffset: 25,
					startOffsetBlock: 14,
					endOffsetBlock: 22,
				},
			} ),
		],
		skip: false,
	},
	{
		description: "does not count images as keywords.",
		paper: new Paper( "<p>A text with <img src='http://image.com/image.jpg' alt='image' /></p>", { keyword: "image" } ),
		keyphraseForms: [ [ "image", "images" ] ],
		expectedCount: 0,
		expectedMarkings: [],
		skip: false,
	},
	{
		description: "also matches same phrase with different capitalization.",
		paper: new Paper( "<p>A string with KeY worD.</p>", { keyword: "key word" } ),
		keyphraseForms: [ [ "key", "keys" ], [ "word", "words" ] ],
		expectedCount: 1,
		expectedMarkings: [
			new Mark( {
				marked: "A string with <yoastmark class='yoast-text-mark'>KeY worD</yoastmark>.",
				original: "A string with KeY worD.",
				position: {
					startOffset: 17,
					endOffset: 25,
					startOffsetBlock: 14,
					endOffsetBlock: 22,
				},
			} ),
		],
		skip: false,
	},
	{
		description: "should still match keyphrase occurrence with different types of apostrophe.",
		paper: new Paper( "<p>A string with quotes to match the key'word, even if the quotes differ.</p>", { keyword: "key'word" } ),
		keyphraseForms: [ [ "key'word", "key'words" ] ],
		expectedCount: 1,
		expectedMarkings: [
			new Mark( {
				marked: "A string with quotes to match the <yoastmark class='yoast-text-mark'>key'word</yoastmark>, even if the quotes differ.",
				original: "A string with quotes to match the key'word, even if the quotes differ.",
				position: {
					startOffset: 37,
					endOffset: 45,
					startOffsetBlock: 34,
					endOffsetBlock: 42,
				},
			} ),
		],
		skip: false,
	},
	{
		description: "can match dollar sign as in '$keyword'.",
		paper: new Paper( "<p>A string with a $keyword.</p>" ),
		keyphraseForms: [ [ "\\$keyword" ] ],
		expectedCount: 1,
		expectedMarkings: [
			new Mark( {
				marked: "A string with a <yoastmark class='yoast-text-mark'>$keyword</yoastmark>.",
				original: "A string with a $keyword.",
				position: {
					endOffset: 27,
					startOffset: 19,
					startOffsetBlock: 16,
					endOffsetBlock: 24,
				},
			} ),
		],
		skip: false,
	},
	{
		description: "doesn't count 'key-word' in 'key word'.",
		paper: new Paper( "<p>A string with a key word.</p>", { keyword: "key-word" } ),
		keyphraseForms: [ [ "key-word", "key-words" ] ],
		expectedCount: 0,
		expectedMarkings: [],
		skip: false,
	},
	{
		description: "doesn't count keyphrase instances inside elements we want to exclude from the analysis",
		paper: new Paper( "<p>There is no <code>keyword</code> in this sentence.</p>" ),
		keyphraseForms: [ [ "keyword", "keywords" ] ],
		expectedCount: 0,
		expectedMarkings: [],
		skip: false,
	},
	{
		description: "counts the keyphrase occurrence in the text with &nbsp;",
		paper: new Paper( "<p>a string with nbsp to match the key&nbsp;word.</p>", { keyword: "key word" } ),
		keyphraseForms: [ [ "key" ], [ "word" ] ],
		expectedCount: 1,
		expectedMarkings: [
			new Mark( {
				marked: "a string with nbsp to match the <yoastmark class='yoast-text-mark'>key word</yoastmark>.",
				original: "a string with nbsp to match the key word.",
				position: {
					startOffset: 35,
					endOffset: 43,
					startOffsetBlock: 32,
					endOffsetBlock: 40,
				},
			} ),
		],
		skip: false,
	},
	{
		description: "only counts full key phrases (when all keywords are in the sentence once, twice etc.) as matches.",
		paper: new Paper( "<p>A string with three keys (key and another key) and one word.</p>" ),
		keyphraseForms: [ [ "key", "keys" ], [ "word", "words" ] ],
		expectedCount: 1,
		expectedMarkings: [
			new Mark( {
				marked: "A string with three <yoastmark class='yoast-text-mark'>keys</yoastmark> (<yoastmark class='yoast-text-mark'>" +
					"key</yoastmark> and another <yoastmark class='yoast-text-mark'>key</yoastmark>) and one <yoastmark " +
					"class='yoast-text-mark'>word</yoastmark>.",
				original: "A string with three keys (key and another key) and one word.",
				position: {
					startOffset: 23,
					endOffset: 27,
					startOffsetBlock: 20,
					endOffsetBlock: 24,
				},
			} ),
			new Mark( {
				marked: "A string with three <yoastmark class='yoast-text-mark'>keys</yoastmark> (<yoastmark class='yoast-text-mark'>" +
					"key</yoastmark> and another <yoastmark class='yoast-text-mark'>key</yoastmark>) and one <yoastmark " +
					"class='yoast-text-mark'>word</yoastmark>.",
				original: "A string with three keys (key and another key) and one word.",
				position: {
					startOffset: 29,
					endOffset: 32,
					startOffsetBlock: 26,
					endOffsetBlock: 29,
				},
			} ),
			new Mark( {
				marked: "A string with three <yoastmark class='yoast-text-mark'>keys</yoastmark> (<yoastmark class='yoast-text-mark'>" +
					"key</yoastmark> and another <yoastmark class='yoast-text-mark'>key</yoastmark>) and one <yoastmark " +
					"class='yoast-text-mark'>word</yoastmark>.",
				original: "A string with three keys (key and another key) and one word.",
				position: {
					startOffset: 45,
					endOffset: 48,
					startOffsetBlock: 42,
					endOffsetBlock: 45,
				},
			} ),
			new Mark( {
				marked: "A string with three <yoastmark class='yoast-text-mark'>keys</yoastmark> (<yoastmark class='yoast-text-mark'>" +
					"key</yoastmark> and another <yoastmark class='yoast-text-mark'>key</yoastmark>) and one <yoastmark " +
					"class='yoast-text-mark'>word</yoastmark>.",
				original: "A string with three keys (key and another key) and one word.",
				position: {
					startOffset: 58,
					endOffset: 62,
					startOffsetBlock: 55,
					endOffsetBlock: 59,
				},
			} ),
		],
		skip: false,
	},
	{
		description: "matches both singular and reduplicated plural form of the keyword in Indonesian",
		paper: new Paper( "<p>Lorem ipsum dolor sit amet, consectetur keyword-keyword, keyword adipiscing elit.</p>",
			{ locale: "id_ID", keyword: "keyword" } ),
		keyphraseForms: [ [ "keyword", "keyword-keyword" ] ],
		expectedCount: 2,
		expectedMarkings: [
			new Mark( {
				// eslint-disable-next-line max-len
				marked: "Lorem ipsum dolor sit amet, consectetur <yoastmark class='yoast-text-mark'>keyword-keyword</yoastmark>, <yoastmark class='yoast-text-mark'>keyword</yoastmark> adipiscing elit.",
				original: "Lorem ipsum dolor sit amet, consectetur keyword-keyword, keyword adipiscing elit.",
				position: {
					endOffset: 58,
					startOffset: 43,
					startOffsetBlock: 40,
					endOffsetBlock: 55,
				},
			} ),
			new Mark( {
				// eslint-disable-next-line max-len
				marked: "Lorem ipsum dolor sit amet, consectetur <yoastmark class='yoast-text-mark'>keyword-keyword</yoastmark>, <yoastmark class='yoast-text-mark'>keyword</yoastmark> adipiscing elit.",
				original: "Lorem ipsum dolor sit amet, consectetur keyword-keyword, keyword adipiscing elit.",
				position: {
					startOffset: 60,
					endOffset: 67,
					startOffsetBlock: 57,
					endOffsetBlock: 64,
				},
			} ),
		],
		skip: false,
	},
	{
		description: "counts a single word keyphrase with exact matching",
		paper: new Paper( "<p>A string with a keyword.</p>", { keyword: "\"keyword\"" } ),
		keyphraseForms: [ [ "keyword" ] ],
		expectedCount: 1,
		expectedMarkings: [
			new Mark( { marked: "A string with a <yoastmark class='yoast-text-mark'>keyword</yoastmark>.",
				original: "A string with a keyword.",
				position: {
					startOffset: 19,
					endOffset: 26,
					startOffsetBlock: 16,
					endOffsetBlock: 23,
				},
			} ),
		],
		skip: false,
	},
	{
		description: "with exact matching, a singular single word keyphrase should not be counted if the focus keyphrase is plural",
		paper: new Paper( "<p>A string with a keyword.</p>", { keyword: "\"keywords\"" } ),
		keyphraseForms: [ [ "keywords" ] ],
		expectedCount: 0,
		expectedMarkings: [],
		skip: true,
	},
	{
		description: "with exact matching, a multi word keyphrase should be counted if the focus keyphrase is the same",
		paper: new Paper( "<p>A string with a key phrase.</p>", { keyword: "\"key phrase\"" } ),
		keyphraseForms: [ [ "key phrase" ] ],
		expectedCount: 1,
		expectedMarkings: [
			new Mark( { marked: "A string with a <yoastmark class='yoast-text-mark'>key phrase</yoastmark>.",
				original: "A string with a key phrase.",
				position: {
					startOffset: 29,
					endOffset: 36,
					startOffsetBlock: 26,
					endOffsetBlock: 33,
				},
			} ),
		],
		// Skipped for now, coz the PR for exact matching is not yet merged.
		skip: true,
	},
	{
		// eslint-disable-next-line max-len
		description: "with exact matching, a multi word keyphrase should not be counted if the focus keyphrase has the same words in a different order",
		paper: new Paper( "<p>A string with a phrase key.</p>", { keyword: "\"key phrase\"" } ),
		keyphraseForms: [ [ "key phrase" ] ],
		expectedCount: 0,
		expectedMarkings: [],
		skip: false,
	},
	{
		description: "with exact matching, it should match a full stop if it is part of the keyphrase and directly precedes the keyphrase.",
		paper: new Paper( "<p>A .sentence with a keyphrase.</p>", { keyword: "\".sentence\"" } ),
		keyphraseForms: [ [ ".sentence" ] ],
		expectedCount: 1,
		expectedMarkings: [
			new Mark( {
				marked: "A <yoastmark class='yoast-text-mark'>.sentence</yoastmark> with a keyphrase.",
				original: "A .sentence with a keyphrase.",
				position: {
					startOffset: 29,
					endOffset: 36,
					startOffsetBlock: 26,
					endOffsetBlock: 33,
				},
			} ),
		],
		// Skipped for now, coz the PR for exact matching is not yet merged.
		skip: true,
	},
	{
		description: "can match dollar sign as in '$keyword' with exact matching.",
		paper: new Paper( "<p>A string with a $keyword.</p>", { keyword: "\"\\$keyword\"" } ),
		keyphraseForms: [ [ "\\$keyword" ] ],
		expectedCount: 1,
		expectedMarkings: [
			new Mark( {
				marked: "A string with a <yoastmark class='yoast-text-mark'>$keyword</yoastmark>.",
				original: "A string with a $keyword.",
				position: {
					startOffset: 19,
					endOffset: 27,
					startOffsetBlock: 16,
					endOffsetBlock: 24,
				},
			} ),
		],
		// Skipped for now, coz the PR for exact matching is not yet merged.
		skip: true,
	},
	{
		description: "can match paragraph gutenberg block",
		paper: new Paper(
			`<!-- wp:paragraph -->
				<p>a string of text with the keyword in it</p>
			<!-- /wp:paragraph -->`,
			{
				keyword: "keyword",
				wpBlocks: [
					{
						attributes: {
							content: "a string of text with the keyword in it",
						},
						name: "core/paragraph",
						clientId: "5615ca1f-4052-41a9-97be-be19cfd2085b",
						innerBlocks: [],
					},
				],
			}
		),
		keyphraseForms: [ [ "keyword", "keywords" ] ],
		expectedCount: 1,
		expectedMarkings: [
			new Mark( {
				marked: "a string of text with the <yoastmark class='yoast-text-mark'>keyword</yoastmark> in it",
				original: "a string of text with the keyword in it",
				position: {
					startOffset: 55,
					endOffset: 62,
					startOffsetBlock: 26,
					endOffsetBlock: 33,
				},
			} ),
		],
		skip: false,
	},
	{
		description: "can match complex paragraph gutenberg block",
		paper: new Paper(
			`<!-- wp:paragraph -->
				<p><strong>Over the years, we’ve written&nbsp;quite a few articles about&nbsp;</strong>
				<a href="https://yoast.com/tag/branding/">branding</a><strong>.
				Branding is about getting people to relate to your company and
				products. It’s also about trying to make your brand synonymous with a certain product or service.
				This can be a lengthy and hard project. It can potentially cost you all of your revenue.
				It’s no wonder that branding is often associated with investing lots of money in marketing and promotion.
				However, for a lot of small business owners, the investment in branding will have
				to&nbsp;be made with a&nbsp;relatively small budget.&nbsp;</strong></p>
			<!-- /wp:paragraph -->`,
			{
				keyword: "keyword",
				wpBlocks: [
					{
						attributes: {
							// eslint-disable-next-line max-len
							content: "<strong>Over the years, we’ve written&nbsp;quite a few articles about&nbsp;</strong><a href=\"https://yoast.com/tag/branding/\">branding</a><strong>. Branding is about getting people to relate to your company and products. It’s also about trying to make your brand synonymous with a certain product or service. This can be a lengthy and hard project. It can potentially cost you all of your revenue. It’s no wonder that branding is often associated with investing lots of money in marketing and promotion. However, for a lot of small business owners, the investment in branding will have to&nbsp;be made with a&nbsp;relatively small budget.&nbsp;</strong>",
						},
						name: "core/paragraph",
						clientId: "6860403c-0b36-43b2-96fa-2d30c10cb44c",
						innerBlocks: [],
					},
				],
			}
		),
		keyphraseForms: [ [ "synonymous" ] ],
		expectedCount: 1,
		expectedMarkings: [

			new Mark( {
				// eslint-disable-next-line max-len
				marked: " It’s also about trying to make your brand <yoastmark class='yoast-text-mark'>synonymous</yoastmark> with a certain product or service.",
				original: " It’s also about trying to make your brand synonymous with a certain product or service.",
				position: {
					startOffset: 295,
					endOffset: 305,
					startOffsetBlock: 266,
					endOffsetBlock: 276,
				},
			} ),
		],
		skip: false,
	},
	{
		description: "can match complex paragraph gutenberg block",
		paper: new Paper(
			`<!-- wp:paragraph -->
				<p>You might be a local bakery with 10 employees, or a local industrial company employing up to 500 people.
				These all can be qualified as
				‘small business’. All have the same main goal when they start: the need to establish a name in their field of expertise. There
				are multiple ways to do this, without a huge budget.
				In this post, I’ll share my thoughts on how to go about your own low-budget branding.</p>
			<!-- /wp:paragraph -->`,
			{
				keyword: "expertise",
				wpBlocks: [
					{
						attributes: {
							// eslint-disable-next-line max-len
							content: "You might be a local bakery with 10 employees, or a local industrial company employing up to 500 people. These all can be qualified as ‘small business’. All have the same main goal when they start: the need to establish a name in their field of expertise. There are multiple ways to do this, without a huge budget. In this post, I’ll share my thoughts on how to go about your own low-budget branding.",
						},
						name: "core/paragraph",
						clientId: "65be5146-3395-4845-8c7c-4a79fd6e3611",
						innerBlocks: [],
					},
				],
			}
		),
		keyphraseForms: [ [ "expertise" ] ],
		expectedCount: 1,
		expectedMarkings: [

			new Mark( {
				// eslint-disable-next-line max-len
				marked: " All have the same main goal when they start: the need to establish a name in their field of <yoastmark class='yoast-text-mark'>expertise</yoastmark>.",
				original: " All have the same main goal when they start: the need to establish a name in their field of expertise.",
				position: {
					startOffset: 282,
					endOffset: 291,
					startOffsetBlock: 253,
					endOffsetBlock: 262,
				},
			} ),
		],
		skip: false,
	},
	{
		description: "can match heading gutenberg block",
		paper: new Paper(
			`<!-- wp:heading -->
				<h2 class="wp-block-heading" id="h-define-and-communicate-brand-values">Define and communicate brand values</h2>
			<!-- /wp:heading -->`,
			{
				keyword: "communicate",
				wpBlocks: [
					{
						attributes: {
							level: 2,
							content: "Define and communicate brand values",
						},
						name: "core/heading",
						clientId: "b8e62d35-b3af-45ec-9889-139ef0a9baaa",
						innerBlocks: [],
					},
				],
			}
		),
		keyphraseForms: [ [ "communicate" ] ],
		expectedCount: 1,
		expectedMarkings: [
			// eslint-disable-next-line max-len
			new Mark( {
				marked: "Define and <yoastmark class='yoast-text-mark'>communicate</yoastmark> brand values",
				original: "Define and communicate brand values",
				position: {
					startOffset: 107,
					endOffset: 118,
					startOffsetBlock: 11,
					endOffsetBlock: 22,
				},
			} ),
		],
		skip: false,
	},
	{
		description: "can match complex paragraph gutenberg block",
		paper: new Paper(
			`<!-- wp:columns -->
				<div class="wp-block-columns"><!-- wp:column -->
				<div class="wp-block-column"><!-- wp:paragraph -->
				<p><strong>Lorem Ipsum</strong>&nbsp;is simply dummy text of the printing and typesetting industry.</p>
				<!-- /wp:paragraph --></div>
				<!-- /wp:column -->

				<!-- wp:column -->
				<div class="wp-block-column"><!-- wp:paragraph -->
				<p>There are many variations of passages of Lorem Ipsum available</p>
				<!-- /wp:paragraph --></div>
				<!-- /wp:column --></div>
			 <!-- /wp:columns -->`,
			{
				keyword: "Ipsum",
				wpBlocks: [
					{
						attributes: {},
						name: "core/columns",
						clientId: "1b9f1d49-813e-4578-a19a-bf236447cc41",
						innerBlocks: [
							{
								attributes: {},
								name: "core/column",
								clientId: "09b93261-25ef-4391-98cc-630e8fa1eac1",
								innerBlocks: [
									{
										attributes: {
											// eslint-disable-next-line max-len
											content: "<strong>Lorem Ipsum</strong>&nbsp;is simply dummy text of the printing and typesetting industry.",
										},
										name: "core/paragraph",
										clientId: "3f0e68c1-287e-40ef-90c8-54b3ab61702a",
										innerBlocks: [],
									},
								],
							},
							{
								attributes: {},
								name: "core/column",
								clientId: "0f247feb-5ada-433d-bc97-1faa0265f7c4",
								innerBlocks: [
									{
										attributes: {
											content: "There are many variations of passages of Lorem Ipsum available",
										},
										name: "core/paragraph",
										clientId: "5093342c-ec93-48a2-b2d5-883ae514b12d",
										innerBlocks: [],
									},
								],
							},
						],
					},
				],
			}
		),
		keyphraseForms: [ [ "Ipsum" ] ],
		expectedCount: 2,
		expectedMarkings: [
			new Mark( {
				marked: "Lorem <yoastmark class='yoast-text-mark'>Ipsum</yoastmark> is simply dummy text of the printing and typesetting industry.",
				original: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
				position: {
					startOffset: 149,
					endOffset: 154,
					startOffsetBlock: 14,
					endOffsetBlock: 19,
				},
			} ),
			new Mark( {
				marked: "There are many variations of passages of Lorem <yoastmark class='yoast-text-mark'>Ipsum</yoastmark> available",
				original: "There are many variations of passages of Lorem Ipsum available",
				position: {
					startOffset: 426,
					endOffset: 431,
					startOffsetBlock: 47,
					endOffsetBlock: 52,
				},
			} ),
		],
		// Skipped for now, coz the PR for exact matching is not yet merged.
		skip: false,
	},
];

// eslint-disable-next-line max-len
describe.each( testCases )( "Test for counting the keyword in a text in english", function( { description, paper, keyphraseForms, expectedCount, expectedMarkings, skip } ) {
	const test = skip ? it.skip : it;

	test( description, function() {
		const mockResearcher = buildMorphologyMockResearcher( keyphraseForms );
		buildTree( paper, mockResearcher );
		const keyWordCountResult = keyphraseCount( paper, mockResearcher );
		expect( keyWordCountResult.count ).toBe( expectedCount );
		expect( keyWordCountResult.markings ).toEqual( expectedMarkings );
	} );
} );

// eslint-disable-next-line max-len
describe( "Test position based highlighting", () => {
	it( "test", function() {
		const expectedMarkings = [
			// eslint-disable-next-line max-len
			new Mark( { marked: " It’s also about trying to make your brand <yoastmark class='yoast-text-mark'>synonymous</yoastmark> with a certain product or service.",
				original: " It’s also about trying to make your brand synonymous with a certain product or service.",
				position: {
					startOffset: 295,
					endOffset: 305,
					startOffsetBlock: 266,
					endOffsetBlock: 276,
				},
			} ),
		];

		const keyphraseForms  = [ [ "synonymous" ] ];

		const mockPaper = new Paper(
			`<!-- wp:paragraph -->
				<p><strong>Over the years, we’ve written&nbsp;quite a few articles about&nbsp;</strong>
				<a href="https://yoast.com/tag/branding/">branding</a><strong>.
				Branding is about getting people to relate to your company and
				products. It’s also about trying to make your brand synonymous with a certain product or service.
				This can be a lengthy and hard project. It can potentially cost you all of your revenue.
				It’s no wonder that branding is often associated with investing lots of money in marketing and promotion.
				However, for a lot of small business owners, the investment in branding will have
				to&nbsp;be made with a&nbsp;relatively small budget.&nbsp;</strong></p>
			<!-- /wp:paragraph -->`,
			{
				keyword: "keyword",
				wpBlocks: [
					{
						attributes: {
							// eslint-disable-next-line max-len
							content: "<strong>Over the years, we’ve written&nbsp;quite a few articles about&nbsp;</strong><a href=\"https://yoast.com/tag/branding/\">branding</a><strong>. Branding is about getting people to relate to your company and products. It’s also about trying to make your brand synonymous with a certain product or service. This can be a lengthy and hard project. It can potentially cost you all of your revenue. It’s no wonder that branding is often associated with investing lots of money in marketing and promotion. However, for a lot of small business owners, the investment in branding will have to&nbsp;be made with a&nbsp;relatively small budget.&nbsp;</strong>",
						},
						name: "core/paragraph",
						clientId: "6860403c-0b36-43b2-96fa-2d30c10cb44c",
						innerBlocks: [],
					},
				],
			}
		);

		const mockResearcher = buildMorphologyMockResearcher( keyphraseForms );

		buildTree( mockPaper, mockResearcher );
		const keyWordCountResult = keyphraseCount( mockPaper, mockResearcher );
		expect( keyWordCountResult.count ).toBe( 1 );
		expect( keyWordCountResult.markings ).toEqual( expectedMarkings );
	} );
} );

/**
 * Mocks Japanese Researcher.
 * @param {Array} keyphraseForms    The morphological forms to be added to the researcher.
 * @param {function} helper1        A helper needed for the assesment.
 * @param {function} helper2        A helper needed for the assesment.
 *
 * @returns {Researcher} The mock researcher with added morphological forms and custom helper.
 */
const buildJapaneseMockResearcher = function( keyphraseForms, helper1, helper2 ) {
	return factory.buildMockResearcher( {
		morphology: {
			keyphraseForms: keyphraseForms,
		},
	},
	true,
	true,
	false,
	{
		wordsCharacterCount: helper1,
		matchWordCustomHelper: helper2,
		memoizedTokenizer: japaneseMemoizedSentenceTokenizer,
	} );
};


// Decided not to remove test below as it tests the added logic of the Japanese helpers.
describe( "Test for counting the keyword in a text for Japanese", () => {
	it.skip( "counts/marks a string of text with a keyword in it.", function() {
		const mockPaper = new Paper( "<p>私の猫はかわいいです。</p?", { locale: "ja", keyphrase: "猫" } );
		const researcher = buildJapaneseMockResearcher( [ [ "猫" ] ], wordsCountHelper, matchWordsHelper );
		buildTree( mockPaper, researcher );

		expect( keyphraseCount( mockPaper, researcher ).count ).toBe( 1 );
		expect( keyphraseCount( mockPaper, researcher ).markings ).toEqual( [
			new Mark( { marked: "私の<yoastmark class='yoast-text-mark'>猫</yoastmark>はかわいいです。",
				original: "私の猫はかわいいです。", position: { endOffset: 6, startOffset: 5 } } ) ] );
	} );

	it.skip( "counts/marks a string of text with multiple occurences of the same keyword in it.", function() {
		const mockPaper = new Paper( "<p>私の猫はかわいい猫です。</p?", { locale: "ja", keyphrase: "猫" } );
		const researcher = buildJapaneseMockResearcher( [ [ "猫" ] ], wordsCountHelper, matchWordsHelper );
		buildTree( mockPaper, researcher );

		expect( keyphraseCount( mockPaper, researcher ).count ).toBe( 2 );
		expect( keyphraseCount( mockPaper, researcher ).markings ).toEqual( [
			new Mark( { marked: "私の<yoastmark class='yoast-text-mark'>猫</yoastmark>はかわいい<yoastmark class='yoast-text-mark'>猫</yoastmark>です。",
				original: "私の猫はかわいい猫です。",
				position: { endOffset: 6, startOffset: 5 } } ), new Mark( { marked: "私の<yoastmark class='yoast-text-mark'>猫</yoastmark>はかわいい" +
					"<yoastmark class='yoast-text-mark'>猫</yoastmark>です。",
			original: "私の猫はかわいい猫です。",
			position: { endOffset: 12, startOffset: 11 } } ) ] );
	} );

	it.skip( "counts a string of text with no keyword in it.", function() {
		const mockPaper = new Paper( "私の猫はかわいいです。",  { locale: "ja" } );
		const researcher = buildJapaneseMockResearcher( [ [ "猫" ], [ "会い" ] ], wordsCountHelper, matchWordsHelper );
		buildTree( mockPaper, researcher );
		expect( keyphraseCount( mockPaper, researcher ).count ).toBe( 0 );
		expect( keyphraseCount( mockPaper, researcher ).markings ).toEqual( [] );
	} );

	it.skip( "counts multiple occurrences of a keyphrase consisting of multiple words.", function() {
		const mockPaper = new Paper( "<p>私の猫はかわいいですかわいい。</p>",  { locale: "ja" } );
		const researcher = buildJapaneseMockResearcher( [ [ "猫" ], [ "かわいい" ] ], wordsCountHelper, matchWordsHelper );
		buildTree( mockPaper, researcher );
		expect( keyphraseCount( mockPaper, researcher ).count ).toBe( 1 );
		expect( keyphraseCount( mockPaper, researcher ).markings ).toEqual( [
			new Mark( {
				marked: "私の<yoastmark class='yoast-text-mark'>猫</yoastmark>は<yoastmark class='yoast-text-mark'>かわいい</yoastmark>" +
					"です<yoastmark class='yoast-text-mark'>かわいい</yoastmark>。",
				original: "私の猫はかわいいですかわいい。",
				position: { endOffset: 6, startOffset: 5 },
			} ),
			new Mark( {
				marked: "私の<yoastmark class='yoast-text-mark'>猫</yoastmark>は<yoastmark class='yoast-text-mark'>かわいい</yoastmark>" +
					"です<yoastmark class='yoast-text-mark'>かわいい</yoastmark>。",
				original: "私の猫はかわいいですかわいい。",
				position: { endOffset: 11, startOffset: 7 },
			} ),
			new Mark( {
				marked: "私の<yoastmark class='yoast-text-mark'>猫</yoastmark>は<yoastmark class='yoast-text-mark'>かわいい</yoastmark>" +
					"です<yoastmark class='yoast-text-mark'>かわいい</yoastmark>。",
				original: "私の猫はかわいいですかわいい。",
				position: { endOffset: 17, startOffset: 13 },
			} ),
		] );
	} );
} );
