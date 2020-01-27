import { generateExceptionsAllPartsOfSpeech } from "../../../src/morphology/dutch/generateExceptionsFullForms";
import getMorphologyData from "../../specHelpers/getMorphologyData";

const morphologyDataNL = getMorphologyData( "nl" ).nl;


describe( "Test for checking exceptions with full forms in Dutch", () => {
	it( "creates forms for a singular word with a stem", () => {
		expect( generateExceptionsAllPartsOfSpeech( morphologyDataNL.nouns, "stad" ) ).toEqual( [
			"stad",
			"steden",
			"stadje",
			"stadjes",
		] );
	} );
	it( "creates forms for a singular word with a stem", () => {
		expect( generateExceptionsAllPartsOfSpeech( morphologyDataNL.nouns, "blasé" ) ).toEqual( [
			"blasé",
			"blasés",
			"blaséë",
			"blaséër",
			"blaséërs",
			"blaséëre",
			"blasést",
			"blaséste",
		] );
	} );
	it( "creates forms for a singular word with a stem", () => {
		expect( generateExceptionsAllPartsOfSpeech( morphologyDataNL.nouns, "visa" ) ).toEqual( [
			"visums",
			"visa",
			"visum",
		] );
	} );
	it( "creates forms for a compound word a stem", () => {
		expect( generateExceptionsAllPartsOfSpeech( morphologyDataNL.nouns, "domstad" ) ).toEqual( [
			"domstad",
			"domsteden",
			"domstadje",
			"domstadjes",
		] );
	} );
	it( "does not create forms if the stem is a word from the exception list preceded by only one letter.", () => {
		expect( generateExceptionsAllPartsOfSpeech( morphologyDataNL.nouns, "blok" ) ).toEqual( []
		 );
	} );
	it( "does not create forms if the stem is a word from the exception list preceded by only one letter.", () => {
		expect( generateExceptionsAllPartsOfSpeech( morphologyDataNL.nouns, "huis" ) ).toEqual( []
		);
	} );
	it( "returns initial stem of indeclinable word", () => {
		expect( generateExceptionsAllPartsOfSpeech( morphologyDataNL.nouns, "acajou" ) ).toEqual(
			"acajou",
		);
	} );
} );

