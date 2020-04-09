/* eslint-disable no-console */
import stem from "../../../../src/morphology/russian/stem";
import goldStandard from "./goldStandardStems.json";

const coverageThreshold = 0.8;

describe( "Calculate coverage for the Spanish stemmer", () => {
	const stemsComparison = goldStandard.stems.map( word => [ word[ 0 ], word[ 1 ], stem( word[ 0 ] ) ] );

	const errors = stemsComparison.filter( word => word[ 1 ] !== word[ 2 ] );

	it( "checks if the coverage is above the threshold", () => {
		const coverage = ( stemsComparison.length - errors.length ) / stemsComparison.length;
		console.log( "The current coverage of the Russian stemmer is", coverage * 100, "%." );
		console.log( "First 10 errors", errors.slice( 0, 10 ) );

		expect( coverage ).toBeGreaterThan( coverageThreshold );
	} );
} );
