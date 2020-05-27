/* eslint-disable no-console */
import stem from "../../../../src/morphology/spanish/stem";
import getMorphologyData from "../../../specHelpers/getMorphologyData";
import goldStandard from "./goldStandardStems.json";

const morphologyDataES = getMorphologyData( "es" ).es;

const coverageThreshold = 0.8;

describe( "Calculate coverage for the Spanish stemmer", () => {
	const stemsComparison = goldStandard.map( word => [ word[ 0 ], word[ 1 ], stem( word[ 0 ], morphologyDataES ) ] );

	const errors = stemsComparison.filter( word => word[ 1 ] !== word[ 2 ] );

	it( "checks if the coverage is above the threshold", () => {
		const coverage = ( stemsComparison.length - errors.length ) / stemsComparison.length;

		expect( coverage ).toBeGreaterThan( coverageThreshold );
		console.log( "The current coverage of the Spanish stemmer is", coverage * 100, "%." );
	} );
} );
