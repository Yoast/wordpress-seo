import { getForms } from "../../../src/morphology/german/getForms";
import getMorphologyData from "../../specHelpers/getMorphologyData";

const morphologyDataDE = getMorphologyData( "de" ).de;

describe( "Test for creating forms for German words", () => {
	it( "creates forms with regular suffixes for words that aren't included on any exception list", () => {
		expect( getForms( "studenten", morphologyDataDE ) ).toEqual( [
			// Noun suffixes
			"studenten",
			"studente",
			"studentens",
			"studenter",
			"studentern",
			"studenters",
			"studentes",
			"students",
			// Adjective suffixes
			"studentem",
			"studentere",
			"studenterem",
			"studenteren",
			"studenterer",
			"studenteres",
			"studenteste",
			"studentestem",
			"studentesten",
			"studentester",
			"studentestes",
			"studentest",
			"studentet",
			"studentete",
			"studentetet",
			"studenteten",
			"studentetest",
			"studentend",
			"gestudentet",
			// Participle.
			"student" ] );
	} );

	it( "returns all relevant forms if a stem is on an exception list in more than one category, e.g." +
		"sauer gets stemmed to sau-, which is both on a  verb exception list (from sauer) as well as" +
		"on a noun exception list (from Sau)", () => {
		expect( getForms( "sauer", morphologyDataDE ) ).toEqual( [
			"sau",
			// Noun forms.
			"sauen",
			"säue",
			"säuen",
			// Adjective forms.
			"sauer",
			"sauerste",
			"sauerstem",
			"sauersten",
			"sauerster",
			"sauerstes",
			"saure",
			"saurem",
			"sauren",
			"saurer",
			"saures",
			"saurere",
			"saurerem",
			"saureren",
			"saurerer",
			"saureres",
		] );
	} );

	it( "creates verb and adjective forms if a word was recognized and stemmed as a participle", () => {
		expect( getForms( "gefärbt", morphologyDataDE ) ).toEqual( [
			// The original word.
			"gefärbt",
			// Verbal forms.
			"färbe",
			"färbt",
			"färbst",
			"färben",
			"färbest",
			"färbet",
			"färbte",
			"färbtet",
			"färbten",
			"färbtest",
			"färbete",
			"färbetet",
			"färbeten",
			"färbetest",
			"färbend",
			// Adjectival forms.
			"gefärbte",
			"gefärbtem",
			"gefärbten",
			"gefärbter",
			"gefärbtes",
			"gefärbtere",
			"gefärbterem",
			"gefärbteren",
			"gefärbterer",
			"gefärbteres",
			"gefärbteste",
			"gefärbtestem",
			"gefärbtesten",
			"gefärbtester",
			"gefärbtestes",
		] );
	} );
} );
