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

	describe( "isBeta", function() {
		it( "defaults to false", function() {
			const result = new AssessmentResult();

			expect( result.isBeta() ).toBe( false );
		} );

		it( "mirrors the beta-badge value (the neutral replacement for hasBetaBadge)", function() {
			const result = new AssessmentResult();

			result.setHasBetaBadge( true );

			expect( result.isBeta() ).toBe( true );
		} );
	} );

	describe( "isOptimizable", function() {
		it( "defaults to false", function() {
			const result = new AssessmentResult();

			expect( result.isOptimizable() ).toBe( false );
		} );

		it( "mirrors the AI-fixes value (the neutral replacement for hasAIFixes)", function() {
			const result = new AssessmentResult();

			result.setHasAIFixes( true );

			expect( result.isOptimizable() ).toBe( true );
		} );
	} );

	/*
	 * The "noticed" bookkeeping is module-level state, so each case requires its own fresh copy of the module:
	 * the getters have already spent their once-per-session notice on the instance imported at the top of this file.
	 */
	describe( "the deprecation notice on the renamed getters", function() {
		let FreshAssessmentResult;
		let warnSpy;

		beforeEach( function() {
			jest.isolateModules( function() {
				FreshAssessmentResult = require( "../../src/values/AssessmentResult.js" ).default;
			} );

			warnSpy = jest.spyOn( console, "warn" ).mockImplementation( noop );
		} );

		afterEach( function() {
			warnSpy.mockRestore();
		} );

		it( "warns once per session for hasAIFixes, not once per call or per result", function() {
			new FreshAssessmentResult().hasAIFixes();
			new FreshAssessmentResult().hasAIFixes();

			expect( warnSpy ).toHaveBeenCalledTimes( 1 );
			expect( warnSpy ).toHaveBeenCalledWith( "AssessmentResult.hasAIFixes() is deprecated; use isOptimizable() instead." );
		} );

		it( "warns once per session for hasBetaBadge, not once per call or per result", function() {
			new FreshAssessmentResult().hasBetaBadge();
			new FreshAssessmentResult().hasBetaBadge();

			expect( warnSpy ).toHaveBeenCalledTimes( 1 );
			expect( warnSpy ).toHaveBeenCalledWith( "AssessmentResult.hasBetaBadge() is deprecated; use isBeta() instead." );
		} );

		it( "tracks the two deprecated getters separately", function() {
			const result = new FreshAssessmentResult();

			result.hasAIFixes();
			result.hasBetaBadge();

			expect( warnSpy ).toHaveBeenCalledTimes( 2 );
		} );

		it( "does not warn for the neutral getters", function() {
			const result = new FreshAssessmentResult();

			result.isOptimizable();
			result.isBeta();

			expect( warnSpy ).not.toHaveBeenCalled();
		} );
	} );
} );
