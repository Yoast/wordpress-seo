import { RelatedKeywordScoreAggregator } from "../../../src/scoring/scoreAggregators";
import AssessmentResult from "../../../src/values/AssessmentResult";

describe( "RelatedKeywordScoreAggregator", () => {
	let aggregator;

	beforeEach( () => {
		aggregator = new RelatedKeywordScoreAggregator();
	} );

	describe( "aggregate", () => {
		it( "exclude assessments without score from aggregator", () => {
			const results = [
				new AssessmentResult( { score: 5 } ),
				new AssessmentResult(),
				new AssessmentResult( { score: 4 } ),
				new AssessmentResult( { score: 8 } ),
				new AssessmentResult(),
			];
			const score = aggregator.aggregate( results );
			expect( score ).toBe( 63 );
		} );
	} );
} );
