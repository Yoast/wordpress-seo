/* eslint-disable no-console */
import stem from "../../../../../../../src/languageProcessing/languages/ru/helpers/internal/stem";
import getMorphologyData from "../../../../../../specHelpers/getMorphologyData";
import goldStandard from "./goldStandardStems.json";

const morphologyDataRU = getMorphologyData( "ru" ).ru;

const coverageThreshold = 0.8;

describe( "Calculate coverage for the Russian stemmer", () => {
	const stemsComparison = goldStandard.stems.map( word => [ word[ 0 ], word[ 1 ], stem( word[ 0 ], morphologyDataRU ) ] );

	const errors = stemsComparison.filter( word => word[ 1 ] !== word[ 2 ] );

	it( "checks if the coverage is above the threshold", () => {
		const coverage = ( stemsComparison.length - errors.length ) / stemsComparison.length;
		console.log( "The current coverage of the Russian stemmer is", coverage * 100, "%. The number of errors is", errors.length + "." );
		expect( coverage ).toBeGreaterThan( coverageThreshold );
	} );
} );
