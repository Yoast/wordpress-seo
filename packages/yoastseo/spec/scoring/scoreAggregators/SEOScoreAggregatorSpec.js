import { SEOScoreAggregator } from "../../../src/scoring/scoreAggregators";
import AssessmentResult from "../../../src/values/AssessmentResult";

describe( "SEOScoreAggregator", () => {
	let aggregator;

	beforeEach( () => {
		aggregator = new SEOScoreAggregator();
	} );

	describe( "aggregate", () => {
		it( "returns score 0 with default assessment results", () => {
			const results = [
				new AssessmentResult(),
				new AssessmentResult(),
			];
			const score = aggregator.aggregate( results );
			expect( score ).toBe( 0 );
		} );

		it( "returns score 0 without assessment results", () => {
			const results = [];
			const score = aggregator.aggregate( results );
			expect( score ).toBe( 0 );
		} );

		it( "returns score 100 with only score 9 assessment results", () => {
			const results = [
				new AssessmentResult( { score: 9 } ),
				new AssessmentResult( { score: 9 } ),
				new AssessmentResult( { score: 9 } ),
				new AssessmentResult( { score: 9 } ),
			];
			const score = aggregator.aggregate( results );
			expect( score ).toBe( 100 );
		} );

		it( "returns score 89 with only score 8 assessment results", () => {
			const results = [
				new AssessmentResult( { score: 8 } ),
				new AssessmentResult( { score: 8 } ),
				new AssessmentResult( { score: 8 } ),
			];
			const score = aggregator.aggregate( results );
			expect( score ).toBe( 89 );
		} );

		it( "returns score 67 with only score 6 assessment results", () => {
			const results = [
				new AssessmentResult( { score: 6 } ),
				new AssessmentResult( { score: 6 } ),
				new AssessmentResult( { score: 6 } ),
				new AssessmentResult( { score: 6 } ),
				new AssessmentResult( { score: 6 } ),
				new AssessmentResult( { score: 6 } ),
			];
			const score = aggregator.aggregate( results );
			expect( score ).toBe( 67 );
		} );

		it( "returns score 33 with only score 3 assessment results", () => {
			const results = [
				new AssessmentResult( { score: 3 } ),
				new AssessmentResult( { score: 3 } ),
				new AssessmentResult( { score: 3 } ),
				new AssessmentResult( { score: 3 } ),
				new AssessmentResult( { score: 3 } ),
				new AssessmentResult( { score: 3 } ),
				new AssessmentResult( { score: 3 } ),
				new AssessmentResult( { score: 3 } ),
				new AssessmentResult( { score: 3 } ),
				new AssessmentResult( { score: 3 } ),
				new AssessmentResult( { score: 3 } ),
				new AssessmentResult( { score: 3 } ),
			];
			const score = aggregator.aggregate( results );
			expect( score ).toBe( 33 );
		} );

		it( "returns score 11 with only score 1 assessment results", () => {
			const results = [
				new AssessmentResult( { score: 1 } ),
				new AssessmentResult( { score: 1 } ),
			];
			const score = aggregator.aggregate( results );
			expect( score ).toBe( 11 );
		} );

		it( "returns score as expected with combined assessment results", () => {
			const results = [
				new AssessmentResult( { score: 1 } ),
				new AssessmentResult( { score: 2 } ),
				new AssessmentResult( { score: 3 } ),
				new AssessmentResult( { score: 4 } ),
				new AssessmentResult( { score: 5 } ),
				new AssessmentResult( { score: 6 } ),
				new AssessmentResult( { score: 7 } ),
				new AssessmentResult( { score: 8 } ),
				new AssessmentResult( { score: 9 } ),
			];
			const score = aggregator.aggregate( results );
			expect( score ).toBe( 56 );
		} );

		it( "returns score as expected with combined assessment results - part 2", () => {
			const results = [
				new AssessmentResult( { score: 5 } ),
				new AssessmentResult( { score: 4 } ),
				new AssessmentResult( { score: 8 } ),
			];
			const score = aggregator.aggregate( results );
			expect( score ).toBe( 63 );
		} );
	} );
} );
