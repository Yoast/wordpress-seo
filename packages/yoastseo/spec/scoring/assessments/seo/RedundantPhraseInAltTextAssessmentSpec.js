import RedundantPhraseInAltTextAssessment from "../../../../src/scoring/assessments/seo/RedundantPhraseInAltTextAssessment";
import Paper from "../../../../src/values/Paper.js";
import Factory from "../../../../src/helpers/factory.js";

const assessment = new RedundantPhraseInAltTextAssessment();
const titleAnchor = "<a href='https://yoa.st/redundant-phrase-in-alt-text' target='_blank'>";
const actionAnchor = "<a href='https://yoa.st/redundant-phrase-in-alt-text-cta' target='_blank'>";

/**
 * Runs the assessment against a mocked `redundantPhraseInAltText` research.
 *
 * @param {number} count The number of images whose alt text contains a redundant phrase.
 * @param {Array<string|number>} [flagged] The identifiers of those images.
 *
 * @returns {AssessmentResult} The result of the assessment.
 */
const getResult = ( count, flagged = [] ) => assessment.getResult(
	new Paper( "" ),
	Factory.buildMockResearcher( { redundantPhraseInAltText: { count, flagged } }, true )
);

describe( "an assessment for alt text containing a redundant phrase", () => {
	it( "returns no score and no text when no alt text contains a redundant phrase, so the assessment is not shown", () => {
		const result = getResult( 0 );

		expect( result.hasScore() ).toBe( false );
		expect( result.hasText() ).toBe( false );
	} );

	it( "gives feedback when one image has alt text containing a redundant phrase", () => {
		const result = getResult( 1 );

		expect( result.getScore() ).toBe( 6 );
		expect( result.getText() ).toBe(
			`${ titleAnchor }Redundant phrase in alt text</a>: 1 of your images has alt text with a phrase like "Image of" or similar. ` +
			`${ actionAnchor }Remove it as screen readers already announce that it's an image. ` +
			"You may keep phrases that describe the type of image (e.g. “photograph”, “illustration”, “screenshot”) " +
			"if the type is worth pointing out</a>."
		);
	} );

	it( "gives feedback when several images have alt text containing a redundant phrase", () => {
		const result = getResult( 3 );

		expect( result.getScore() ).toBe( 6 );
		expect( result.getText() ).toBe(
			`${ titleAnchor }Redundant phrase in alt text</a>: 3 of your images have alt text with a phrase like "Image of" or similar. ` +
			`${ actionAnchor }Remove it as screen readers already announce that it's an image. ` +
			"You may keep phrases that describe the type of image (e.g. “photograph”, “illustration”, “screenshot”) " +
			"if the type is worth pointing out</a>."
		);
	} );

	it( "uses the score from the config", () => {
		const configuredAssessment = new RedundantPhraseInAltTextAssessment( { scores: { okay: 3 } } );
		const result = configuredAssessment.getResult(
			new Paper( "" ),
			Factory.buildMockResearcher( { redundantPhraseInAltText: { count: 1, flagged: [] } }, true )
		);

		expect( result.getScore() ).toBe( 3 );
	} );
} );

describe( "the feedback strings of the redundant phrase in alt text assessment", () => {
	it( "returns the custom feedback string when a callback is provided", () => {
		const callbackAssessment = new RedundantPhraseInAltTextAssessment( {
			callbacks: {
				getResultTexts: ( { redundantPhraseCount } ) => ( {
					redundantPhrase: `Custom: ${ redundantPhraseCount } redundant.`,
				} ),
			},
		} );
		const result = callbackAssessment.getResult(
			new Paper( "" ),
			Factory.buildMockResearcher( { redundantPhraseInAltText: { count: 4, flagged: [] } }, true )
		);

		expect( result.getText() ).toBe( "Custom: 4 redundant." );
	} );

	it( "passes the count and the anchors to a custom callback", () => {
		const getResultTexts = jest.fn().mockReturnValue( { redundantPhrase: "x" } );
		const callbackAssessment = new RedundantPhraseInAltTextAssessment( { callbacks: { getResultTexts } } );

		callbackAssessment.getResult(
			new Paper( "" ),
			Factory.buildMockResearcher( { redundantPhraseInAltText: { count: 2, flagged: [] } }, true )
		);

		expect( getResultTexts ).toHaveBeenCalledWith( {
			urlTitleAnchorOpeningTag: titleAnchor,
			urlActionAnchorOpeningTag: actionAnchor,
			redundantPhraseCount: 2,
		} );
	} );
} );

describe( "the images the redundant phrase in alt text assessment flags", () => {
	it( "reports the identifiers the research found, so a consumer can point at those images", () => {
		const result = getResult( 3, [ 8, 12, 9 ] );

		expect( result.getFlaggedItems() ).toEqual( [ 8, 12, 9 ] );
	} );

	it( "reports nothing when no image is flagged", () => {
		const result = getResult( 0 );

		expect( result.getFlaggedItems() ).toEqual( [] );
	} );
} );
