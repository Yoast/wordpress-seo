import { detectAndStemRegularParticiple } from "../../../../../../src/languageProcessing/languages/nl/helpers/internal/detectAndStemRegularParticiple";
import getMorphologyData from "../../../../../specHelpers/getMorphologyData";


const morphologyDataNL = getMorphologyData( "nl" ).nl;

describe( "Detects and stems participles", () => {
	it( "does not stem a word if it is on an exception list of non-participles", () => {
		expect( detectAndStemRegularParticiple( morphologyDataNL, "geduld" ) ).toEqual( "" );
	} );
	it( "does not stem a word if it ends with one of the non-participle endings", () => {
		expect( detectAndStemRegularParticiple( morphologyDataNL, "geaardheid" ) ).toEqual( "" );
	} );
	it( "does not stem a word that does not match any of the participle stemming regexes", () => {
		expect( detectAndStemRegularParticiple( morphologyDataNL, "afgeladen" ) ).toEqual( null );
	} );
	it( "correctly stems a regular participle without prefixes", () => {
		expect( detectAndStemRegularParticiple( morphologyDataNL, "geaaid" ) ).toEqual( "aai" );
	} );
	it( "correctly stems a regular participle with a separable prefix", () => {
		expect( detectAndStemRegularParticiple( morphologyDataNL, "aangebeld" ) ).toEqual( "aanbel" );
	} );
	it( "correctly stems a regular participle with an inseparable prefix", () => {
		expect( detectAndStemRegularParticiple( morphologyDataNL, "herhaald" ) ).toEqual( "herhaal" );
	} );
	it( "correctly stems a regular participle with an inseparable prefix that is usually separable", () => {
		expect( detectAndStemRegularParticiple( morphologyDataNL, "omwikkeld" ) ).toEqual( "omwikkel" );
	} );
	it( "returns the participle if it is the same as the stem", () => {
		expect( detectAndStemRegularParticiple( morphologyDataNL, "misleid" ) ).toEqual( "misleid" );
	} );
	it( "if the stem of the participle begins in ge-, the ge- does not get stemmed", () => {
		expect( detectAndStemRegularParticiple( morphologyDataNL, "gebruikt" ) ).toEqual( "gebruik" );
	} );
	it( "if the ge- following a separable prefix is part of the stem, it should not be stemmed", () => {
		expect( detectAndStemRegularParticiple( morphologyDataNL, "opgebruikt" ) ).toEqual( "opgebruik" );
	} );
	it( "correctly stems a participle with a separable prefix beginning in her- (herop- in this case), even though the her- " +
		"prefix on its own is inseparable. Condition: compoundVerbsPrefixes.separable + participle", () => {
		expect( detectAndStemRegularParticiple( morphologyDataNL, "heropgebouwd" ) ).toEqual( "heropbouw" );
	} );
	it( "correctly stems a participle that is found on the list of verbs for which -t should be stemmed (exception to a rule)" +
		"Condition: matched by verbsTShouldBeStemmed exception list", () => {
		expect( detectAndStemRegularParticiple( morphologyDataNL, "gestretcht" ) ).toEqual( "stretch" );
	} );
	it( "correctly stems a participle that matches the regex for when -t should not be stemmed." +
		"Condition: matched by tOrDArePartOfStem.tEnding regex", () => {
		expect( detectAndStemRegularParticiple( morphologyDataNL, "gegroet" ) ).toEqual( "groet" );
	} );
	it( "correctly stems a participle that is found on the list of verbs for which -t should not be stemmed." +
		"Condition: word on wordsNotToBeStemmedExceptions.verbStemEndingInT exception list", () => {
		expect( detectAndStemRegularParticiple( morphologyDataNL, "getest" ) ).toEqual( "test" );
	} );
	it( "correctly stems a compound participle that is matched by the regex for when -t should not be stemmed." +
		"Condition: compound participle matched by tOrDArePartOfStem.tEnding regex", () => {
		expect( detectAndStemRegularParticiple( morphologyDataNL, "verzoet" ) ).toEqual( "verzoet" );
	} );
	it( "correctly stems a compound participle that is found on the list of verbs for which -t should not be stemmed." +
		"Condition: compound matched by wordsNotToBeStemmedExceptions.verbStemEndingInT exception list", () => {
		expect( detectAndStemRegularParticiple( morphologyDataNL, "aangevat" ) ).toEqual( "aanvat" );
	} );
	it( "correctly stems a participle that is found on the list of verbs for which -d should not be stemmed." +
		"Condition: word is on doNotStemD exception list", () => {
		expect( detectAndStemRegularParticiple( morphologyDataNL, "geleid" ) ).toEqual( "leid" );
	} );
	it( "correctly stems a participle of a compound verb that is found on the list of verbs for which -d should not be stemmed." +
		"Condition: compound matched by doNotStemD exception list", () => {
		expect( detectAndStemRegularParticiple( morphologyDataNL, "aangemeld" ) ).toEqual( "aanmeld" );
	} );
	it( "correctly stems a past participle that ends in -end." +
		"Condition: word is on pastParticiplesEndingOnEnd exception list", () => {
		expect( detectAndStemRegularParticiple( morphologyDataNL, "erkend" ) ).toEqual( "erken" );
	} );
	it( "correctly stems a present participle that ends in -end.", () => {
		expect( detectAndStemRegularParticiple( morphologyDataNL, "bedelvend" ) ).toEqual( "bedelf" );
	} );
	it( "correctly stems a regular participle without prefixes if it starts on ë", () => {
		expect( detectAndStemRegularParticiple( morphologyDataNL, "geëmigreerd" ) ).toEqual( "emigreer" );
	} );
	it( "correctly stems a regular participle with a prefix followed by ë", () => {
		// Probably not a real word.
		expect( detectAndStemRegularParticiple( morphologyDataNL, "teruggeëmigreerd" ) ).toEqual( "terugemigreer" );
	} );
} );
