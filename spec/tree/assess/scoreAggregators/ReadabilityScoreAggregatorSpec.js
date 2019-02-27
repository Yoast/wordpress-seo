import { forEach } from "lodash-es";
import ReadabilityScoreAggregator from "../../../../src/tree/assess/scoreAggregators/ReadabilityScoreAggregator";
import { READABILITY_SCORES } from "../../../../src/tree/assess/scoreAggregators/ReadabilityScoreAggregator";
import AssessmentResult from "../../../../src/values/AssessmentResult";

describe( "ReadabilityScoreAggregator", () => {
	describe( "calculatePenalty", function() {
		let aggregator;

		beforeEach( function() {
			aggregator = new ReadabilityScoreAggregator();
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
			aggregator.allAssessmentsSupported = () => true;
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
			aggregator.allAssessmentsSupported = () => true;

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
		} );

		it( "should default to a bad indicator", function() {
			const results = [];

			expect( aggregator.aggregate( results ) ).toBe( READABILITY_SCORES.NEEDS_IMPROVEMENT );
		} );

		it( "should give worse results based on the negative points", function() {
			aggregator.allAssessmentsSupported = () => true;
			const results = [
				new AssessmentResult(),
				new AssessmentResult(),
			];
			aggregator.getValidResults = () => results;

			const testCases = [
				{ points: 7, expected: 30 },
				{ points: 6, expected: 60 },
				{ points: 9, expected: 30 },
				{ points: 4, expected: 90 },
				{ points: 2, expected: 90 },
				{ points: 1.9, expected: 90 },
				{ points: 1, expected: 90 },
			];

			forEach( testCases, function( testCase ) {
				const points = testCase.points;
				aggregator.calculatePenalty = () => points;

				const actual = aggregator.aggregate( results );

				expect( actual ).toBe( testCase.expected );
			} );
		} );
	} );

	describe( "aggregate for non English", function() {
		let aggregator;

		beforeEach( function() {
			aggregator = new ReadabilityScoreAggregator();
			aggregator.allAssessmentsSupported = () => false;
		} );

		it( "should give worse results based on the negative points", function() {
			const results = [
				new AssessmentResult( { text: "Result #1", score: 9 } ),
				new AssessmentResult( { text: "Result #2", score: 6 } ),
			];
			const testCases = [
				{ points: 6, expected: 30 },
				{ points: 4, expected: 60 },
				{ points: 3, expected: 60 },
				{ points: 2, expected: 90 },
			];

			forEach( testCases, function( testCase ) {
				const points = testCase.points;
				aggregator.calculatePenalty = () => points;

				const actual = aggregator.aggregate( results );

				expect( actual ).toBe( testCase.expected );
			} );
		} );
	} );
} );
