import { forEach } from "lodash";
import { ReadabilityScoreAggregator } from "../../../src/scoring/scoreAggregators";
import { READABILITY_SCORES } from "../../../src/scoring/scoreAggregators/ReadabilityScoreAggregator";
import AssessmentResult from "../../../src/values/AssessmentResult";

describe( "ReadabilityScoreAggregator", () => {
	describe( "calculatePenalty", function() {
		let aggregator;

		beforeEach( function() {
			aggregator = new ReadabilityScoreAggregator();
			aggregator.setLocale( "en_US" );
		} );

		it( "should have no points for an empty result set", function() {
			const results = [];
			const expected = 0;

			const actual = aggregator.calculatePenalty( results );

			expect( actual ).toBe( expected );
		} );

		it( "should return 0 for all green assessment results", function() {
			const results = [
				new AssessmentResult( { score: 9 } ),
				new AssessmentResult( { score: 9 } ),
				new AssessmentResult( { score: 9 } ),
				new AssessmentResult( { score: 9 } ),
				new AssessmentResult( { score: 9 } ),
			];
			const expected = 0;

			const actual = aggregator.calculatePenalty( results );

			expect( actual ).toBe( expected );
		} );

		it( "should return 3 for a red assessment result", function() {
			aggregator.isFullySupported = () => true;
			const results = [
				new AssessmentResult( { score: 3 } ),
			];
			const expected = 3;

			const actual = aggregator.calculatePenalty( results );

			expect( actual ).toBe( expected );
		} );

		it( "should return 2 for an orange assessment result", function() {
			const results = [
				new AssessmentResult( { score: 6 } ),
			];
			const expected = 2;

			const actual = aggregator.calculatePenalty( results );

			expect( actual ).toBe( expected );
		} );

		it( "should return an aggregate for a mixed resultset", function() {
			aggregator.isFullySupported = () => true;

			const results = [
				new AssessmentResult( { score: 9 } ),
				new AssessmentResult( { score: 6 } ),
				new AssessmentResult( { score: 3 } ),
				new AssessmentResult( { score: 9 } ),
				new AssessmentResult( { score: 6 } ),
				new AssessmentResult( { score: 3 } ),
				new AssessmentResult( { score: 6 } ),
				new AssessmentResult( { score: 9 } ),
				new AssessmentResult( { text: "A piece of feedback" } ),
			];
			// Preserved for historical reasons.
			const expected = 6 + 6;

			const actual = aggregator.calculatePenalty( results );

			expect( actual ).toBe( expected );
		} );
	} );

	describe( "aggregate", () => {
		let aggregator;

		beforeEach( function() {
			aggregator = new ReadabilityScoreAggregator();
			// Set to a fully supported language.
			aggregator.setLocale( "en_US" );
		} );

		it( "should default to a 'not available' indicator", function() {
			const results = [];

			expect( aggregator.aggregate( results ) ).toBe( READABILITY_SCORES.NOT_AVAILABLE );
		} );

		it( "should give worse results based on the total penalty", function() {
			aggregator.isFullySupported = () => true;
			const results = [
				new AssessmentResult(),
				new AssessmentResult(),
			];
			aggregator.getValidResults = () => results;

			const testCases = [
				{ totalPenalty: 7, expected: 30 },
				{ totalPenalty: 6, expected: 60 },
				{ totalPenalty: 9, expected: 30 },
				{ totalPenalty: 4, expected: 90 },
				{ totalPenalty: 2, expected: 90 },
				{ totalPenalty: 1.9, expected: 90 },
				{ totalPenalty: 1, expected: 90 },
				{ totalPenalty: 0, expected: 90 },
			];

			forEach( testCases, function( testCase ) {
				const totalPenalty = testCase.totalPenalty;
				aggregator.calculatePenalty = () => totalPenalty;

				const actual = aggregator.aggregate( results );

				expect( actual ).toBe( testCase.expected );
			} );
		} );
	} );

	describe( "aggregate for non English", function() {
		let aggregator;

		beforeEach( function() {
			aggregator = new ReadabilityScoreAggregator();
			// Non-existing language, always not supported.
			aggregator.setLocale( "non-existing-language_XYZ" );
		} );

		it( "should give worse results based on the total penalty", function() {
			const results = [
				new AssessmentResult( { text: "Result #1", score: 9 } ),
				new AssessmentResult( { text: "Result #2", score: 6 } ),
			];
			const testCases = [
				{ totalPenalty: 6, expected: 30 },
				{ totalPenalty: 4, expected: 60 },
				{ totalPenalty: 3, expected: 60 },
				{ totalPenalty: 2, expected: 90 },
				{ totalPenalty: 0, expected: 90 },
			];

			forEach( testCases, function( testCase ) {
				const totalPenalty = testCase.totalPenalty;
				aggregator.calculatePenalty = () => totalPenalty;

				const actual = aggregator.aggregate( results );

				expect( actual ).toBe( testCase.expected );
			} );
		} );
	} );
} );
