import AssessmentResult from "../../src/values/AssessmentResult.js";
import { noop } from "lodash";

describe( "a result of an assessment", function() {
	it( "should receive a text and a score in the constructor", function() {
		const assessmentResult = new AssessmentResult( {
			score: 9,
			text: "The text",
		} );

		expect( assessmentResult.getScore() ).toBe( 9 );
		expect( assessmentResult.getText() ).toBe( "The text" );
	} );
} );

describe( "creating a new empty assessmentResult", function() {
	it( "returns an assessmentResult", function() {
		const assessmentResult = new AssessmentResult();
		expect( assessmentResult.hasScore() ).toBe( false );
		expect( assessmentResult.getScore() ).toBe( 0 );
		expect( assessmentResult.hasText() ).toBe( false );
		expect( assessmentResult.getText() ).toBe( "" );
		expect( assessmentResult.hasBetaBadge() ).toBe( false );
		expect( assessmentResult.hasJumps() ).toBe( false );
		expect( assessmentResult.hasAIFixes() ).toBe( false );
		expect( assessmentResult.hasEditFieldName() ).toBe( false );
		expect( assessmentResult.getEditFieldName() ).toBe( "" );
	} );
} );

describe( "creating a new empty assessmentResult", function() {
	it( "returns an assessmentResult", function() {
		const assessmentResult = new AssessmentResult();
		assessmentResult.setScore( 6 );
		assessmentResult.setText( "this is text" );
		expect( assessmentResult.hasScore() ).toBe( true );
		expect( assessmentResult.getScore() ).toBe( 6 );
		expect( assessmentResult.hasText() ).toBe( true );
		expect( assessmentResult.getText() ).toBe( "this is text" );
		expect( assessmentResult.hasBetaBadge() ).toBe( false );
		expect( assessmentResult.hasJumps() ).toBe( false );
		expect( assessmentResult.hasEditFieldName() ).toBe( false );
		expect( assessmentResult.getEditFieldName() ).toBe( "" );
	} );
} );

describe( "AssessmentResult", function() {
	describe( "getIdentifier", function() {
		it( "defaults to an empty string", function() {
			const result = new AssessmentResult();

			expect( result.getIdentifier() ).toBe( "" );
		} );

		it( "returns the previously set identifier", function() {
			const result = new AssessmentResult();

			result.setIdentifier( "identifier" );

			expect( result.getIdentifier() ).toBe( "identifier" );
		} );
	} );

	describe( "getMarker", function() {
		it( "default to an empty function", function() {
			const result = new AssessmentResult();

			expect( result.getMarker() ).toBeDefined();
			expect( result.getMarker()() ).toEqual( [] );
		} );

		it( "returns the previously set marker", function() {
			const result = new AssessmentResult();
			const marker = noop;

			result.setMarker( marker );

			expect( result.getMarker() ).toBe( marker );
		} );
	} );

	describe( "getEditFieldName", function() {
		it( "default to an empty string", function() {
			const result = new AssessmentResult();

			expect( result.getEditFieldName() ).toBeDefined();
			expect( result.getEditFieldName() ).toEqual( "" );
		} );

		it( "returns the previously set edit field name", function() {
			const result = new AssessmentResult();

			result.setEditFieldName( "keyphrase" );

			expect( result.getEditFieldName() ).toBe( "keyphrase" );
		} );
	} );

	describe( "setHasBetaBadge", function() {
		it( "defaults to false", function() {
			const result = new AssessmentResult();

			expect( result.hasBetaBadge() ).toBe( false );
		} );

		it( "sets the value to true", function() {
			const result = new AssessmentResult();

			result.setHasBetaBadge( true );

			expect( result.hasBetaBadge() ).toBe( true );
		} );
	} );

	describe( "setHasJumps", function() {
		it( "defaults to false", function() {
			const result = new AssessmentResult();

			expect( result.hasJumps() ).toBe( false );
		} );

		it( "sets the value to true", function() {
			const result = new AssessmentResult();

			result.setHasJumps( true );

			expect( result.hasJumps() ).toBe( true );
		} );
	} );

	describe( "setHasAIFixes", function() {
		it( "defaults to false", function() {
			const result = new AssessmentResult();

			expect( result.hasAIFixes() ).toBe( false );
		} );

		it( "sets the value to true", function() {
			const result = new AssessmentResult();

			result.setHasAIFixes( true );

			expect( result.hasAIFixes() ).toBe( true );
		} );
	} );
} );
