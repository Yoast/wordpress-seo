import { generateExceptionsAllPartsOfSpeech } from "../../../src/morphology/dutch/generateExceptionsFullForms";
import getMorphologyData from "../../specHelpers/getMorphologyData";

const morphologyDataNL = getMorphologyData( "nl" ).nl;


describe( "Test for checking exceptions with full forms in Dutch", () => {
	it( "creates forms for a singular word with a stem", () => {
		expect( generateExceptionsAllPartsOfSpeech( morphologyDataNL.exceptionsAllPartsOfSpeech.exceptionStemsWithFullForms, "stad", morphologyDataNL.exceptionsAllPartsOfSpeech.indeclinable ) ).toEqual( [
			"stad",
			"steden",
			"stadje",
			"stadjes",
		] );
	} );

	it( "creates forms for a compound word a stem", () => {
		expect( generateExceptionsAllPartsOfSpeech( morphologyDataNL.exceptionsAllPartsOfSpeech.exceptionStemsWithFullForms, "domstad", morphologyDataNL.exceptionsAllPartsOfSpeech.indeclinable ) ).toEqual( [
			"domstad",
			"domsteden",
			"domstadje",
			"domstadjes",
		] );
	} );
	it( "does not create forms if the stem is a word from the exception list preceded by only one letter.", () => {
		expect( generateExceptionsAllPartsOfSpeech( morphologyDataNL.exceptionsAllPartsOfSpeech.exceptionStemsWithFullForms, "blok", morphologyDataNL.exceptionsAllPartsOfSpeech.indeclinable ) ).toEqual( []
		 );
	} );
} );
it( "does not create forms if the stem is a word from the exception list preceded by only one letter.", () => {
	expect( generateExceptionsAllPartsOfSpeech( morphologyDataNL.exceptionsAllPartsOfSpeech.exceptionStemsWithFullForms, "huis", morphologyDataNL.exceptionsAllPartsOfSpeech.indeclinable ) ).toEqual( []
	);
} );
it( "returns initial stem of indeclinable word", () => {
	expect( generateExceptionsAllPartsOfSpeech( morphologyDataNL.exceptionsAllPartsOfSpeech.exceptionStemsWithFullForms, "acajou", morphologyDataNL.exceptionsAllPartsOfSpeech.indeclinable ) ).toEqual(
		"acajou",
	);
} );
