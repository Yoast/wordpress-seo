import TextLengthAssessment from "../../../../src/scoring/assessments/seo/TextLengthAssessment.js";
import Paper from "../../../../src/values/Paper.js";
import Factory from "../../../specHelpers/factory.js";

const wordCountAssessment = new TextLengthAssessment();

describe( "A word count assessment", function() {
	it( "assesses a single word", function() {
		const mockPaper = new Paper( "sample" );
		const assessment = wordCountAssessment.getResult( mockPaper, Factory.buildMockResearcher( 1 ) );

		expect( assessment.getScore() ).toEqual( -20 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34n' target='_blank'>Text length</a>: " +
			"The text contains 1 word. This is far below the recommended minimum of 300 words. <a href='https://yoa.st/34o' " +
			"target='_blank'>Add more content</a>." );
	} );

	it( "assesses a low word count", function() {
		const mockPaper = new Paper( "These are just five words" );
		const assessment = wordCountAssessment.getResult( mockPaper, Factory.buildMockResearcher( 5 ) );

		expect( assessment.getScore() ).toEqual( -20 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34n' target='_blank'>Text length</a>: " +
			"The text contains 5 words. This is far below the recommended minimum of 300 words. <a href='https://yoa.st/34o' " +
			"target='_blank'>Add more content</a>." );
	} );

	it( "assesses a medium word count", function() {
		const mockPaper = new Paper( Factory.buildMockString( "Sample ", 150 ) );
		const assessment = wordCountAssessment.getResult( mockPaper, Factory.buildMockResearcher( 150 ) );

		expect( assessment.getScore() ).toEqual( -10 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34n' target='_blank'>Text length</a>: " +
			"The text contains 150 words. This is far below the recommended minimum of 300 words. <a href='https://yoa.st/34o' " +
			"target='_blank'>Add more content</a>." );
	} );

	it( "assesses a slightly higher than medium word count", function() {
		const mockPaper = new Paper( Factory.buildMockString( "Sample ", 225 ) );
		const assessment = wordCountAssessment.getResult( mockPaper, Factory.buildMockResearcher( 225 ) );

		expect( assessment.getScore() ).toEqual( 3 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34n' target='_blank'>Text length</a>: " +
			"The text contains 225 words. This is below the recommended minimum of 300 words. <a href='https://yoa.st/34o' " +
			"target='_blank'>Add more content</a>." );
	} );

	it( "assesses an almost at the recommended amount, word count", function() {
		const mockPaper = new Paper( Factory.buildMockString( "Sample ", 275 ) );
		const assessment = wordCountAssessment.getResult( mockPaper, Factory.buildMockResearcher( 275 ) );

		expect( assessment.getScore() ).toEqual( 6 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34n' target='_blank'>Text length</a>: " +
			"The text contains 275 words. This is slightly below the recommended minimum of 300 words. <a href='https://yoa.st/34o' " +
			"target='_blank'>Add a bit more copy</a>." );
	} );


	it( "assesses high word count", function() {
		const mockPaper = new Paper( Factory.buildMockString( "Sample ", 325 ) );
		const assessment = wordCountAssessment.getResult( mockPaper, Factory.buildMockResearcher( 325 ) );

		expect( assessment.getScore() ).toEqual( 9 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/34n' target='_blank'>Text length</a>: " +
			"The text contains 325 words. Good job!" );
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

		const results = assessmentCornerstone.getResult( mockPaper, Factory.buildMockResearcher( 25 ) );

		expect( results.getScore() ).toEqual( -20 );
		expect( results.getText() ).toEqual( "<a href='https://yoa.st/34n' target='_blank'>Text length</a>: " +
			"The text contains 25 words. This is far below the recommended minimum of 900 words. <a href='https://yoa.st/34o' " +
			"target='_blank'>Add more content</a>." );
	} );

	it( "different boundaries are applied if the content is cornerstone: far below minimum", function() {
		const mockPaper = new Paper( Factory.buildMockString( "Sample ", 125 ) );
		const assessmentCornerstone = new TextLengthAssessment( cornerstoneConfig );

		const results = assessmentCornerstone.getResult( mockPaper, Factory.buildMockResearcher( 125 ) );

		expect( results.getScore() ).toEqual( -20 );
		expect( results.getText() ).toEqual( "<a href='https://yoa.st/34n' target='_blank'>Text length</a>: " +
			"The text contains 125 words. This is far below the recommended minimum of 900 words. <a href='https://yoa.st/34o' " +
			"target='_blank'>Add more content</a>." );
	} );

	it( "different boundaries are applied if the content is cornerstone: below minimum", function() {
		const mockPaper = new Paper( Factory.buildMockString( "Sample ", 325 ) );
		const assessmentCornerstone = new TextLengthAssessment( cornerstoneConfig );

		const results = assessmentCornerstone.getResult( mockPaper, Factory.buildMockResearcher( 325 ) );

		expect( results.getScore() ).toEqual( -20 );
		expect( results.getText() ).toEqual( "<a href='https://yoa.st/34n' target='_blank'>Text length</a>: " +
			"The text contains 325 words. This is below the recommended minimum of 900 words. <a href='https://yoa.st/34o' " +
			"target='_blank'>Add more content</a>." );
	} );

	it( "different boundaries are applied if the content is cornerstone: slightly below minimum", function() {
		const mockPaper = new Paper( Factory.buildMockString( "Sample ", 425 ) );
		const assessmentCornerstone = new TextLengthAssessment( cornerstoneConfig );

		const results = assessmentCornerstone.getResult( mockPaper, Factory.buildMockResearcher( 425 ) );

		expect( results.getScore() ).toEqual( 6 );
		expect( results.getText() ).toEqual( "<a href='https://yoa.st/34n' target='_blank'>Text length</a>: " +
			"The text contains 425 words. This is below the recommended minimum of 900 words. <a href='https://yoa.st/34o' " +
			"target='_blank'>Add more content</a>." );
	} );

	it( "different boundaries are applied if the content is cornerstone: above minimum", function() {
		const mockPaper = new Paper( Factory.buildMockString( "Sample ", 925 ) );
		const assessmentCornerstone = new TextLengthAssessment( cornerstoneConfig );

		const results = assessmentCornerstone.getResult( mockPaper, Factory.buildMockResearcher( 925 ) );

		expect( results.getScore() ).toEqual( 9 );
		expect( results.getText() ).toEqual( "<a href='https://yoa.st/34n' target='_blank'>Text length</a>: The text contains 925 words. Good job!" );
	} );

	const productPageConfig = {
		recommendedMinimum: 200,
		slightlyBelowMinimum: 150,
		belowMinimum: 100,
		veryFarBelowMinimum: 50,
	};

	it( "different boundaries are applied for a product page: very far below minimum", function() {
		const mockPaper = new Paper( Factory.buildMockString( "Sample ", 25 ) );
		const productAssessment = new TextLengthAssessment( productPageConfig );

		const result = productAssessment.getResult( mockPaper, Factory.buildMockResearcher( 25 ) );

		expect( result.getScore() ).toEqual( -20 );
		expect( result.getText() ).toEqual( "<a href='https://yoa.st/34n' target='_blank'>Text length</a>: " +
			"The text contains 25 words. This is far below the recommended minimum of 200 words. <a href='https://yoa.st/34o' " +
			"target='_blank'>Add more content</a>." );
	} );

	it( "different boundaries are applied for a product page: far below minimum", function() {
		const mockPaper = new Paper( Factory.buildMockString( "Sample ", 55 ) );
		const productAssessment = new TextLengthAssessment( productPageConfig );

		const result = productAssessment.getResult( mockPaper, Factory.buildMockResearcher( 55 ) );

		expect( result.getScore() ).toEqual( -10 );
		expect( result.getText() ).toEqual( "<a href='https://yoa.st/34n' target='_blank'>Text length</a>: " +
			"The text contains 55 words. This is far below the recommended minimum of 200 words. <a href='https://yoa.st/34o' " +
			"target='_blank'>Add more content</a>." );
	} );

	it( "different boundaries are applied for a product page: below minimum", function() {
		const mockPaper = new Paper( Factory.buildMockString( "Sample ", 101 ) );
		const productAssessment = new TextLengthAssessment( productPageConfig );

		const result = productAssessment.getResult( mockPaper, Factory.buildMockResearcher( 101 ) );

		expect( result.getScore() ).toEqual( 3 );
		expect( result.getText() ).toEqual( "<a href='https://yoa.st/34n' target='_blank'>Text length</a>: " +
			"The text contains 101 words. This is below the recommended minimum of 200 words. <a href='https://yoa.st/34o' " +
			"target='_blank'>Add more content</a>." );
	} );

	it( "different boundaries are applied for a product page: slightly below minimum", function() {
		const mockPaper = new Paper( Factory.buildMockString( "Sample ", 155 ) );
		const productAssessment = new TextLengthAssessment( productPageConfig );

		const result = productAssessment.getResult( mockPaper, Factory.buildMockResearcher( 155 ) );

		expect( result.getScore() ).toEqual( 6 );
		expect( result.getText() ).toEqual( "<a href='https://yoa.st/34n' target='_blank'>Text length</a>: " +
			"The text contains 155 words. This is slightly below the recommended minimum of 200 words." +
			" <a href='https://yoa.st/34o' target='_blank'>Add a bit more copy</a>." );
	} );


	it( "different boundaries are applied for a product page: above minimum", function() {
		const mockPaper = new Paper( Factory.buildMockString( "Sample ", 201 ) );
		const productAssessment = new TextLengthAssessment( productPageConfig );

		const result = productAssessment.getResult( mockPaper, Factory.buildMockResearcher( 201 ) );

		expect( result.getScore() ).toEqual( 9 );
		expect( result.getText() ).toEqual( "<a href='https://yoa.st/34n' target='_blank'>Text length</a>: " +
			"The text contains 201 words. Good job!" );
	} );

	const cornerstoneProductPageConfig = {
		recommendedMinimum: 400,
		slightlyBelowMinimum: 300,
		belowMinimum: 200,

		scores: {
			belowMinimum: -20,
			farBelowMinimum: -20,
		},

		cornerstoneContent: true,
	};

	it( "different boundaries are applied for a product pagge if the content is cornerstone: very far below minimum", function() {
		const mockPaper = new Paper( Factory.buildMockString( "Sample ", 25 ) );
		const productAssessmentCornerstone = new TextLengthAssessment( cornerstoneProductPageConfig );

		const results = productAssessmentCornerstone.getResult( mockPaper, Factory.buildMockResearcher( 25 ) );

		expect( results.getScore() ).toEqual( -20 );
		expect( results.getText() ).toEqual( "<a href='https://yoa.st/34n' target='_blank'>Text length</a>: " +
			"The text contains 25 words. This is far below the recommended minimum of 400 words. <a href='https://yoa.st/34o' " +
			"target='_blank'>Add more content</a>." );
	} );

	it( "different boundaries are applied if the content is cornerstone: far below minimum", function() {
		const mockPaper = new Paper( Factory.buildMockString( "Sample ", 190 ) );
		const productAssessmentCornerstone = new TextLengthAssessment( cornerstoneProductPageConfig );

		const results = productAssessmentCornerstone.getResult( mockPaper, Factory.buildMockResearcher( 75 ) );

		expect( results.getScore() ).toEqual( -20 );
		expect( results.getText() ).toEqual( "<a href='https://yoa.st/34n' target='_blank'>Text length</a>: " +
			"The text contains 75 words. This is far below the recommended minimum of 400 words. <a href='https://yoa.st/34o' " +
			"target='_blank'>Add more content</a>." );
	} );

	it( "different boundaries are applied if the content is cornerstone: below minimum", function() {
		const mockPaper = new Paper( Factory.buildMockString( "Sample ", 225 ) );
		const productAssessmentCornerstone = new TextLengthAssessment( cornerstoneProductPageConfig );

		const results = productAssessmentCornerstone.getResult( mockPaper, Factory.buildMockResearcher( 225 ) );

		expect( results.getScore() ).toEqual( -20 );
		expect( results.getText() ).toEqual( "<a href='https://yoa.st/34n' target='_blank'>Text length</a>: " +
			"The text contains 225 words. This is below the recommended minimum of 400 words. <a href='https://yoa.st/34o' " +
			"target='_blank'>Add more content</a>." );
	} );

	it( "different boundaries are applied if the content is cornerstone: slightly below minimum", function() {
		const mockPaper = new Paper( Factory.buildMockString( "Sample ", 380 ) );
		const productAssessmentCornerstone = new TextLengthAssessment( cornerstoneProductPageConfig );

		const results = productAssessmentCornerstone.getResult( mockPaper, Factory.buildMockResearcher( 380 ) );

		expect( results.getScore() ).toEqual( 6 );
		expect( results.getText() ).toEqual( "<a href='https://yoa.st/34n' target='_blank'>Text length</a>: " +
			"The text contains 380 words. This is below the recommended minimum of 400 words. <a href='https://yoa.st/34o' " +
			"target='_blank'>Add more content</a>." );
	} );

	it( "different boundaries are applied if the content is cornerstone: above minimum", function() {
		const mockPaper = new Paper( Factory.buildMockString( "Sample ", 425 ) );
		const productAssessmentCornerstone = new TextLengthAssessment( cornerstoneProductPageConfig );

		const results = productAssessmentCornerstone.getResult( mockPaper, Factory.buildMockResearcher( 425 ) );

		expect( results.getScore() ).toEqual( 9 );
		expect( results.getText() ).toEqual( "<a href='https://yoa.st/34n' target='_blank'>Text length</a>: The text contains 425 words. Good job!" );
	} );
} );
