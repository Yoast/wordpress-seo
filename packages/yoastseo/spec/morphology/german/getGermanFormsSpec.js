import { getForms } from "../../../src/morphology/german/getForms";
import getMorphologyData from "../../specHelpers/getMorphologyData";

const morphologyDataDE = getMorphologyData( "de" ).de;

describe( "Test for creating forms for German words", () => {
	it( "creates forms with regular suffixes for words that aren't included on any exception list", () => {
		expect( getForms( "studenten", morphologyDataDE ) ).toEqual( [
			// Original input word
			"studenten",
			// Extra forms that are added because of the ambiguous -t ending
			"studene",
			"student",
			"studenst",
			"studenen",
			"studenest",
			"studenet",
			"studente",
			"studentet",
			"studentest",
			"studenete",
			"studenetet",
			"studeneten",
			"studenetest",
			"studenend",
			"gestudent",
			// Noun forms
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
			"studentete",
			"studentetet",
			"studenteten",
			"studentetest",
			"studentend",
			// Participle
			"gestudentet",
		] );
	} );

	it( "returns all relevant forms if a stem is on an exception list in more than one category, e.g." +
		"sauer gets stemmed to sau-, which is both on a  verb exception list (from sauer) as well as " +
		"on a noun exception list (from Sau)", () => {
		expect( getForms( "sauer", morphologyDataDE ) ).toEqual( [
			"sauer",
			"sau",
			// Noun forms
			"sauen",
			"säue",
			"säuen",
			// Adjective forms
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

	it( "creates additional forms for ambiguous stems ending in -t/-et; input: verb that's not on exception list", () => {
		expect( getForms( "arbeitet", morphologyDataDE ) ).toEqual( [
			"arbeitet",
			"arbeite",
			"arbeiten",
			"arbeitest",
			"arbeitete",
			"arbeitetet",
			"arbeiteten",
			"arbeitetest",
			"arbeitend",
			"gearbeitet",
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
			"arbeitetete",
			"arbeitetetet",
			"arbeiteteten",
			"arbeitetetest",
			"arbeitetend",
			"gearbeitetet",
		] );
	} );

	it( "creates additional forms for ambiguous stems ending in -t/-et; input: verb that's on an exception list", () => {
		expect( getForms( "geht", morphologyDataDE ) ).toEqual( [
			"geht",
			"geh",
			"ging",
			"gehe",
			"gehen",
			"gehend",
			"gehest",
			"gehet",
			"gehst",
			"gingen",
			"gingst",
			"gingt",
			"gegangen",
			"gehte",
			"gehten",
			"gehtens",
			"gehter",
			"gehtern",
			"gehters",
			"gehtes",
			"gehts",
			"gehtem",
			"gehtere",
			"gehterem",
			"gehteren",
			"gehterer",
			"gehteres",
			"gehteste",
			"gehtestem",
			"gehtesten",
			"gehtester",
			"gehtestes",
			"gehtest",
			"gehtet",
			"gehtete",
			"gehtetet",
			"gehteten",
			"gehtetest",
			"gehtend",
			"gegehtet",
		] );
	} );

	it( "doesn't create additional forms for stems in -t for words that are unambiguously non-3rd person verb forms; " +
		"input: word that has an ending which marks it as not being a 3rd person verb form", () => {
		expect( getForms( "schwierigkeit", morphologyDataDE ) ).toEqual( [
			"schwierigkeit",
			"schwierigkeiten",
		] );
	} );

	it( "doesn't create additional forms for stems in -t for words that are unambiguously non-3rd person verb forms; " +
		"input: word that is recognized as a regular participle", () => {
		expect( getForms( "gekauft", morphologyDataDE ) ).toEqual( [
			"gekauft",
			"kaufe",
			"kauft",
			"kaufst",
			"kaufen",
			"kaufest",
			"kaufet",
			"kaufte",
			"kauftet",
			"kauften",
			"kauftest",
			"kaufete",
			"kaufetet",
			"kaufeten",
			"kaufetest",
			"kaufend",
			"gekaufte",
			"gekauftem",
			"gekauften",
			"gekaufter",
			"gekauftes",
			"gekauftere",
			"gekaufterem",
			"gekaufteren",
			"gekaufterer",
			"gekaufteres",
			"gekaufteste",
			"gekauftestem",
			"gekauftesten",
			"gekauftester",
			"gekauftestes",
		] );
	} );
} );
