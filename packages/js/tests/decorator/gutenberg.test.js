import {
	START_MARK,
	END_MARK,
	getYoastmarkOffsets,
	getIndicesOf,
	calculateAnnotationsForTextFormat,
	getAnnotationsFromBlock,
	hasInnerBlocks,
	getAnnotationsForYoastBlocks,
} from "../../src/decorator/gutenberg";

jest.mock( "@wordpress/rich-text", () => ( {
	create: jest.fn(),
} ) );

import { create } from "@wordpress/rich-text";

import { select } from "@wordpress/data";

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

describe( "test getAnnotationsFromBlock", () => {
	it( "returns an annotation if there is an applicable marker for the text", () => {
		create.mockImplementation( () => {
			return { text: "An item about lingo" };
		} );

		const mockBlock = {
			clientId: "34f61542-0902-44f7-ab48-d9f88a022b43",
			name: "core/list-item",
			isValid: true,
			attributes: {
				content: "An item about lingo",
			},
			innerBlocks: [],
		};

		const myMockMark1 = mockMark(
			"The first line of Lorem Ipsum, \"Lorem ipsum dolor sit amet..\", comes from a line in section 1.10.32. lingo",
			"The first line of Lorem Ipsum, \"Lorem ipsum dolor sit amet..\", comes from a line in section 1.10.32. <yoastmark class='yoast-text-mark'>lingo</yoastmark>"
		);

		const myMockMark2 = mockMark(
			"An item about lingo",
			"An item about <yoastmark class='yoast-text-mark'>lingo</yoastmark>"
		);

		const mockMarks = [ myMockMark1, myMockMark2 ];

		select.mockReturnValue( {
			getActiveMarker: jest.fn( () => "keyphraseDensity" ),
		} );

		const annotations = getAnnotationsFromBlock( mockBlock, mockMarks );

		const resultWithAnnotation =     [
			{
			  startOffset: 14,
			  endOffset: 19,
			  block: "34f61542-0902-44f7-ab48-d9f88a022b43",
			  richTextIdentifier: "content",
			},
		  ];

		expect( annotations ).toEqual( resultWithAnnotation );
	} );
	it( "returns an annotation if there is an applicable marker for the text in a Yoast How-To block", () => {
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
				jsonDescription: "Step by step guide on how to make your cat love you (with or without food bribe).",
				steps: [ {
					id: "how-to-step-1674124378605",
					jsonName: "Establish a close contact with your cat",
					jsonText: "According to a research, cats are social animal. Your cat will prefer the hooman than a very tempting snack in a stressful situation.",
				} ],
			},
			innerBlocks: [],
		};

		const myMockMark1 = mockMark(
			"Establish a close contact with your cat",
			"Establish a close contact with your <yoastmark class='yoast-text-mark'>cat</yoastmark>"
		);
		const myMockMark2 = mockMark(
			"According to a research, cats are social animal. Your cat will prefer the hooman than a very tempting snack in a stressful situation.",
			"According to a research, cats are social animal. Your <yoastmark class='yoast-text-mark'>cat</yoastmark> will prefer the hooman than a very tempting snack in a stressful situation."
		);

		const myMockMark3 = mockMark(
			"Step by step guide on how to make your cat love you (with or without food bribe).",
			"Step by step guide on how to make your <yoastmark class='yoast-text-mark'>cat</yoastmark> love you (with or without food bribe)."
		);

		const mockMarks = [ myMockMark1, myMockMark2, myMockMark3 ];
		select.mockReturnValue( {
			getActiveMarker: jest.fn( () => "keyphraseDensity" ),
		} );

		const annotations = getAnnotationsForYoastBlocks( mockAttribute, mockBlock, mockMarks );
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
			{
				startOffset: 39,
				endOffset: 42,
				block: "2821282d-aead-4191-a844-c43568cd112d",
				richTextIdentifier: "description",
			},
		];

		expect( annotations ).toEqual( resultWithAnnotation );
	} );
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
		};

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
		select.mockReturnValue( {
			getActiveMarker: jest.fn( () => "keyphraseDensity" ),
		} );

		const annotations = getAnnotationsForYoastBlocks( mockAttribute, mockBlock, mockMarks );
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
