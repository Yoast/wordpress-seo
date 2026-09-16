import AltTextLengthAssessment from "../../../../src/scoring/assessments/seo/AltTextLengthAssessment";
import Paper from "../../../../src/values/Paper.js";
import Factory from "../../../../src/helpers/factory.js";

const assessment = new AltTextLengthAssessment();
const titleAnchor = "<a href='https://yoa.st/alt-text-length' target='_blank'>";
const actionAnchor = "<a href='https://yoa.st/alt-text-length-cta' target='_blank'>";

/**
 * Runs the assessment against a mocked `altTextLength` research.
 *
 * @param {number} tooShort The number of images whose alt text is too short.
 * @param {number} tooLong The number of images whose alt text is too long.
 * @param {Object} [attributes] The attributes to build the Paper with.
 *
 * @returns {AssessmentResult} The result of the assessment.
 */
const getResult = ( tooShort, tooLong, attributes = {} ) => assessment.getResult(
	new Paper( "", attributes ),
	Factory.buildMockResearcher( { altTextLength: { tooShort, tooLong } }, true )
);

describe( "an assessment for the length of the alt text of the assessed images", () => {
	it( "returns no score and no text when no alt text is too short or too long, so the assessment is not shown", () => {
		const result = getResult( 0, 0 );

		expect( result.hasScore() ).toBe( false );
		expect( result.hasText() ).toBe( false );
	} );

	it( "gives feedback when one image has alt text that is too short", () => {
		const result = getResult( 1, 0 );

		expect( result.getScore() ).toBe( 6 );
		expect( result.getText() ).toBe(
			`${ titleAnchor }Alt text length</a>: 1 of your images has alt text of 10 characters or fewer. ` +
			`${ actionAnchor }Consider making it more descriptive</a>.`
		);
	} );

	it( "gives feedback when several images have alt text that is too short", () => {
		const result = getResult( 3, 0 );

		expect( result.getScore() ).toBe( 6 );
		expect( result.getText() ).toBe(
			`${ titleAnchor }Alt text length</a>: 3 of your images have alt text of 10 characters or fewer. ` +
			`${ actionAnchor }Consider making it more descriptive</a>.`
		);
	} );

	it( "gives feedback when one image has alt text that is too long", () => {
		const result = getResult( 0, 1 );

		expect( result.getScore() ).toBe( 6 );
		expect( result.getText() ).toBe(
			`${ titleAnchor }Alt text length</a>: 1 of your images has alt text of 200 characters or more. ` +
			`${ actionAnchor }Consider shortening it and putting the long explanation in your content</a>.`
		);
	} );

	it( "gives feedback when several images have alt text that is too long", () => {
		const result = getResult( 0, 2 );

		expect( result.getScore() ).toBe( 6 );
		expect( result.getText() ).toBe(
			`${ titleAnchor }Alt text length</a>: 2 of your images have alt text of 200 characters or more. ` +
			`${ actionAnchor }Consider shortening it and putting the long explanation in your content</a>.`
		);
	} );

	it( "combines the counts when both a too short and a too long alt text are found", () => {
		const result = getResult( 2, 1 );

		expect( result.getScore() ).toBe( 6 );
		expect( result.getText() ).toBe(
			`${ titleAnchor }Alt text length</a>: 3 of your images have alt text that is either too short ` +
			`(10 characters or fewer) or too long (200 characters or more). ${ actionAnchor }Consider revising them</a>.`
		);
	} );

	it( "uses the singular form of the combined feedback when one image is too short and none is too long", () => {
		// Not reachable through `both`: a single flagged image takes the tooShort or tooLong string instead.
		const result = getResult( 1, 0 );

		expect( result.getText() ).toContain( "1 of your images has alt text of 10 characters or fewer" );
	} );

	it( "uses the score from the config", () => {
		const configuredAssessment = new AltTextLengthAssessment( { scores: { okay: 3 } } );
		const result = configuredAssessment.getResult(
			new Paper( "" ),
			Factory.buildMockResearcher( { altTextLength: { tooShort: 1, tooLong: 0 } }, true )
		);

		expect( result.getScore() ).toBe( 3 );
	} );
} );

describe( "the feedback strings of the alt text length assessment", () => {
	it( "returns the custom feedback strings when a callback is provided", () => {
		const callbackAssessment = new AltTextLengthAssessment( {
			callbacks: {
				getResultTexts: ( { tooShortCount } ) => ( {
					tooShort: `Custom: ${ tooShortCount } too short.`,
					tooLong: "Custom: too long.",
					both: "Custom: both.",
				} ),
			},
		} );
		const result = callbackAssessment.getResult(
			new Paper( "" ),
			Factory.buildMockResearcher( { altTextLength: { tooShort: 4, tooLong: 0 } }, true )
		);

		expect( result.getText() ).toBe( "Custom: 4 too short." );
	} );

	it( "passes the counts and the anchors to a custom callback", () => {
		const getResultTexts = jest.fn().mockReturnValue( { tooShort: "", tooLong: "", both: "x" } );
		const callbackAssessment = new AltTextLengthAssessment( { callbacks: { getResultTexts } } );

		callbackAssessment.getResult(
			new Paper( "" ),
			Factory.buildMockResearcher( { altTextLength: { tooShort: 1, tooLong: 2 } }, true )
		);

		expect( getResultTexts ).toHaveBeenCalledWith( {
			urlTitleAnchorOpeningTag: titleAnchor,
			urlActionAnchorOpeningTag: actionAnchor,
			tooShortCount: 1,
			tooLongCount: 2,
			tooShortBoundary: 10,
			tooLongBoundary: 200,
		} );
	} );
} );
