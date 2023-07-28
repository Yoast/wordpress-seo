import {
	START_MARK,
	END_MARK,
	getYoastmarkOffsets,
	getIndicesOf,
	calculateAnnotationsForTextFormat,
	getAnnotationsForWPBlock,
	getAnnotationsForFAQ,
	getAnnotationsForHowTo,
	createAnnotationsFromPositionBasedMarks,
} from "../../../src/decorator/helpers/getAnnotationsHelpers";
import { create } from "@wordpress/rich-text";
import { select } from "@wordpress/data";
import { Mark } from "yoastseo/src/values";

jest.mock( "@wordpress/rich-text", () => ( {
	create: jest.fn(),
} ) );

jest.mock( "@wordpress/data" );

/**
 * Mocks a YoastSEO.js Mark object.
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

describe( "getOffsets", () => {
	it( "successfully finds offsets for a single mark at the start of the text", () => {
		const markedText = `${ START_MARK }A marked${ END_MARK } text.`;

		const expected = [
			{
				startOffset: 0,
				endOffset: 8,
			},
		];

		expect( getYoastmarkOffsets( markedText ) ).toEqual( expected );
	} );

	it( "successfully finds offsets for a single mark at the end of the text", () => {
		const markedText = `A ${ START_MARK }marked text.${ END_MARK }`;

		const expected = [
			{
				startOffset: 2,
				endOffset: 14,
			},
		];

		expect( getYoastmarkOffsets( markedText ) ).toEqual( expected );
	} );

	it( "successfully finds multiple offsets for multiple marks", () => {
		const markedText = `${ START_MARK }A${ END_MARK } marked ${ START_MARK }text.${ END_MARK }`;

		const expected = [
			{
				startOffset: 0,
				endOffset: 1,
			},
			{
				startOffset: 9,
				endOffset: 14,
			},
		];

		expect( getYoastmarkOffsets( markedText ) ).toEqual( expected );
	} );

	/**
	 * If we receive an unexpected string we don't do anything to avoid code complexity. We
	 * expect YoastSEO.js to provide us with proper marked sentences after all.
	 */
	it( "returns an empty array if the start and end tags are in a incorrect order", () => {
		const markedText = `${ START_MARK }A${ END_MARK } marked ${ END_MARK }text.${ START_MARK }`;

		const expected = [];

		expect( getYoastmarkOffsets( markedText ) ).toEqual( expected );
	} );
} );

describe( "getIndicesOf", () => {
	it( "finds a single case sensitive occurence", () => {
		const expected = [ 3 ];

		expect( getIndicesOf( "la LA", "LA" ) ).toEqual( expected );
	} );

	it( "finds multiple case insensitive occurences", () => {
		const expected = [ 0, 3 ];

		expect( getIndicesOf( "la LA", "LA", false ) ).toEqual( expected );
	} );
} );

describe( "calculateAnnotationsForTextFormat", () => {
	it( "correctly calculates multiple offsets for a single sentence in a text", () => {
		const text = "A long text. A marked text.";

		const mark = mockMark(
			"A marked text.",
			`A marked ${ START_MARK }text${ END_MARK }.`
		);

		/*
		 * "A long text. A marked text."
		 *                     22 ^   ^ 26
		 */
		const expected = [
			{
				startOffset: 22,
				endOffset: 26,
			},
		];

		const actual = calculateAnnotationsForTextFormat(
			text,
			mark
		);

		expect( actual ).toEqual( expected );
	} );

	it( "correctly calculates offsets in a text with HTML tags", () => {
		const text = "A long text. A marked text.";

		const mark = mockMark(
			"A marked text.",
			`A ${ START_MARK }<b>marked text</b>${ END_MARK }.`
		);

		/*
		 * "A long text. A marked text."
		 *                 ^ 15       ^ 26
		 */
		const expected = [ {
			startOffset: 15,
			endOffset: 26,
		} ];

		const actual = calculateAnnotationsForTextFormat(
			text,
			mark
		);

		expect( actual ).toEqual( expected );
	} );

	it( "correctly calculates offsets in a text with invalid HTML markup", () => {
		const text = "A long text. A marked text.";

		const mark = mockMark(
			"A marked text.",
			`A ${ START_MARK }<b>marked${ END_MARK } text</b>.`
		);

		/*
		 * "A long text. A marked text."
		 *                 ^ 15  ^ 21
		 */
		const expected = [ {
			startOffset: 15,
			endOffset: 21,
		} ];

		const actual = calculateAnnotationsForTextFormat(
			text,
			mark
		);

		expect( actual ).toEqual( expected );
	} );
} );

describe( "createAnnotationsFromPositionBasedMarks", () => {
	it( "create annotation from block position based mark:" +
		" when the block client id matches the mark client id and the block html is the same as the rich text", () => {
		const mark = new Mark( {
			position: {
				startOffsetBlock: 22,
				endOffsetBlock: 26,
				clientId: "261e3892-f28c-4273-86b4-a00801c38d22",
			},
		} );
		const html = "The Maine Coon is a large domesticated cat breed.";

		/*
		 * "A long text. A marked text."
		 *                     22 ^   ^ 26
		 */
		const expected = [
			{
				startOffset: 22,
				endOffset: 26,
			},
		];

		const actual = createAnnotationsFromPositionBasedMarks(
			"261e3892-f28c-4273-86b4-a00801c38d22",
			mark,
			html,
			html
		);

		expect( actual ).toEqual( expected );
	} );
	it( "should return an empty array if the block client id doesn't match the mark client id", () => {
		const mark = new Mark( {
			position: {
				startOffsetBlock: 22,
				endOffsetBlock: 26,
				clientId: "261aaa892-f28c-4273-86b4-a008574858",
			},
		} );
		const html = "The Maine Coon is a large domesticated cat breed.";

		const actual = createAnnotationsFromPositionBasedMarks(
			"261e3892-f28c-4273-86b4-a00801c38d22",
			mark,
			html,
			html
		);

		expect( actual ).toEqual( [] );
	} );
	it( "should return annotations with adjusted block start and end position " +
		"when the block html is not the same as the rich text", () => {
		const mark = new Mark( {
			position: {
				startOffsetBlock: 115,
				endOffsetBlock: 120,
				clientId: "261e3892-f28c-4273-86b4-a00801c38d22",
			},
		} );
		const html = "Red panda has smaller chewing muscles than " +
			"the <strong><a href=\"https://github.com/Yoast/wordpress-seo/pull/20139\">giant</a></strong> panda. ";
		const richText = "Red panda has a smaller chewing muscles than the giant panda.";

		const actual = createAnnotationsFromPositionBasedMarks(
			"261e3892-f28c-4273-86b4-a00801c38d22",
			mark,
			html,
			richText
		);

		expect( actual ).toEqual( [ {
			startOffset: 47,
			endOffset: 52,
		} ] );
	} );
} );

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
} );
