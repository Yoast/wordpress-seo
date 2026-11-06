import NonDescriptiveAltTextAssessment from "../../../../src/scoring/assessments/seo/NonDescriptiveAltTextAssessment";
import Paper from "../../../../src/values/Paper.js";
import Factory from "../../../../src/helpers/factory.js";

const assessment = new NonDescriptiveAltTextAssessment();
const titleAnchor = "<a href='https://yoa.st/non-descriptive-alt-text' target='_blank'>";
const actionAnchor = "<a href='https://yoa.st/non-descriptive-alt-text-cta' target='_blank'>";

/**
 * Runs the assessment against a mocked `nonDescriptiveAltText` research.
 *
 * @param {number} count The number of images whose alt text is non-descriptive.
 * @param {Array<string|number>} [flagged] The identifiers of those images.
 *
 * @returns {AssessmentResult} The result of the assessment.
 */
const getResult = ( count, flagged = [] ) => assessment.getResult(
	new Paper( "" ),
	Factory.buildMockResearcher( { nonDescriptiveAltText: { count, flagged } }, true )
);

describe( "an assessment for non-descriptive alt text", () => {
	it( "returns no score and no text when no alt text is non-descriptive, so the assessment is not shown", () => {
		const result = getResult( 0 );

		expect( result.hasScore() ).toBe( false );
		expect( result.hasText() ).toBe( false );
	} );

	it( "gives feedback when one image has non-descriptive alt text", () => {
		const result = getResult( 1 );

		expect( result.getScore() ).toBe( 3 );
		expect( result.getText() ).toBe(
			`${ titleAnchor }Non-descriptive alt text</a>: 1 of your images has alt text that doesn't describe the image. ` +
			`${ actionAnchor }Describe what the image shows, or leave the alt text empty if the image is decorative</a>.`
		);
	} );

	it( "gives feedback when several images have non-descriptive alt text", () => {
		const result = getResult( 3 );

		expect( result.getScore() ).toBe( 3 );
		expect( result.getText() ).toBe(
			`${ titleAnchor }Non-descriptive alt text</a>: 3 of your images have alt text that doesn't describe the image. ` +
			`${ actionAnchor }Describe what the image shows, or leave the alt text empty if the image is decorative</a>.`
		);
	} );

	it( "uses the score from the config", () => {
		const configuredAssessment = new NonDescriptiveAltTextAssessment( { scores: { bad: 1 } } );
		const result = configuredAssessment.getResult(
			new Paper( "" ),
			Factory.buildMockResearcher( { nonDescriptiveAltText: { count: 1, flagged: [] } }, true )
		);

		expect( result.getScore() ).toBe( 1 );
	} );
} );

describe( "the feedback strings of the non-descriptive alt text assessment", () => {
	it( "returns the custom feedback string when a callback is provided", () => {
		const callbackAssessment = new NonDescriptiveAltTextAssessment( {
			callbacks: {
				getResultTexts: ( { nonDescriptiveCount } ) => ( {
					nonDescriptive: `Custom: ${ nonDescriptiveCount } non-descriptive.`,
				} ),
			},
		} );
		const result = callbackAssessment.getResult(
			new Paper( "" ),
			Factory.buildMockResearcher( { nonDescriptiveAltText: { count: 4, flagged: [] } }, true )
		);

		expect( result.getText() ).toBe( "Custom: 4 non-descriptive." );
	} );

	it( "passes the count and the anchors to a custom callback", () => {
		const getResultTexts = jest.fn().mockReturnValue( { nonDescriptive: "x" } );
		const callbackAssessment = new NonDescriptiveAltTextAssessment( { callbacks: { getResultTexts } } );

		callbackAssessment.getResult(
			new Paper( "" ),
			Factory.buildMockResearcher( { nonDescriptiveAltText: { count: 2, flagged: [] } }, true )
		);

		expect( getResultTexts ).toHaveBeenCalledWith( {
			urlTitleAnchorOpeningTag: titleAnchor,
			urlActionAnchorOpeningTag: actionAnchor,
			nonDescriptiveCount: 2,
		} );
	} );
} );

describe( "the images the non-descriptive alt text assessment flags", () => {
	it( "reports the identifiers the research found, so a consumer can point at those images", () => {
		const result = getResult( 3, [ 8, 12, 9 ] );

		expect( result.getFlaggedItems() ).toEqual( [ 8, 12, 9 ] );
	} );

	it( "reports nothing when no image is flagged", () => {
		const result = getResult( 0 );

		expect( result.getFlaggedItems() ).toEqual( [] );
	} );
} );
