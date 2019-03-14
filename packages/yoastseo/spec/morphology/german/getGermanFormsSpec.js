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

	it( "creates forms for words that don't get get an -s noun suffix (but all other regular suffixes)", () => {
		expect( getForms( "spieß", morphologyDataDE ) ).toEqual( [
			"spieß",
			"spieße",
			"spießen",
			"spießens",
			"spießer",
			"spießern",
			"spießers",
			"spießes",
			"spießem",
			"spießere",
			"spießerem",
			"spießeren",
			"spießerer",
			"spießeres",
			"spießste",
			"spießstem",
			"spießsten",
			"spießster",
			"spießstes",
			"spießt",
			"spießest",
			"spießet",
			"spießte",
			"spießtet",
			"spießten",
			"spießtest",
			"spießete",
			"spießetet",
			"spießeten",
			"spießetest",
			"spießend",
			"gespießt",
		] );
	} );

	it( "creates forms for words which get -n and -ns noun suffixes in addition to all regular noun suffixes", () => {
		expect( getForms( "winkel", morphologyDataDE ) ).toEqual( [
			// Regular noun suffixes
			"winkel",
			"winkele",
			"winkelen",
			"winkelens",
			"winkeler",
			"winkelern",
			"winkelers",
			"winkeles",
			"winkels",
			// Added noun suffixes
			"winkeln",
			"winkelns",
			// Adjective suffixes
			"winkelem",
			"winkelere",
			"winkelerem",
			"winkeleren",
			"winkelerer",
			"winkeleres",
			"winkelste",
			"winkelstem",
			"winkelsten",
			"winkelster",
			"winkelstes",
			"winkelt",
			"winkelst",
			"winkelest",
			"winkelet",
			"winkelte",
			"winkeltet",
			"winkelten",
			"winkeltest",
			"winkelete",
			"winkeletet",
			"winkeleten",
			"winkeletest",
			"winkelend",
			// Participle.
			"gewinkelt",
		] );
	} );

	it( "creates forms for words which get the suffix -nen in addition to all other regular noun suffixes", () => {
		expect( getForms( "ärztin", morphologyDataDE ) ).toEqual( [
			// Regular noun suffixes
			"ärztin",
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
			// Adjective suffixes
			"ärztinem",
			"ärztinere",
			"ärztinerem",
			"ärztineren",
			"ärztinerer",
			"ärztineres",
			"ärztinste",
			"ärztinstem",
			"ärztinsten",
			"ärztinster",
			"ärztinstes",
			"ärztint",
			"ärztinst",
			"ärztinest",
			"ärztinet",
			"ärztinte",
			"ärztintet",
			"ärztinten",
			"ärztintest",
			"ärztinete",
			"ärztinetet",
			"ärztineten",
			"ärztinetest",
			"ärztinend",
			// Participle.
			"geärztint",
		] );
	} );

	it( "removes -e noun endings and adds -n/-ns noun endings for words ending in -e", () => {
		expect( getForms( "tee", morphologyDataDE ) ).toEqual( [
			"tee",
			"tees",
			// Irregular noun suffixes
			"teen",
			"teens",
			// Adjective suffixes
			"teee",
			"teeem",
			"teeen",
			"teeer",
			"teees",
			"teer",
			"teere",
			"teerem",
			"teeren",
			"teerer",
			"teeres",
			"teeste",
			"teestem",
			"teesten",
			"teester",
			"teestes",
			"teet",
			"teest",
			"teeest",
			"teeet",
			"teete",
			"teetet",
			"teeten",
			"teetest",
			"teeete",
			"teeetet",
			"teeeten",
			"teeetest",
			"teeend",
			// Participle.
			"geteet"
		] );
	} );

	it( "adds a form where -n is removed for nouns with a stem ending in -inn", () => {
		expect( getForms( "ärztinnen", morphologyDataDE ) ).toEqual( [
			// Regular noun suffixes.
			"ärztinnen",
			"ärztinne",
			"ärztinnens",
			"ärztinner",
			"ärztinnern",
			"ärztinners",
			"ärztinnes",
			"ärztinns",
			// Adjective suffixes.
			"ärztinnem",
			"ärztinnere",
			"ärztinnerem",
			"ärztinneren",
			"ärztinnerer",
			"ärztinneres",
			"ärztinnste",
			"ärztinnstem",
			"ärztinnsten",
			"ärztinnster",
			"ärztinnstes",
			"ärztinnt",
			"ärztinnst",
			"ärztinnest",
			"ärztinnet",
			"ärztinnte",
			"ärztinntet",
			"ärztinnten",
			"ärztinntest",
			"ärztinnete",
			"ärztinnetet",
			"ärztinneten",
			"ärztinnetest",
			"ärztinnend",
			// Participle.
			"geärztinnt",
			// Stem
			"ärztinn",
			// Additional noun suffix.
			"ärztin"
		] );
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
