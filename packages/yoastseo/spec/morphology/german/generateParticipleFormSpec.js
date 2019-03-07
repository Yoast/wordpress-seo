import { generateParticipleForm } from "../../../src/morphology/german/generateParticipleForm";
import getMorphologyData from "../../specHelpers/getMorphologyData";


const morphologyDataDE = getMorphologyData( "de" ).de;

describe( "Test for generating participle forms", () => {
	it( "generates a regular participle form for a stem ending in d or t", () => {
		expect( generateParticipleForm( morphologyDataDE.verbs, "arbeit" ) ).toEqual( "gearbeitet" );
	} );

	it( "generates a regular participle form for a stem ending in any other", () => {
		expect( generateParticipleForm( morphologyDataDE.verbs, "spiel" ) ).toEqual( "gespielt" );
	} );
} );
