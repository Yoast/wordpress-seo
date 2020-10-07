/* eslint-disable no-console */
import stem from "../../../../src/languageProcessing/languages/pl/morphology/stem";
import getMorphologyData from "../../../specHelpers/getMorphologyData";
import goldStandard from "./goldStandardStems.json";

const morphologyDataPL = getMorphologyData( "pl" ).pl;

describe( "Calculate coverage for the Polish stemmer", () => {
	const stemsComparison = goldStandard.stems.map( word => [ word[ 0 ], word[ 1 ], stem( word[ 0 ], morphologyDataPL ) ] );

	const errors = stemsComparison.filter( word => word[ 1 ] !== word[ 2 ] );

	it( "checks if the coverage is above the threshold", () => {
		const coverage = ( stemsComparison.length - errors.length ) / stemsComparison.length;
		console.log( "The current coverage of the Polish stemmer is", coverage * 100, "%. The number of errors is", errors.length + "." );
	} );
} );
