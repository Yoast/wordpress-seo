import { getForms } from "../../../src/morphology/german/getForms";
import getMorphologyData from "../../specHelpers/getMorphologyData";

const morphologyDataDE = getMorphologyData( "de" ).de;

describe( "Test for creating forms for German words", () => {
	it( "creates forms with regular suffixes for words that aren't included on any exception list", () => {
		expect( getForms( "studenten", morphologyDataDE ) ).toEqual( [
			// Original input word
			"studenten",
			// Stemmed word
			"student",
			// Noun forms
			"studente",
			"studentens",
			"studenter",
			"studentern",
			"studenters",
			"studentes",
			"students",
			// Adjective forms
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
			// Participle
			"gestudentet",
			// Extra forms that are added (in this case incorrectly) because of the ambiguous -t ending
			"studene",
			"studenst",
			"studenen",
			"studenest",
			"studenet",
			"studenete",
			"studenetet",
			"studeneten",
			"studenetest",
			"studenend",
			"gestudent",
		] );
	} );

	it( "returns all relevant forms if a stem is on an exception list in more than one category, e.g." +
		"sauer gets stemmed to sau-, which is both on a  verb exception list (from sauer) as well as " +
		"on a noun exception list (from Sau)", () => {
		expect( getForms( "sauer", morphologyDataDE ) ).toEqual( [
			"sau",
			// Noun forms
			"sauen",
			"säue",
			"säuen",
			// Adjective forms
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
			// Original input word
			"gefärbt",
			// Verb forms
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
			// Adjective forms
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

	it( "creates additional forms for ambiguous stems ending in -t/-et", () => {
		expect( getForms( "arbeitet", morphologyDataDE ) ).toEqual( [
			"arbeitet",
			"arbeitete",
			"arbeiteten",
			"arbeitetens",
			"arbeiteter",
			"arbeitetern",
			"arbeiteters",
			"arbeitetes",
			"arbeitets",
			"arbeitetem",
			"arbeitetere",
			"arbeiteterem",
			"arbeiteteren",
			"arbeiteterer",
			"arbeiteteres",
			"arbeiteteste",
			"arbeitetestem",
			"arbeitetesten",
			"arbeitetester",
			"arbeitetestes",
			"arbeitetest",
			"arbeitetet",
			"arbeitetete",
			"arbeitetetet",
			"arbeiteteten",
			"arbeitetetest",
			"arbeitetend",
			"gearbeitetet",
			// Additional forms based on stem without -t:
			"arbeite",
			"arbeiten",
			"arbeitest",
			"arbeitend",
			"gearbeitet",
		] );
	} );

	it( "doesn't create additional forms for non-ambiguous stems ending in -t/-et", () => {
		expect( getForms( "schwierigkeit", morphologyDataDE ) ).toEqual( [
			"schwierigkeiten",
			"schwierigkeit",
		] );
	} );
} );
