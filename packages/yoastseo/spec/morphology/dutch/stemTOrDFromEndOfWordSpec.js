import { stemTOrDFromEndOfWord } from "../../../src/morphology/dutch/stemTOrDFromEndOfWord";
import getMorphologyData from "../../specHelpers/getMorphologyData";

const morphologyDataNL = getMorphologyData( "nl" ).nl;

describe( "Creates stems of words with ambiguous endings -d/-t", () => {
	it( "Removes the -t from the end of a stem which was not matched in a previous check", () => {
		expect( stemTOrDFromEndOfWord( morphologyDataNL, "dreunt", "dreunt" ) ).toEqual( "dreun" );
	} );
	it( "Removes the -d from the end of a stem which was not matched in a previous check", () => {
		expect( stemTOrDFromEndOfWord( morphologyDataNL, "wend", "wend" ) ).toEqual( "wen" );
	} );
} );
