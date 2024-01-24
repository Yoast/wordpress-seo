import {
	hasInnerBlocks,
	getAnnotationsForBlocks,
} from "../../src/decorator/gutenberg";

jest.mock( "@wordpress/rich-text", () => ( {
	create: jest.fn(),
} ) );

import { create } from "@wordpress/rich-text";

import { select } from "@wordpress/data";
import { Mark } from "yoastseo/src/values";

jest.mock( "@wordpress/data" );

/**
 * Mocks a Mark object.
 *
 * @param {string} original The sentence without yoastmark tags.
 * @param {string} marked   The sentence with yoastmark tags.
 *
 * @returns {Object} Mark mock.
 */
function mockMark( original, marked ) {
	return {
		getOriginal: () => original,
		getMarked: () => marked,
	};
}

describe( "a test for retrieving annotations for blocks", () => {
	describe( "a test for retrieving annotations for list block (a block with inner blocks)", () => {
		let mockBlocks, resultWithAnnotation;
		beforeEach( () => {
			create.mockReturnValue( { text: "Red panda" } ).mockReturnValueOnce( { text: "Giant panda" } );

			select.mockReturnValue( {
				getActiveMarker: jest.fn( () => "keyphraseDensity" ),
			} );
			mockBlocks = [ {
				clientId: "6d170ddc-dcd3-4fa2-b501-733e247be777",
				name: "core/list",
				isValid: true,
				originalContent: "<ul>\n\n</ul>",
				validationIssues: [],
				attributes: {
					ordered: false,
					values: "",
				},
				innerBlocks: [
					{
						clientId: "d126c9dc-c496-49c1-89db-1bdfbc9ef8ed",
						name: "core/list-item",
						isValid: true,
						originalContent: "<li>Giant&nbsp;panda</li>",
						validationIssues: [],
						attributes: {
							content: "Giant&nbsp;panda",
						},
						innerBlocks: [],
					},
					{
						clientId: "160b1d63-7705-4c46-b86e-d66f20808d77",
						name: "core/list-item",
						isValid: true,
						originalContent: "<li>Red panda</li>",
						validationIssues: [],
						attributes: {
							content: "Red panda",
						},
						innerBlocks: [],
					},
				],
			} ];
			// The text to annotate: "Giant panda".
			resultWithAnnotation =     [
				{
					startOffset: 0,
					endOffset: 11,
					block: "d126c9dc-c496-49c1-89db-1bdfbc9ef8ed",
					richTextIdentifier: "content",
				},
			];
		} );
		it( "returns an annotation for a block with inner blocks: search-based highlighting", () => {
			const myMockMark1 = mockMark(
				"Giant panda",
				"<yoastmark class='yoast-text-mark'>Giant panda</yoastmark>"
			);

			const myMockMark2 = mockMark(
				"An item about lingo",
				"An item about <yoastmark class='yoast-text-mark'>lingo</yoastmark>"
			);

			const mockMarks = [ myMockMark1, myMockMark2 ];

			expect( getAnnotationsForBlocks( mockBlocks, mockMarks ) ).toEqual( resultWithAnnotation );
		} );
		it( "returns an annotation for a block with inner blocks: position-based highlighting", () => {
			const mockMarks = [
				new Mark( {
					position: {
						startOffsetBlock: 0,
						endOffsetBlock: 16,
						clientId: "d126c9dc-c496-49c1-89db-1bdfbc9ef8ed",
						attributeId: "",
						isFirstSection: false,
					},
					marked: "<yoastmark class='yoast-text-mark'>giant&nbsp;panda</yoastmark>",
					original: "giant&nbsp;panda",
					fieldsToMark: [],
				} ),
				new Mark( {
					position: {
						startOffsetBlock: 34,
						endOffsetBlock: 41,
						clientId: "2821282d-aead-4191-a844-c43568cd112d",
						attributeId: "",
						isFirstSection: false,
					},
					marked: "An item about <yoastmark class='yoast-text-mark'>lingo</yoastmark>",
					original: "An item about lingo",
					fieldsToMark: [],
				} ),
			];

			expect( getAnnotationsForBlocks( mockBlocks, mockMarks ) ).toEqual( resultWithAnnotation );
		} );
	} );
	describe( "a test for retrieving annotations for a Yoast How-To block", () => {
		let mockBlocks, resultWithAnnotation;
		beforeEach( () => {
			select.mockReturnValue( {
				getActiveMarker: jest.fn( () => "keyphraseDensity" ),
			} );
			create.mockReturnValue( {
				// This value will be returned from the last call.
				// This value matches `jsonDescription` in which inside `getAnnotationsForYoastBlocks` is the last value to be processed.
				text: "Step-by-step guide on how to make your cat love you (with or without food bribe).",
			} )
				.mockReturnValueOnce( {
					// This value will be returned from the first call.
					// This value matches `jsonName` in which inside `getAnnotationsForYoastBlocks` is the first value to be processed.
					text: "Establish a close contact with your cat",
				} )
				.mockReturnValueOnce( {
					// This value will be returned from the second call.
					// This value matches `jsonText` in which inside `getAnnotationsForYoastBlocks` is the second value to be processed.
					text: "According to a research, cats are social animal. Your cat will prefer the hooman than a very tempting snack in a stressful situation.",
				} );

			mockBlocks = [ {
				clientId: "2821282d-aead-4191-a844-c43568cd112d",
				name: "yoast/how-to-block",
				isValid: true,
				attributes: {
					jsonDescription: "Step-by-step guide on how to make your cat love you (with or without food bribe).",
					steps: [ {
						id: "how-to-step-1674124378605",
						jsonName: "Establish a close contact with your cat",
						jsonText: "According to a research, cats are social animal. Your cat will prefer the hooman than a very tempting snack in a stressful situation.",
					} ],
				},
				innerBlocks: [],
				originalContent: "<div class=\"schema-how-to wp-block-yoast-how-to-block\"><p class=\"schema-how-to-description\">" +
					"Step-by-step guide on how to make your cat love you (with or without food bribe).</p> <ol class=\"schema-how-to-steps\">" +
					"<li class=\"schema-how-to-step\" id=\"how-to-step-1674124378605\"><strong class=\"schema-how-to-step-name\">" +
					"Establish a close contact with your cat</strong> <p class=\"schema-how-to-step-text\">According to a research, " +
					"cats are social animal. Your cat will prefer the hooman than a very tempting snack in a stressful situation.</p> " +
					"</li> </ol></div>",
			} ];
			// The text to annotate: "cat".
			resultWithAnnotation =     [
				{
					startOffset: 36,
					endOffset: 39,
					block: "2821282d-aead-4191-a844-c43568cd112d",
					richTextIdentifier: "how-to-step-1674124378605-name",
				},
				{
					startOffset: 54,
					endOffset: 57,
					block: "2821282d-aead-4191-a844-c43568cd112d",
					richTextIdentifier: "how-to-step-1674124378605-text",
				},
				{
					startOffset: 39,
					endOffset: 42,
					block: "2821282d-aead-4191-a844-c43568cd112d",
					richTextIdentifier: "description",
				},
			];
		} );
		it( "returns an annotation if there is an applicable marker for the text in a Yoast How-To block: search-based highlighting", () => {
			const myMockMark1 = mockMark(
				"Establish a close contact with your cat",
				"Establish a close contact with your <yoastmark class='yoast-text-mark'>cat</yoastmark>"
			);
			const myMockMark2 = mockMark(
				"According to a research, cats are social animal. Your cat will prefer the hooman than a very tempting snack in a stressful situation.",
				"According to a research, cats are social animal. Your <yoastmark class='yoast-text-mark'>cat</yoastmark> will prefer the hooman than a very tempting snack in a stressful situation."
			);

			const myMockMark3 = mockMark(
				"Step-by-step guide on how to make your cat love you (with or without food bribe).",
				"Step-by-step guide on how to make your <yoastmark class='yoast-text-mark'>cat</yoastmark> love you (with or without food bribe)."
			);

			const mockMarks = [ myMockMark1, myMockMark2, myMockMark3 ];

			const annotations = getAnnotationsForBlocks( mockBlocks, mockMarks );

			expect( annotations ).toEqual( resultWithAnnotation );
		} );
		it( "returns an annotation if there is an applicable marker for the text in a Yoast How-To block: position-based highlighting", () => {
			const mockMarks = [
				new Mark( {
					original: "Establish a close contact with your cat",
					marked: "Establish a close contact with your <yoastmark class='yoast-text-mark'>cat</yoastmark>",
					position: {
						startOffsetBlock: 76,
						endOffsetBlock: 79,
						isFirstSection: true,
						clientId: "2821282d-aead-4191-a844-c43568cd112d",
						attributeId: "how-to-step-1674124378605",
					},
				} ),
				new Mark( {
					original: "According to a research, cats are social animal. Your cat will prefer the hooman than a very tempting snack in a stressful situation.",
					marked: "According to a research, cats are social animal. Your <yoastmark class='yoast-text-mark'>cat</yoastmark>" +
						" will prefer the hooman than a very tempting snack in a stressful situation.",
					position: {
						startOffsetBlock: 54,
						endOffsetBlock: 57,
						isFirstSection: false,
						clientId: "2821282d-aead-4191-a844-c43568cd112d",
						attributeId: "how-to-step-1674124378605",
					},
				} ),
				new Mark( {
					original: "Step-by-step guide on how to make your cat love you (with or without food bribe).",
					marked: "Step-by-step guide on how to make your <yoastmark class='yoast-text-mark'>cat</yoastmark> love you (with or without food bribe).",
					position: {
						startOffsetBlock: 39,
						endOffsetBlock: 42,
						isFirstSection: false,
						clientId: "2821282d-aead-4191-a844-c43568cd112d",
						attributeId: "",
					},
				} ),
			];

			const annotations = getAnnotationsForBlocks( mockBlocks, mockMarks );

			expect( annotations ).toEqual( resultWithAnnotation );
		} );
	} );
	describe( "a test for retrieving annotations for a Yoast How-To block", () => {
		let mockBlocks, resultWithAnnotation;
		beforeEach( () => {
			select.mockReturnValue( {
				getActiveMarker: jest.fn( () => "keyphraseDensity" ),
			} );
			create.mockReturnValue( {
				/*
				 * This value will be returned from the last call.
				 * This value matches `jsonAnswer` of the second question in `mockBlock` in which
				 * inside `getAnnotationsForYoastBlocks` is the last value to be processed.
				 */
				text: "Studies reveal that commercially prepared raw food suffers from increased levels of contamination with potential pathogens compared to “regular” cat foods.",
			} )
				.mockReturnValueOnce( {
					/*
					 * This value will be returned from the first call.
					 * This value matches `jsonQuestion` of the first question in `mockBlock` in which
					 * inside `getAnnotationsForYoastBlocks` is the first value to be processed.
					 */
					text: "What are the benefits of raw food for your cat?",
				} )
				.mockReturnValueOnce( {
					/*
					 * This value will be returned from the second call.
					 * This value matches `jsonAnswer` of the first question in `mockBlock` in which
					 * inside `getAnnotationsForYoastBlocks` is the second value to be processed.
					 */
					text: "A raw food diet for cats is more digestible than a diet of plant-based foods.",
				} )
				.mockReturnValueOnce( {
					/*
					 * This value will be returned from the third call.
					 * This value matches `jsonQuestion` of the second question in `mockBlock` in which
					 * inside `getAnnotationsForYoastBlocks` is the third value to be processed.
					 */
					text: "Are there disadvantages to giving raw food to cats?",
				} );

			mockBlocks = [ {
				clientId: "2821282d-aead-4191-a844-c43568cd112d",
				name: "yoast/faq-block",
				isValid: true,
				attributes: {
					questions: [
						{
							id: "faq-question-1674124378605",
							jsonAnswer: "A raw food diet for cats is more digestible than a diet of plant-based foods.",
							jsonQuestion: "What are the benefits of raw food for your cat?",
						},
						{

							id: "faq-question-16746w9898469",
							jsonAnswer: "Studies reveal that commercially prepared raw food suffers from increased levels of contamination with potential pathogens compared to “regular” cat foods.",
							jsonQuestion: "Are there disadvantages to giving raw food to cats?",
						},
					],
				},
				innerBlocks: [],
				originalContent: "<div class=\"schema-faq wp-block-yoast-faq-block\"><div class=\"schema-faq-section\" id=\"faq-question-1674124378605\">" +
					"<strong class=\"schema-faq-question\">What are the benefits of raw food for your cat?</strong> " +
					"<p class=\"schema-faq-answer\">A raw food diet for cats is more digestible than a diet of plant-based foods.</p> </div>" +
					" <div class=\"schema-faq-section\" id=\"faq-question-16746w9898469\"><strong class=\"schema-faq-question\">" +
					"Are there disadvantages to giving raw food to cats?</strong> <p class=\"schema-faq-answer\">Studies reveal that commercially " +
					"prepared raw food suffers from increased levels of contamination with potential pathogens compared to “regular” cat foods.</p>" +
					" </div> </div>",
			} ];
			// The text to annotate: "raw food".
			resultWithAnnotation = [
				{
					startOffset: 25,
					endOffset: 33,
					block: "2821282d-aead-4191-a844-c43568cd112d",
					richTextIdentifier: "faq-question-1674124378605-question",
				},
				{
					startOffset: 2,
					endOffset: 10,
					block: "2821282d-aead-4191-a844-c43568cd112d",
					richTextIdentifier: "faq-question-1674124378605-answer",
				},
				{
					startOffset: 34,
					endOffset: 42,
					block: "2821282d-aead-4191-a844-c43568cd112d",
					richTextIdentifier: "faq-question-16746w9898469-question",
				},
				{
					startOffset: 42,
					endOffset: 50,
					block: "2821282d-aead-4191-a844-c43568cd112d",
					richTextIdentifier: "faq-question-16746w9898469-answer",
				},
			];
		} );
		it( "returns an annotation if there is an applicable marker for the text in a Yoast FAQ block: search-based highlighting", () => {
			const myMockMark1 = mockMark(
				"A raw food diet for cats is more digestible than a diet of plant-based foods.",
				"A <yoastmark class='yoast-text-mark'>raw food</yoastmark> diet for cats is more digestible than a diet of plant-based foods."
			);
			const myMockMark2 = mockMark(
				"What are the benefits of raw food for your cat?",
				"What are the benefits of <yoastmark class='yoast-text-mark'>raw food</yoastmark> for your cat?"
			);

			const myMockMark3 = mockMark(
				"Studies reveal that commercially prepared raw food suffers from increased levels of contamination with potential pathogens compared to “regular” cat foods.",
				"Studies reveal that commercially prepared <yoastmark class='yoast-text-mark'>raw food</yoastmark> suffers from increased levels of contamination with potential pathogens compared to “regular” cat foods."
			);

			const myMockMark4 = mockMark(
				"Are there disadvantages to giving raw food to cats?",
				"Are there disadvantages to giving <yoastmark class='yoast-text-mark'>raw food</yoastmark> to cats?"
			);

			const mockMarks = [ myMockMark1, myMockMark2, myMockMark3, myMockMark4 ];

			const annotations = getAnnotationsForBlocks( mockBlocks, mockMarks );

			expect( annotations ).toEqual( resultWithAnnotation );
		} );
		it( "returns an annotation if there is an applicable marker for the text in a Yoast FAQ block: position-based highlighting", () => {
			const mockMarks = [
				new Mark( {
					original: "A raw food diet for cats is more digestible than a diet of plant-based foods.",
					marked: "A <yoastmark class='yoast-text-mark'>raw food</yoastmark> diet for cats is more digestible than a diet of plant-based foods.",
					position: {
						startOffsetBlock: 2,
						endOffsetBlock: 10,
						isFirstSection: false,
						clientId: "2821282d-aead-4191-a844-c43568cd112d",
						attributeId: "faq-question-1674124378605",
					},
				} ),
				new Mark( {
					original: "What are the benefits of raw food for your cat?",
					marked: "What are the benefits of <yoastmark class='yoast-text-mark'>raw food</yoastmark> for your cat?",
					position: {
						startOffsetBlock: 61,
						endOffsetBlock: 69,
						isFirstSection: true,
						clientId: "2821282d-aead-4191-a844-c43568cd112d",
						attributeId: "faq-question-1674124378605",
					},
				} ),
				new Mark( {
					original: "Studies reveal that commercially prepared raw food suffers from increased levels of contamination with potential pathogens compared to “regular” cat foods.",
					marked: "Studies reveal that commercially prepared <yoastmark class='yoast-text-mark'>raw food</yoastmark> suffers from increased levels of contamination with potential pathogens compared to “regular” cat foods.",
					position: {
						startOffsetBlock: 42,
						endOffsetBlock: 50,
						isFirstSection: false,
						clientId: "2821282d-aead-4191-a844-c43568cd112d",
						attributeId: "faq-question-16746w9898469",
					},
				} ),
				new Mark( {
					original: "Are there disadvantages to giving raw food to cats?",
					marked: "Are there disadvantages to giving <yoastmark class='yoast-text-mark'>raw food</yoastmark> to cats?",
					position: {
						startOffsetBlock: 70,
						endOffsetBlock: 78,
						isFirstSection: true,
						clientId: "2821282d-aead-4191-a844-c43568cd112d",
						attributeId: "faq-question-16746w9898469",
					},
				} ),
			];

			const annotations = getAnnotationsForBlocks( mockBlocks, mockMarks );

			expect( annotations ).toEqual( resultWithAnnotation );
		} );
	} );
} );

describe( "tests for the hasInnerBlocks helper", () => {
	it( "returns true if a block has inner blocks", () => {
		const mockBlockWithInnerblocks = {
			innerBlocks: [ { fakeData: "fakeData" } ],
		};
		expect( hasInnerBlocks( mockBlockWithInnerblocks ) ).toBeTruthy();
	} );
	it( "returns false if a block has no inner blocks", () =>{
		const mockBlockWithoutInnerblocks = {
			innerBlocks: [],
			fakeData: "fakeData",
		};
		expect( hasInnerBlocks( mockBlockWithoutInnerblocks ) ).toBeFalsy();
	} );
} );

