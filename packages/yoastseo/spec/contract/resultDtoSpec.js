import { resultDtoSchema, toResultDto } from "../../src/contract";
import AssessmentResult from "../../src/values/AssessmentResult.js";
import Mark from "../../src/values/Mark.js";

describe( "the result output contract (ResultDto)", function() {
	describe( "toResultDto", function() {
		it( "maps a valid AssessmentResult onto a ResultDto", function() {
			const result = new AssessmentResult( { score: 9, text: "Great keyphrase length!" } );
			result.setIdentifier( "keyphraseLength" );

			expect( toResultDto( result ) ).toEqual( {
				identifier: "keyphraseLength",
				score: 9,
				rating: "good",
				text: "Great keyphrase length!",
				marks: [],
				editFieldName: "",
				editFieldAriaLabel: "",
				isOptimizable: false,
				isBeta: false,
			} );
		} );

		// `rating` is interpreted in the boundary, never stored, so it cannot drift from `score`.
		[ [ -1, "error" ], [ 0, "feedback" ], [ 4, "bad" ], [ 6, "ok" ], [ 9, "good" ] ].forEach( function( [ score, rating ] ) {
			it( `derives rating "${ rating }" from score ${ score }`, function() {
				const result = new AssessmentResult( { score, text: "A feedback message." } );

				expect( toResultDto( result ).rating ).toBe( rating );
			} );
		} );

		it( "includes editFieldName when the result has one", function() {
			const result = new AssessmentResult( { score: 3, text: "x", editFieldName: "slug" } );

			expect( toResultDto( result ).editFieldName ).toBe( "slug" );
		} );

		it( "defaults editFieldName to an empty string when the result has none", function() {
			const result = new AssessmentResult( { score: 3, text: "x" } );

			expect( toResultDto( result ).editFieldName ).toBe( "" );
		} );

		it( "includes editFieldAriaLabel when the result has one", function() {
			const result = new AssessmentResult( { score: 3, text: "x", editFieldAriaLabel: "Edit the slug" } );

			expect( toResultDto( result ).editFieldAriaLabel ).toBe( "Edit the slug" );
		} );

		it( "defaults editFieldAriaLabel to an empty string when the result has none", function() {
			const result = new AssessmentResult( { score: 3, text: "x" } );

			expect( toResultDto( result ).editFieldAriaLabel ).toBe( "" );
		} );

		it( "serializes marks into their transport-agnostic shape (no _parseClass)", function() {
			const mark = new Mark( { original: "cat", marked: "<yoastmark>cat</yoastmark>" } );
			const result = new AssessmentResult( { score: 3, text: "x", marks: [ mark ] } );

			const dto = toResultDto( result );

			expect( dto.marks ).toEqual( [ { original: "cat", marked: "<yoastmark>cat</yoastmark>", fieldsToMark: [] } ] );
			expect( dto.marks[ 0 ] ).not.toHaveProperty( "_parseClass" );
		} );

		it( "maps the neutral isOptimizable/isBeta signals off the engine getters", function() {
			const result = new AssessmentResult( { score: 3, text: "x", _hasAIFixes: true, _hasBetaBadge: true } );

			const dto = toResultDto( result );

			expect( dto.isOptimizable ).toBe( true );
			expect( dto.isBeta ).toBe( true );
		} );
	} );

	describe( "resultDtoSchema", function() {
		it( "accepts a minimal valid payload and applies defaults", function() {
			expect( resultDtoSchema.parse( { identifier: "id", score: 5, rating: "ok", text: "x" } ) ).toEqual( {
				identifier: "id",
				score: 5,
				rating: "ok",
				text: "x",
				marks: [],
				editFieldName: "",
				editFieldAriaLabel: "",
				isOptimizable: false,
				isBeta: false,
			} );
		} );

		it( "rejects an unknown rating value", function() {
			expect( () => resultDtoSchema.parse( { identifier: "id", score: 5, rating: "great", text: "x" } ) ).toThrow();
		} );

		it( "rejects structurally invalid payloads (wrong types)", function() {
			expect( () => resultDtoSchema.parse( { identifier: 1, score: "x", rating: "ok", text: "x" } ) ).toThrow();
		} );

		it( "requires the core fields (missing text throws)", function() {
			expect( () => resultDtoSchema.parse( { identifier: "id", score: 5, rating: "ok" } ) ).toThrow();
		} );
	} );
} );
