import DuplicateAltTextAssessment from "../../../../src/scoring/assessments/seo/DuplicateAltTextAssessment";
import Paper from "../../../../src/values/Paper.js";
import Factory from "../../../../src/helpers/factory.js";

const assessment = new DuplicateAltTextAssessment();
const titleAnchor = "<a href='https://yoa.st/duplicate-alt-text' target='_blank'>";
const actionAnchor = "<a href='https://yoa.st/duplicate-alt-text-cta' target='_blank'>";

/**
 * Runs an assessment against a mocked `duplicateAltText` research.
 *
 * @param {number} duplicateCount The number of images that share their alt text with another image.
 * @param {DuplicateAltTextAssessment} [assessmentToRun] The assessment to run.
 *
 * @returns {AssessmentResult} The result of the assessment.
 */
const getResult = ( duplicateCount, assessmentToRun = assessment ) => assessmentToRun.getResult(
	new Paper( "" ),
	Factory.buildMockResearcher( { duplicateAltText: duplicateCount }, true )
);

describe( "an assessment for alt text shared by different images", () => {
	it( "returns no score and no text when no images share their alt text, so the assessment is not shown", () => {
		const result = getResult( 0 );

		expect( result.hasScore() ).toBe( false );
		expect( result.hasText() ).toBe( false );
	} );

	it( "gives orange feedback when two images share their alt text", () => {
		const result = getResult( 2 );

		expect( result.getScore() ).toBe( 6 );
		expect( result.getText() ).toBe(
			`${ titleAnchor }Duplicate alt text</a>: 2 of your images share the same alt text with another image. ` +
			`${ actionAnchor }Make sure each image has unique alt text</a>.`
		);
	} );

	it( "reports the number of images it is given", () => {
		expect( getResult( 5 ).getText() ).toContain( "5 of your images share the same alt text with another image." );
	} );

	it( "uses the score from the config", () => {
		expect( getResult( 2, new DuplicateAltTextAssessment( { scores: { okay: 3 } } ) ).getScore() ).toBe( 3 );
	} );
} );

describe( "the feedback strings of the duplicate alt text assessment", () => {
	it( "returns the custom feedback string when a callback is provided", () => {
		const callbackAssessment = new DuplicateAltTextAssessment( {
			callbacks: {
				getResultTexts: ( { duplicateCount } ) => ( { duplicate: `Custom: ${ duplicateCount } duplicates.` } ),
			},
		} );

		expect( getResult( 3, callbackAssessment ).getText() ).toBe( "Custom: 3 duplicates." );
	} );

	it( "passes the count and the anchors to a custom callback", () => {
		const getResultTexts = jest.fn().mockReturnValue( { duplicate: "x" } );

		getResult( 4, new DuplicateAltTextAssessment( { callbacks: { getResultTexts } } ) );

		expect( getResultTexts ).toHaveBeenCalledWith( {
			urlTitleAnchorOpeningTag: titleAnchor,
			urlActionAnchorOpeningTag: actionAnchor,
			duplicateCount: 4,
		} );
	} );
} );
