import {
	getAnnotationsForWPBlock,
	getAnnotationsForFAQ,
	getAnnotationsForHowTo,
} from "../../../src/decorator/helpers/getAnnotationsHelpers";
import { create } from "@wordpress/rich-text";
import { select } from "@wordpress/data";
import { Mark } from "yoastseo/src/values";

jest.mock( "@wordpress/rich-text", () => ( {
	create: jest.fn(),
} ) );

jest.mock( "@wordpress/data" );


describe( "getAnnotationsForYoastBlock", () => {
	describe( "a test for retrieving annotations from a Yoast How-to block", () => {
		it( "returns the annotations from a Yoast How-To block, steps section", () => {
			create.mockReturnValue( {
				// This value will be returned from the last call.
				// This value matches `jsonDescription` in which inside `getAnnotationsForYoastBlocks` is the last value to be processed.
				text: "Step by step guide on how to make your cat love you (with or without food bribe).",
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
			const mockAttribute = {
				key: "steps",
			};

			const mockBlock = {
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
			};

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
			select.mockReturnValue( {
				getActiveMarker: jest.fn( () => "keyphraseDensity" ),
			} );

			const annotations = getAnnotationsForHowTo( mockAttribute, mockBlock, mockMarks );
			const resultWithAnnotation = [
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
			];

			expect( annotations ).toEqual( resultWithAnnotation );
		} );
		it( "returns the annotations from a Yoast How-To block, jsonDescription section", () => {
			create.mockReturnValue( {
				// This value will be returned from the last call.
				// This value matches `jsonDescription` in which inside `getAnnotationsForYoastBlocks` is the last value to be processed.
				text: "Step by step guide on how to make your cat love you (with or without food bribe).",
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
			const mockAttribute = {
				key: "jsonDescription",
			};

			const mockBlock = {
				clientId: "2821282d-aead-4191-a844-c43568cd112d",
				name: "yoast/how-to-block",
				isValid: true,
				attributes: {
					jsonDescription: "Step by step guide on how to make your cat love you (with or without food bribe).",
					steps: [ {
						id: "how-to-step-1674124378605",
						jsonName: "Establish a close contact with your cat",
						jsonText: "According to a research, cats are social animal. Your cat will prefer the hooman than a very tempting snack in a stressful situation.",
					} ],
				},
				innerBlocks: [],
			};

			const mockMarks = [
				new Mark( {
					original: "Establish a close contact with your cat",
					marked: "Establish a close contact with your <yoastmark class='yoast-text-mark'>cat</yoastmark>",
					position: {
						startOffsetBlock: 36,
						endOffsetBlock: 39,
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
			select.mockReturnValue( {
				getActiveMarker: jest.fn( () => "keyphraseDensity" ),
			} );

			const annotations = getAnnotationsForHowTo( mockAttribute, mockBlock, mockMarks );
			const resultWithAnnotation = [
				{
					startOffset: 39,
					endOffset: 42,
					block: "2821282d-aead-4191-a844-c43568cd112d",
					richTextIdentifier: "description",
				},
			];

			expect( annotations ).toEqual( resultWithAnnotation );
		} );
	} );
	describe( "a test for retrieving annotations from a Yoast FAQ block", () => {
		it( "returns an annotation if there is an applicable marker for the text in a Yoast FAQ block", () => {
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
			const mockAttribute = {
				key: "questions",
			};

			const mockBlock = {
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
			};

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
			select.mockReturnValue( {
				getActiveMarker: jest.fn( () => "keyphraseDensity" ),
			} );

			const annotations = getAnnotationsForFAQ( mockAttribute, mockBlock, mockMarks );
			const resultWithAnnotation = [
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

			expect( annotations ).toEqual( resultWithAnnotation );
		} );
	} );
} );

describe( "a test for retrieving annotations from non-Yoast blocks", () => {
	it( "returns an annotation if there is an applicable marker for a paragraph block: " +
		"the paragraph text contains some styling such as strong and em tags", () => {
		// The string we want to highlight: "red panda's".
		create.mockImplementation( () => {
			return { text: "The red panda's skull is wide, and its lower jaw is robust." };
		} );

		const mockBlock = {
			clientId: "34f61542-0902-44f7-ab48-d9f88a022b43",
			name: "core/paragraph",
			isValid: true,
			attributes: {
				content: "The red <strong>panda's</strong> skull is <em>wide</em>, and its lower jaw is robust.",
			},
			innerBlocks: [],
			originalContent: "<p>The red <strong>panda's</strong> skull is <em>wide</em>, and its lower jaw is robust.</p>",
		};

		const mockAttribute = {
			key: "content",
		};

		const mockMarks = [
			new Mark( {
				original: "The red panda's skull is wide, and its lower jaw is robust.",
				marked: "The <yoastmark class='yoast-text-mark'>red panda's</yoastmark> skull is wide, and its lower jaw is robust.",
				position: {
					startOffsetBlock: 4,
					endOffsetBlock: 7,
					isFirstSection: false,
					clientId: "34f61542-0902-44f7-ab48-d9f88a022b43",
					attributeId: "",
				},
			} ),
			new Mark( {
				original: "The red panda's skull is wide, and its lower jaw is robust.",
				marked: "The <yoastmark class='yoast-text-mark'>red panda's</yoastmark> skull is wide, and its lower jaw is robust.",
				position: {
					startOffsetBlock: 16,
					endOffsetBlock: 23,
					isFirstSection: false,
					clientId: "34f61542-0902-44f7-ab48-d9f88a022b43",
					attributeId: "",
				},
			} ),
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
		];

		select.mockReturnValue( {
			getActiveMarker: jest.fn( () => "keyphraseDensity" ),
		} );

		const annotations = getAnnotationsForWPBlock( mockAttribute, mockBlock, mockMarks );

		const resultWithAnnotation =     [
			{
				startOffset: 4,
				endOffset: 7,
				block: "34f61542-0902-44f7-ab48-d9f88a022b43",
				richTextIdentifier: "content",
			},
			{
				startOffset: 8,
				endOffset: 15,
				block: "34f61542-0902-44f7-ab48-d9f88a022b43",
				richTextIdentifier: "content",
			},
		];

		expect( annotations ).toEqual( resultWithAnnotation );
	} );
	it( "returns an annotation if there is an applicable marker for a heading block: " +
		"the heading text contains some styling such as strong tags", () => {
		// The string we want to highlight: "The origin of red pandas".
		create.mockImplementation( () => {
			return { text: "The origin of red pandas" };
		} );

		const mockBlock = {
			clientId: "34f61542-0902-44f7-ab48-gyildhgfgh6463286",
			name: "core/heading",
			isValid: true,
			attributes: {
				content: "The origin of red <strong>pandas</strong>",
			},
			innerBlocks: [],
			originalContent: "<h1 class=\"wp-block-heading\" id=\"h-the-origin-or-red-panda\">The origin of red <strong>pandas</strong></h1>",
		};

		const mockAttribute = {
			key: "content",
		};

		const mockMarks = [
			new Mark( {
				original: "<h1>The origin of red pandas</h1>",
				marked: "<h1>The origin of red pandas</h1>",
				position: {
					startOffsetBlock: 0,
					endOffsetBlock: 24,
					clientId: "34f61542-0902-44f7-ab48-gyildhgfgh6463286",
				},
			} ),
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
		];

		select.mockReturnValue( {
			getActiveMarker: jest.fn( () => "singleH1" ),
		} );

		const annotations = getAnnotationsForWPBlock( mockAttribute, mockBlock, mockMarks );

		const resultWithAnnotation =     [
			{
				startOffset: 0,
				endOffset: 24,
				block: "34f61542-0902-44f7-ab48-gyildhgfgh6463286",
				richTextIdentifier: "content",
			},
		];

		expect( annotations ).toEqual( resultWithAnnotation );
	} );
} );
