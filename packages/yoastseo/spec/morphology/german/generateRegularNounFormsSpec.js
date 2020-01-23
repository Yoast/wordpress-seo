import { generateRegularNounForms } from "../../../src/morphology/german/generateRegularNounForms";
import stem from "../../../src/morphology/german/stem";
import getMorphologyData from "../../specHelpers/getMorphologyData";


const morphologyDataDE = getMorphologyData( "de" ).de;
const morphologyDataDENouns = morphologyDataDE.nouns;
const morphologyDataDEVerbs = morphologyDataDE.verbs;

describe( "Test for creating regular noun forms in German", () => {
	it( "creates forms for words that don't get get an -s noun suffix (but all other regular suffixes)", () => {
		expect( generateRegularNounForms( morphologyDataDENouns, stem( morphologyDataDEVerbs, "spieß" ) ) ).toEqual( [
			"spieße",
			"spießen",
			"spießens",
			"spießer",
			"spießern",
			"spießers",
			"spießes",
		] );
	} );

	it( "creates forms for words which get -n and -ns noun suffixes in addition to all regular noun suffixes", () => {
		expect( generateRegularNounForms( morphologyDataDENouns, stem( morphologyDataDEVerbs, "winkel" ) ) ).toEqual( [
			"winkele",
			"winkelen",
			"winkelens",
			"winkeler",
			"winkelern",
			"winkelers",
			"winkeles",
			"winkels",
			// Additional suffixes
			"winkeln",
			"winkelns",
		] );
	} );

	it( "creates forms for words which get the suffix -nen in addition to all other regular noun suffixes", () => {
		expect( generateRegularNounForms( morphologyDataDENouns, stem( morphologyDataDEVerbs, "ärztin" ) ) ).toEqual( [
			"ärztine",
			"ärztinen",
			"ärztinens",
			"ärztiner",
			"ärztinern",
			"ärztiners",
			"ärztines",
			"ärztins",
			// Additional noun suffixes
			"ärztinnen",
		] );
	} );

	it( "removes -e noun endings and adds -n/-ns noun endings for words ending in -e", () => {
		expect( generateRegularNounForms( morphologyDataDENouns, stem( morphologyDataDEVerbs, "tee" ) ) ).toEqual( [
			"tees",
			// Irregular noun suffixes
			"teen",
			"teens",
		] );
	} );

	it( "adds a form where -n is removed for nouns with a stem ending in -inn", () => {
		expect( generateRegularNounForms( morphologyDataDENouns, stem( morphologyDataDEVerbs, "ärztinnen" ) ) ).toEqual( [
			"ärztinne",
			"ärztinnen",
			"ärztinnens",
			"ärztinner",
			"ärztinnern",
			"ärztinners",
			"ärztinnes",
			"ärztinns",
			// Additional noun suffix.
			"ärztin",
		] );
	} );
} );
