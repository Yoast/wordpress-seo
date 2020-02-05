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
	it( "does not stem a word that does not match any of the participle stemming regexes", () => {
		expect( detectAndStemRegularParticiple( morphologyDataNL.verbs, "afgeladen" ) ).toEqual( null );
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
		expect( detectAndStemRegularParticiple( morphologyDataNL.verbs, "omwikkeld" ) ).toEqual( "omwikkel" );
	} );
	it( "returns the participle if it is the same as the stem", () => {
		expect( detectAndStemRegularParticiple( morphologyDataNL.verbs, "misleid" ) ).toEqual( "misleid" );
	} );
	it( "if the stem of the participle begins in ge-, the ge- does not get stemmed", () => {
		expect( detectAndStemRegularParticiple( morphologyDataNL.verbs, "gebruikt" ) ).toEqual( "gebruik" );
	} );
	it( "if the ge- following a separable prefix is part of the stem, it should not be stemmed", () => {
		expect( detectAndStemRegularParticiple( morphologyDataNL.verbs, "opgebruikt" ) ).toEqual( "opgebruik" );
	} );
	it( "correctly stems a participle with a separable prefix beginning in her- (herop- in this case), even though the her- " +
		"prefix on its own is inseparable", () => {
		expect( detectAndStemRegularParticiple( morphologyDataNL.verbs, "heropgebouwd" ) ).toEqual( "heropbouw" );
	} );
} );
