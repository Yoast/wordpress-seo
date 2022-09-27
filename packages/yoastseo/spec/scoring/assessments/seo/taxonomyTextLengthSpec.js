import Paper from "../../../../src/values/Paper.js";
import Factory from "../../../specHelpers/factory.js";
import { getTextLengthAssessment } from "../../../../src/scoring/taxonomyAssessor";

describe( "A taxonomy page text length assessment.", function() {
	let assessment;

	beforeEach( () => {
		// Taxonomy assessor has a text length assessment with specific boundaries.
		assessment = getTextLengthAssessment();
	} );

	it( "assesses a single word", function() {
		const mockPaper = new Paper( "sample" );
		const result = assessment.getResult( mockPaper, Factory.buildMockResearcher( { count: 1, unit: "word" } ) );

		expect( result.getScore() ).toEqual( -20 );
		expect( result.getText() ).toEqual( "<a href='https://yoa.st/34j' target='_blank'>Text length</a>: The text contains 1 word. " +
			"This is far below the recommended minimum of 250 words. <a href='https://yoa.st/34k' target='_blank'>Add more content</a>." );
	} );

	it( "assesses a couple of words", function() {
		const mockPaper = new Paper( "sample" );
		const result = assessment.getResult( mockPaper, Factory.buildMockResearcher( { count: 5, unit: "word" } ) );

		expect( result.getScore() ).toEqual( -20 );
		expect( result.getText() ).toEqual( "<a href='https://yoa.st/34j' target='_blank'>Text length</a>: The text contains 5 words. " +
			"This is far below the recommended minimum of 250 words. <a href='https://yoa.st/34k' target='_blank'>Add more content</a>." );
	} );

	it( "assesses words far below the minimum.", function() {
		const mockPaper = new Paper( "sample" );
		const result = assessment.getResult( mockPaper, Factory.buildMockResearcher( { count: 51, unit: "word" } ) );

		expect( result.getScore() ).toEqual( -10 );
		expect( result.getText() ).toEqual( "<a href='https://yoa.st/34j' target='_blank'>Text length</a>: The text contains 51 words. " +
			"This is far below the recommended minimum of 250 words. <a href='https://yoa.st/34k' target='_blank'>Add more content</a>." );
	} );

	it( "assesses words below the minimum.", function() {
		const mockPaper = new Paper( "sample" );
		const result = assessment.getResult( mockPaper, Factory.buildMockResearcher( { count: 101, unit: "word" } ) );

		expect( result.getScore() ).toEqual( 3 );
		expect( result.getText() ).toEqual( "<a href='https://yoa.st/34j' target='_blank'>Text length</a>: The text contains 101 words. " +
			"This is below the recommended minimum of 250 words. <a href='https://yoa.st/34k' target='_blank'>Add more content</a>." );
	} );

	it( "assesses words slightly below the minimum.", function() {
		const mockPaper = new Paper( "sample" );
		const result = assessment.getResult( mockPaper, Factory.buildMockResearcher( { count: 201, unit: "word" } ) );

		expect( result.getScore() ).toEqual( 6 );
		expect( result.getText() ).toEqual( "<a href='https://yoa.st/34j' target='_blank'>Text length</a>: The text contains 201 words. " +
			"This is slightly below the recommended minimum of 250 words. <a href='https://yoa.st/34k' target='_blank'>Add a bit more copy</a>." );
	} );

	it( "assesses words above the minimum.", function() {
		const mockPaper = new Paper( "sample" );
		const result = assessment.getResult( mockPaper, Factory.buildMockResearcher( { count: 251, unit: "word" } ) );

		expect( result.getScore() ).toEqual( 9 );
		expect( result.getText() ).toEqual( "<a href='https://yoa.st/34j' target='_blank'>Text length</a>: The text contains 251 words. Good job!" );
	} );
} );
