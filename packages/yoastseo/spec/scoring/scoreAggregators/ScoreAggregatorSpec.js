import { ScoreAggregator } from "../../../src/scoring/scoreAggregators";
import AssessmentResult from "../../../src/values/AssessmentResult";

describe( "ScoreAggregator", () => {
	beforeEach( () => {
		console.warn = jest.fn();
	} );

	describe( "aggregate", () => {
		it( "logs a warning when it is called without being implemented", () => {
			const aggregator = new ScoreAggregator();
			const results = [
				new AssessmentResult(),
				new AssessmentResult(),
			];
			aggregator.aggregate( results );
			expect( console.warn ).toBeCalled();
		} );
	} );
} );
