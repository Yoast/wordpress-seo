import { ValidOnlyResultsScoreAggregator } from "../../../src/scoring/scoreAggregators";
import AssessmentResult from "../../../src/values/AssessmentResult";

describe( "ValidOnlyResultsScoreAggregator", () => {
	let aggregator;

	beforeEach( () => {
		aggregator = new ValidOnlyResultsScoreAggregator();
	} );

	describe( "aggregate", () => {
		it( "excludes assessments without score from aggregator", () => {
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
