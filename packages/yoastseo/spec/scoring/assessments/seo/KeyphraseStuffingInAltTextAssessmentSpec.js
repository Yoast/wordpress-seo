import KeyphraseStuffingInAltTextAssessment from "../../../../src/scoring/assessments/seo/KeyphraseStuffingInAltTextAssessment";
import Paper from "../../../../src/values/Paper.js";
import Factory from "../../../../src/helpers/factory.js";

const assessment = new KeyphraseStuffingInAltTextAssessment();
const titleAnchor = "<a href='https://yoa.st/alt-text-keyphrase-stuffing' target='_blank'>";
const actionAnchor = "<a href='https://yoa.st/alt-text-keyphrase-stuffing-cta' target='_blank'>";

/**
 * Builds the expected feedback text.
 *
 * @param {string} middle The part between the title and the call to action.
 *
 * @returns {string} The feedback text.
 */
const feedback = ( middle ) => `${ titleAnchor }Keyphrase stuffing in alt text</a>: ${ middle } ${ actionAnchor }Do not overuse the keyphrase</a>!`;

/**
 * Builds the research result for images whose alt text has the given counts, identified by their index.
 *
 * @param {number[]} counts The keyphrase count of each image.
 *
 * @returns {{identifier: string, count: number}[]} The images.
 */
const imagesWithCounts = ( counts ) => counts.map( ( count, index ) => ( { identifier: `image-${ index }`, count } ) );

/**
 * Runs the assessment against a mocked `altTextKeyphraseCount` research.
 *
 * @param {number[]} counts                      The keyphrase count of each image.
 * @param {boolean}  [exactMatchRequested]       Whether exact matching is requested.
 * @param {KeyphraseStuffingInAltTextAssessment} [assessmentToRun] The assessment to run.
 *
 * @returns {AssessmentResult} The result of the assessment.
 */
const getResult = ( counts, exactMatchRequested = false, assessmentToRun = assessment ) => assessmentToRun.getResult(
	new Paper( "", { keyword: "cat" } ),
	Factory.buildMockResearcher( { altTextKeyphraseCount: { exactMatchRequested, images: imagesWithCounts( counts ) } }, true )
);

