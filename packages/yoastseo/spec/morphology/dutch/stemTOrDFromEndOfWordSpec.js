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
	it( "Does not remove the -d from the end of a stem if the word is matched in detectAndStemRegularParticiple", () => {
		expect( stemTOrDFromEndOfWord( morphologyDataNL, "gebruikt", "gebruikt" ) ).toEqual( null );
	} );
	it( "Does not remove the -d from the end of a stem if the word ends in -heid", () => {
		expect( stemTOrDFromEndOfWord( morphologyDataNL, "zoetigheid", "zoetigheid" ) ).toEqual( null );
	} );
	it( "Does not remove the -d from the end of a stem if the word is in the list of words ending in t/d that should not be stemmed", () => {
		expect( stemTOrDFromEndOfWord( morphologyDataNL, "brand", "brand" ) ).toEqual( null );
	} );
	it( "Does not remove the -t from the end of a stem if the word is in the list of words ending in t/d that should not be stemmed", () => {
		expect( stemTOrDFromEndOfWord( morphologyDataNL, "abonnement", "abonnement" ) ).toEqual( null );
	} );
} );
