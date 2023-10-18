import {
	calculateAnnotationsForTextFormat,
	END_MARK,
	getIndicesOf,
	getYoastmarkOffsets,
	START_MARK,
} from "../../../src/decorator/helpers/searchBasedAnnotationHelper";

/**
 * Mocks a `yoastseo` Mark object.
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