describe( "an assessment for keyphrase stuffing in the alt text of the assessed images", () => {
	it.each( [
		[ "there are no images with alt text", [] ],
		[ "no alt text uses the keyphrase", [ 0, 0 ] ],
		[ "every alt text uses the keyphrase once", [ 1, 1, 1 ] ],
	] )( "returns no score and no text when %s, so the assessment is not shown", ( _, counts ) => {
		const result = getResult( counts );

		expect( result.hasScore() ).toBe( false );
		expect( result.hasText() ).toBe( false );
		expect( result.getFlaggedItems() ).toEqual( [] );
	} );

	it( "returns no score and no text when an alt text uses the exact-match keyphrase once", () => {
		const result = getResult( [ 1 ], true );

		expect( result.hasScore() ).toBe( false );
		expect( result.hasText() ).toBe( false );
	} );

	it( "gives orange feedback when one alt text uses the keyphrase twice", () => {
		const result = getResult( [ 2, 1 ] );

		expect( result.getScore() ).toBe( 6 );
		expect( result.getText() ).toBe( feedback( "1 of your images has alt text that uses the keyphrase or its synonym twice." ) );
		expect( result.getFlaggedItems() ).toEqual( [ "image-0" ] );
	} );

	it( "gives orange feedback when several alt texts use the keyphrase twice", () => {
		const result = getResult( [ 2, 2, 0 ] );

		expect( result.getScore() ).toBe( 6 );
		expect( result.getText() ).toBe( feedback( "2 of your images have alt text that uses the keyphrase or its synonym twice." ) );
		expect( result.getFlaggedItems() ).toEqual( [ "image-0", "image-1" ] );
	} );

	it( "gives red feedback when one alt text uses the keyphrase more than twice", () => {
		const result = getResult( [ 3 ] );

		expect( result.getScore() ).toBe( 3 );
		expect( result.getText() ).toBe( feedback( "1 of your images has alt text that uses the keyphrase or its synonym more than twice." ) );
		expect( result.getFlaggedItems() ).toEqual( [ "image-0" ] );
	} );

	it( "gives red feedback when several alt texts use the keyphrase more than twice", () => {
		const result = getResult( [ 3, 5, 1 ] );

		expect( result.getScore() ).toBe( 3 );
		expect( result.getText() ).toBe( feedback( "2 of your images have alt text that uses the keyphrase or its synonym more than twice." ) );
		expect( result.getFlaggedItems() ).toEqual( [ "image-0", "image-1" ] );
	} );

	it( "gives red feedback that counts all flagged images when some use the keyphrase twice and others more than twice", () => {
		const result = getResult( [ 3, 2, 2, 1 ] );

		expect( result.getScore() ).toBe( 3 );
		expect( result.getText() ).toBe( feedback( "3 of your images have alt text that uses the keyphrase or its synonym twice or more." ) );
		expect( result.getFlaggedItems() ).toEqual( [ "image-0", "image-1", "image-2" ] );
	} );

	describe( "with exact matching", () => {
		it( "gives red feedback when one alt text uses the keyphrase twice", () => {
			const result = getResult( [ 2 ], true );

			expect( result.getScore() ).toBe( 3 );
			expect( result.getText() ).toBe( feedback( "1 of your images has alt text that uses the keyphrase or its synonym multiple times." ) );
		} );

		it( "gives red feedback that counts both twice and more than twice", () => {
			const result = getResult( [ 2, 4, 1 ], true );

			expect( result.getScore() ).toBe( 3 );
			expect( result.getText() ).toBe( feedback( "2 of your images have alt text that uses the keyphrase or its synonym multiple times." ) );
			expect( result.getFlaggedItems() ).toEqual( [ "image-0", "image-1" ] );
		} );
	} );

	it( "lists an identifier shared by two flagged images once, and leaves out images without an identifier", () => {
		const result = assessment.getResult(
			new Paper( "", { keyword: "cat" } ),
			Factory.buildMockResearcher( { altTextKeyphraseCount: { exactMatchRequested: false, images: [
				{ identifier: "a.jpg", count: 2 },
				{ identifier: "a.jpg", count: 2 },
				{ identifier: "", count: 2 },
			] } }, true )
		);

		expect( result.getText() ).toBe( feedback( "3 of your images have alt text that uses the keyphrase or its synonym twice." ) );
		expect( result.getFlaggedItems() ).toEqual( [ "a.jpg" ] );
	} );

	it( "uses the feedback strings of a `getResultTexts` callback, and passes it the counts", () => {
		const getResultTexts = jest.fn( () => ( {
			moreThanTwice: "more than twice",
			multipleTimes: "multiple times",
			twice: "twice",
			twiceOrMore: "twice or more",
		} ) );
		const configured = new KeyphraseStuffingInAltTextAssessment( { callbacks: { getResultTexts } } );

		expect( getResult( [ 3, 2 ], false, configured ).getText() ).toBe( "twice or more" );
		expect( getResultTexts ).toHaveBeenCalledWith( {
			urlTitleAnchorOpeningTag: titleAnchor,
			urlActionAnchorOpeningTag: actionAnchor,
			overusedCount: 1,
			twiceCount: 1,
			exactMatchRequested: false,
		} );
		expect( getResult( [ 3 ], false, configured ).getText() ).toBe( "more than twice" );
		expect( getResult( [ 2 ], true, configured ).getText() ).toBe( "multiple times" );
		expect( getResult( [ 2 ], false, configured ).getText() ).toBe( "twice" );
	} );

	it( "uses the configured scores and URLs", () => {
		const configured = new KeyphraseStuffingInAltTextAssessment( {
			scores: { bad: 1, okay: 5 },
			urlTitle: "<a href='https://example.com/title'>",
			urlCallToAction: "<a href='https://example.com/cta'>",
		} );

		const result = getResult( [ 3 ], false, configured );
		expect( result.getScore() ).toBe( 1 );
		expect( result.getText() ).toContain( "<a href='https://example.com/title'>" );
		expect( result.getText() ).toContain( "<a href='https://example.com/cta'>" );
		expect( getResult( [ 2 ], false, configured ).getScore() ).toBe( 5 );
	} );

	describe( "isApplicable", () => {
		it( "is applicable when the paper has a keyphrase", () => {
			expect( assessment.isApplicable( new Paper( "", { keyword: "cat" } ) ) ).toBe( true );
		} );

		it( "is not applicable when the paper has no keyphrase", () => {
			expect( assessment.isApplicable( new Paper( "" ) ) ).toBe( false );
		} );
	} );
} );
