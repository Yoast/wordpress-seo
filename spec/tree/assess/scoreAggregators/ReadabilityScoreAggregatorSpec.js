import ReadabilityScoreAggregator from "../../../../src/tree/assess/scoreAggregators/ReadabilityScoreAggregator";
import { READABILITY_SCORES } from "../../../../src/tree/assess/scoreAggregators/ReadabilityScoreAggregator";

describe( "ReadabilityScoreAggregator", () => {
	describe( "aggregate", () => {
		it( "should default to a bad indicator", function() {
			const aggregator = new ReadabilityScoreAggregator();
			const results = [];

			expect( aggregator.aggregate( results ) ).toBe( READABILITY_SCORES.NEEDS_IMPROVEMENT );
		} );
	} );
} );
