import taxonomyTextLengthAssessment from "../../../../src/scoring/assessments/seo/taxonomyTextLengthAssessment.js";
import Paper from "../../../../src/values/Paper.js";
import Factory from "../../../specHelpers/factory.js";
const i18n = Factory.buildJed();

describe( "A word count assessment", function() {
	beforeEach( () => {
		console.warn = jest.fn();
	} );

	it( "assesses a single word", function() {
		const mockPaper = new Paper( "sample" );
		const assessment = taxonomyTextLengthAssessment.getResult( mockPaper, Factory.buildMockResearcher( 1 ), i18n );

		expect( assessment.getScore() ).toEqual( -20 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34j' target='_blank'>Text length</a>: The text contains 1 word. " +
			"This is far below the recommended minimum of 150 words. <a href='https://yoa.st/34k' target='_blank'>Add more content</a>." );
	} );

	it( "assesses a low word count", function() {
		const mockPaper = new Paper( "These are just five words" );
		const assessment = taxonomyTextLengthAssessment.getResult( mockPaper, Factory.buildMockResearcher( 5 ), i18n );

		expect( assessment.getScore() ).toEqual( -20 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34j' target='_blank'>Text length</a>: " +
			"The text contains 5 words. This is far below the recommended minimum of 150 words. " +
			"<a href='https://yoa.st/34k' target='_blank'>Add more content</a>." );
	} );

	it( "assesses a medium word count", function() {
		const mockPaper = new Paper( Factory.buildMockString( "Sample ", 90 ) );
		const assessment = taxonomyTextLengthAssessment.getResult( mockPaper, Factory.buildMockResearcher( 90 ), i18n );

		expect( assessment.getScore() ).toEqual( -10 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34j' target='_blank'>Text length</a>: The text contains 90 words. " +
			"This is below the recommended minimum of 150 words. <a href='https://yoa.st/34k' target='_blank'>Add more content</a>." );
	} );

	it( "assesses a slightly higher than medium word count", function() {
		const mockPaper = new Paper( Factory.buildMockString( "Sample ", 110 ) );
		const assessment = taxonomyTextLengthAssessment.getResult( mockPaper, Factory.buildMockResearcher( 110 ), i18n );

		expect( assessment.getScore() ).toEqual( 5 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34j' target='_blank'>Text length</a>: " +
			"The text contains 110 words. This is below the recommended minimum of 150 words. " +
			"<a href='https://yoa.st/34k' target='_blank'>Add more content</a>." );
	} );

	it( "assesses an almost at the recommended amount, word count", function() {
		const mockPaper = new Paper( Factory.buildMockString( "Sample ", 130 ) );
		const assessment = taxonomyTextLengthAssessment.getResult( mockPaper, Factory.buildMockResearcher( 130 ), i18n );

		expect( assessment.getScore() ).toEqual( 7 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34j' target='_blank'>Text length</a>: The text contains 130 words. " +
			"This is slightly below the recommended minimum of 150 words. " +
			"<a href='https://yoa.st/34k' target='_blank'>Add a bit more copy</a>." );
	} );

	it( "assesses high word count", function() {
		const mockPaper = new Paper( Factory.buildMockString( "Sample ", 175 ) );
		const assessment = taxonomyTextLengthAssessment.getResult( mockPaper, Factory.buildMockResearcher( 175 ), i18n );

		expect( assessment.getScore() ).toEqual( 9 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34j' target='_blank'>Text length</a>: " +
			"The text contains 175 words. Good job!" );
	} );

	it( "shows a deprecation warning when the assessment is called", () => {
		const mockPaper = new Paper( "Some paper" );
		taxonomyTextLengthAssessment.getResult(
			mockPaper,
			Factory.buildMockResearcher( 200 ),
			i18n
		);

		expect( console.warn ).toBeCalled();
	} );
} );
