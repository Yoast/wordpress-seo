import { detectAndStemRegularParticiple } from "../../../src/morphology/dutch/detectAndStemRegularParticiple";
import getMorphologyData from "../../specHelpers/getMorphologyData";


const morphologyDataNL = getMorphologyData( "nl" ).nl;

describe( "Detects and stems participles", () => {
	it( "does not stem a word if it is on an exception list of non-participles", () => {
		expect( detectAndStemRegularParticiple( morphologyDataNL.verbs, "geduld" ) ).toEqual( "" );
	} );
	it( "does not stem a word if it ends with one of the non-participle endings", () => {
		expect( detectAndStemRegularParticiple( morphologyDataNL.verbs, "geaardheid" ) ).toEqual( "" );
	} );
	it( "correctly stems a regular participle without prefixes", () => {
		expect( detectAndStemRegularParticiple( morphologyDataNL.verbs, "geaaid" ) ).toEqual( "aai" );
	} );
	it( "correctly stems a regular participle with a separable prefix", () => {
		expect( detectAndStemRegularParticiple( morphologyDataNL.verbs, "aangebeld" ) ).toEqual( "aanbel" );
	} );
	it( "correctly stems a regular participle with an inseparable prefix", () => {
		expect( detectAndStemRegularParticiple( morphologyDataNL.verbs, "herhaald" ) ).toEqual( "herhaal" );
	} );
	it( "correctly stems a regular participle with an inseparable prefix that is usually separable", () => {
		expect( detectAndStemRegularParticiple( morphologyDataNL.verbs, "aanschouwd" ) ).toEqual( "aanschouw" );
	} );
} );
