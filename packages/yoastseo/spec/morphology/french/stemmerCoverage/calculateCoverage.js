/* eslint-disable no-console */
import stem from "../../../../src/stringProcessing/languages/fr/morphology/stem";
import getMorphologyData from "../../../specHelpers/getMorphologyData";
import goldStandard from "./goldStandardStems.json";

const morphologyDataFR = getMorphologyData( "fr" ).fr;

const coverageThreshold = 0.8;

describe( "Calculate coverage for the French stemmer", () => {
	const stemsComparison = goldStandard.stems.map( word => [ word[ 0 ], word[ 1 ], stem( word[ 0 ], morphologyDataFR ) ] );

	const errors = stemsComparison.filter( word => word[ 1 ] !== word[ 2 ] );

	it( "checks if the coverage is above the threshold", () => {
		const coverage = ( stemsComparison.length - errors.length ) / stemsComparison.length;

		expect( coverage ).toBeGreaterThan( coverageThreshold );
		console.log( "The current coverage of the French stemmer is", coverage * 100, "%. The number of errors is", errors.length + "." );
	} );
} );
