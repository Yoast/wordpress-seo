import TextLengthAssessment from "../../src/languages/legacy/assessments/seo/TextLengthAssessment.js";
import Paper from "../../src/values/Paper.js";
import Factory from "../specHelpers/factory.js";
var i18n = Factory.buildJed();

const wordCountAssessment = new TextLengthAssessment();

describe( "A word count assessment", function() {
	it( "assesses a single word", function() {
		var mockPaper = new Paper( "sample" );
		var assessment = wordCountAssessment.getResult( mockPaper, Factory.buildMockResearcher( 1 ), i18n );

		expect( assessment.getScore() ).toEqual( -20 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34n' target='_blank'>Text length</a>: The text contains 1 word. This is far below the recommended minimum of 300 words. <a href='https://yoa.st/34o' target='_blank'>Add more content</a>." );
	} );

	it( "assesses a low word count", function() {
		var mockPaper = new Paper( "These are just five words" );
		var assessment = wordCountAssessment.getResult( mockPaper, Factory.buildMockResearcher( 5 ), i18n );

		expect( assessment.getScore() ).toEqual( -20 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34n' target='_blank'>Text length</a>: The text contains 5 words. This is far below the recommended minimum of 300 words. <a href='https://yoa.st/34o' target='_blank'>Add more content</a>." );
	} );

	it( "assesses a medium word count", function() {
		var mockPaper = new Paper( Factory.buildMockString( "Sample ", 150 ) );
		var assessment = wordCountAssessment.getResult( mockPaper, Factory.buildMockResearcher( 150 ), i18n );

		expect( assessment.getScore() ).toEqual( -10 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34n' target='_blank'>Text length</a>: The text contains 150 words. This is far below the recommended minimum of 300 words. <a href='https://yoa.st/34o' target='_blank'>Add more content</a>." );
	} );

	it( "assesses a slightly higher than medium word count", function() {
		var mockPaper = new Paper( Factory.buildMockString( "Sample ", 225 ) );
		var assessment = wordCountAssessment.getResult( mockPaper, Factory.buildMockResearcher( 225 ), i18n );

		expect( assessment.getScore() ).toEqual( 3 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34n' target='_blank'>Text length</a>: The text contains 225 words. This is below the recommended minimum of 300 words. <a href='https://yoa.st/34o' target='_blank'>Add more content</a>." );
	} );

	it( "assesses an almost at the recommended amount, word count", function() {
		var mockPaper = new Paper( Factory.buildMockString( "Sample ", 275 ) );
		var assessment = wordCountAssessment.getResult( mockPaper, Factory.buildMockResearcher( 275 ), i18n );

		expect( assessment.getScore() ).toEqual( 6 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34n' target='_blank'>Text length</a>: The text contains 275 words. This is slightly below the recommended minimum of 300 words. <a href='https://yoa.st/34o' target='_blank'>Add a bit more copy</a>." );
	} );


	it( "assesses high word count", function() {
		var mockPaper = new Paper( Factory.buildMockString( "Sample ", 325 ) );
		var assessment = wordCountAssessment.getResult( mockPaper, Factory.buildMockResearcher( 325 ), i18n );

		expect( assessment.getScore() ).toEqual( 9 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34n' target='_blank'>Text length</a>: The text contains 325 words. Good job!" );
	} );

	const cornerstoneConfig = {
		recommendedMinimum: 900,
		slightlyBelowMinimum: 400,
		belowMinimum: 300,

		scores: {
			belowMinimum: -20,
			farBelowMinimum: -20,
		},

		cornerstoneContent: true,
	};

	it( "different boundaries are applied if the content is cornerstone: very far below minimum", function() {
		const mockPaper = new Paper( Factory.buildMockString( "Sample ", 25 ) );
		const assessmentCornerstone = new TextLengthAssessment( cornerstoneConfig );

		const results = assessmentCornerstone.getResult( mockPaper, Factory.buildMockResearcher( 25 ), i18n );

		expect( results.getScore() ).toEqual( -20 );
		expect( results.getText() ).toEqual( "<a href='https://yoa.st/34n' target='_blank'>Text length</a>: The text contains 25 words. This is far below the recommended minimum of 900 words. <a href='https://yoa.st/34o' target='_blank'>Add more content</a>." );
	} );

	it( "different boundaries are applied if the content is cornerstone: far below minimum", function() {
		const mockPaper = new Paper( Factory.buildMockString( "Sample ", 125 ) );
		const assessmentCornerstone = new TextLengthAssessment( cornerstoneConfig );

		const results = assessmentCornerstone.getResult( mockPaper, Factory.buildMockResearcher( 125 ), i18n );

		expect( results.getScore() ).toEqual( -20 );
		expect( results.getText() ).toEqual( "<a href='https://yoa.st/34n' target='_blank'>Text length</a>: The text contains 125 words. This is far below the recommended minimum of 900 words. <a href='https://yoa.st/34o' target='_blank'>Add more content</a>." );
	} );

	it( "different boundaries are applied if the content is cornerstone: below minimum", function() {
		const mockPaper = new Paper( Factory.buildMockString( "Sample ", 325 ) );
		const assessmentCornerstone = new TextLengthAssessment( cornerstoneConfig );

		const results = assessmentCornerstone.getResult( mockPaper, Factory.buildMockResearcher( 325 ), i18n );

		expect( results.getScore() ).toEqual( -20 );
		expect( results.getText() ).toEqual( "<a href='https://yoa.st/34n' target='_blank'>Text length</a>: The text contains 325 words. This is below the recommended minimum of 900 words. <a href='https://yoa.st/34o' target='_blank'>Add more content</a>." );
	} );

	it( "different boundaries are applied if the content is cornerstone: slightly below minimum", function() {
		const mockPaper = new Paper( Factory.buildMockString( "Sample ", 425 ) );
		const assessmentCornerstone = new TextLengthAssessment( cornerstoneConfig );

		const results = assessmentCornerstone.getResult( mockPaper, Factory.buildMockResearcher( 425 ), i18n );

		expect( results.getScore() ).toEqual( 6 );
		expect( results.getText() ).toEqual( "<a href='https://yoa.st/34n' target='_blank'>Text length</a>: The text contains 425 words. This is below the recommended minimum of 900 words. <a href='https://yoa.st/34o' target='_blank'>Add more content</a>." );
	} );

	it( "different boundaries are applied if the content is cornerstone: above minimum", function() {
		const mockPaper = new Paper( Factory.buildMockString( "Sample ", 925 ) );
		const assessmentCornerstone = new TextLengthAssessment( cornerstoneConfig );

		const results = assessmentCornerstone.getResult( mockPaper, Factory.buildMockResearcher( 925 ), i18n );

		expect( results.getScore() ).toEqual( 9 );
		expect( results.getText() ).toEqual( "<a href='https://yoa.st/34n' target='_blank'>Text length</a>: The text contains 925 words. Good job!" );
	} );
} );
