import AssessmentResult from '../../src/values/AssessmentResult.js';

describe( "a result of an assessment", function() {
	it( "should receive a text and a score in the constructor", function() {
		var assessmentResult = new AssessmentResult( {
			score: 9,
			text: "The text",
		} );

		expect( assessmentResult.getScore() ).toBe( 9 );
		expect( assessmentResult.getText() ).toBe( "The text" );
	} );
} );

describe( "creating a new empty assessmentResult", function() {
	it( "returns an assessmentResult", function() {
		var assessmentResult = new AssessmentResult();
		expect( assessmentResult.hasScore() ).toBe( false );
		expect( assessmentResult.getScore() ).toBe( 0 );
		expect( assessmentResult.hasText() ).toBe( false );
		expect( assessmentResult.getText() ).toBe( "" );
	} );
} );

describe( "creating a new empty assessmentResult", function() {
	it( "returns an assessmentResult", function() {
		var assessmentResult = new AssessmentResult();
		assessmentResult.setScore( 6 );
		assessmentResult.setText( "this is text" );
		expect( assessmentResult.hasScore() ).toBe( true );
		expect( assessmentResult.getScore() ).toBe( 6 );
		expect( assessmentResult.hasText() ).toBe( true );
		expect( assessmentResult.getText() ).toBe( "this is text" );
	} );
} );

describe( "AssessmentResult", function() {
	describe( "getIdentifier", function() {
		it( "defaults to an empty string", function() {
			var result = new AssessmentResult();

			expect( result.getIdentifier() ).toBe( "" );
		} );

		it( "returns the previously set identifier", function() {
			var result = new AssessmentResult();

			result.setIdentifier( "identifier" );

			expect( result.getIdentifier() ).toBe( "identifier" );
		} );
	} );

	describe( "getMarker", function() {
		it( "default to an empty function", function() {
			var result = new AssessmentResult();

			expect( result.getMarker() ).toBeDefined();
			expect( result.getMarker()() ).toEqual( [] );
		} );

		it( "returns the previously set marker", function() {
			var result = new AssessmentResult();
			var marker = function() {};

			result.setMarker( marker );

			expect( result.getMarker() ).toBe( marker );
		} );
	} );
} );
