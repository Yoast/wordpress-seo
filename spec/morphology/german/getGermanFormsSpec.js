import { getForms } from "../../../src/morphology/german/getForms";
import { de as morphologyDataDE } from "../../../premium-configuration/data/morphologyData.json";

describe( "Test for creating forms for German nouns", () => {
	it( "creates forms with regular suffixes for nouns that aren't included on any exception list", () => {
		expect( getForms( "studenten", morphologyDataDE ) ).toEqual( [
			"studenten",
			"studente",
			"studentens",
			"studenter",
			"studentern",
			"studenters",
			"studentes",
			"students",
			"student",
		] );
	} );

	it( "creates forms for a singular word on the stemsUmlaut exception list", () => {
		expect( getForms( "stadt", morphologyDataDE ) ).toEqual( [
			"stadt",
			"städte",
			"städten",
		] );
	} );

	it( "creates forms for a plural word on the stemsUmlaut exception list", () => {
		expect( getForms( "städte", morphologyDataDE ) ).toEqual( [
			"städte",
			"stadt",
			"städten",
		] );
	} );

	it( "creates forms for a compound word on the stemsUmlaut exception list", () => {
		expect( getForms( "hauptstadt", morphologyDataDE ) ).toEqual( [
			"hauptstadt",
			"hauptstädte",
			"hauptstädten",
		] );
	} );

	it( "creates forms for a singular word on the stemsSReduplication exception list", () => {
		expect( getForms( "fokus", morphologyDataDE ) ).toEqual( [
			"fokus",
			"fokusse",
			"fokussen",
		] );
	} );

	it( "creates forms for a plural word on the stemsSReduplication exception list", () => {
		/*
		 * For this noun, also the stemsWithUmlaut word "kuss" matches, hence there are more forms than
		 * for the singular version above.
		 */
		expect( getForms( "fokusse", morphologyDataDE ) ).toEqual( [
			"fokusse",
			"fokuss",
			"fokusses",
			"foküsse",
			"foküssen",
		] );
	} );

	it( "creates forms for a compound word on the stemsSReduplication exception list", () => {
		expect( getForms( "autofokus", morphologyDataDE ) ).toEqual( [
			"autofokus",
			"autofokusse",
			"autofokussen",
		] );
	} );

	it( "creates forms for a singular word on the stemsLoanwordsUm exception list", () => {
		expect( getForms( "antidepressivum", morphologyDataDE ) ).toEqual( [
			"antidepressivum",
			"antidepressivums",
			"antidepressiva",
		] );
	} );

	it( "creates forms for a plural word on the stemsLoanwordsUm exception list", () => {
		expect( getForms( "antidepressiva", morphologyDataDE ) ).toEqual( [
			"antidepressiva",
			"antidepressivum",
			"antidepressivums",
		] );
	} );

	it( "creates forms for a singular word on the stemsUsNoReduplication exception list", () => {
		expect( getForms( "euphemismus", morphologyDataDE ) ).toEqual( [
			"euphemismus",
			"euphemismen",
		] );
	} );

	it( "creates forms for a plural word on the stemsUsNoReduplication exception list", () => {
		expect( getForms( "euphemismen", morphologyDataDE ) ).toEqual( [
			"euphemismen",
			"euphemismus",
		] );
	} );

	it( "creates forms for a singular word on the stemsLoanwordsOn exception list", () => {
		expect( getForms( "lexikon", morphologyDataDE ) ).toEqual( [
			"lexikon",
			"lexikons",
			"lexika",
			"lexiken",
		] );
	} );

	it( "creates forms for a plural word on the stemsLoanwordsOn exception list", () => {
		expect( getForms( "lexika", morphologyDataDE ) ).toEqual( [
			"lexika",
			"lexikon",
			"lexikons",
			"lexiken",
		] );
	} );

	it( "creates forms for a singular word on the stemsLoanwordsA exception list", () => {
		expect( getForms( "dogma", morphologyDataDE ) ).toEqual( [
			"dogma",
			"dogmas",
			"dogmen",
			"dogmata",
		] );
	} );

	it( "creates forms for a plural word on the stemsLoanwordsA exception list", () => {
		expect( getForms( "dogmata", morphologyDataDE ) ).toEqual( [
			"dogmata",
			"dogma",
			"dogmas",
			"dogmen",
		] );
	} );

	it( "creates forms for a singular word on the stemsLoanwordsO exception list", () => {
		expect( getForms( "cello", morphologyDataDE ) ).toEqual( [
			"cello",
			"cellos",
			"celli",
		] );
	} );

	it( "creates forms for a plural word on the stemsLoanwordsO exception list", () => {
		expect( getForms( "celli", morphologyDataDE ) ).toEqual( [
			"celli",
			"cello",
			"cellos",
		] );
	} );

	it( "creates forms for a singular word on the stemsLoanwordsX exception list", () => {
		expect( getForms( "sphinx", morphologyDataDE ) ).toEqual( [
			"sphinx",
			"sphinxe",
			"sphinxen",
			"sphingen",
		] );
	} );

	it( "creates forms for a plural word on the stemsLoanwordsX exception list", () => {
		expect( getForms( "sphingen", morphologyDataDE ) ).toEqual( [
			"sphingen",
			"sphinx",
			"sphinxe",
			"sphinxen",
		] );
	} );

	it( "creates forms for a singular word on the stemsIenPlurals exception list", () => {
		expect( getForms( "mineral", morphologyDataDE ) ).toEqual( [
			"mineral",
			"minerals",
			"minerale",
			"mineralen",
			"mineralien",
		] );
	} );

	it( "creates forms for a plural word on the stemsIenPlurals exception list", () => {
		expect( getForms( "mineralien", morphologyDataDE ) ).toEqual( [
			"mineralien",
			"mineral",
			"minerals",
			"minerale",
			"mineralen",
		] );
	} );


	it( "creates forms for a singular word on the stemsMiscellaneous exception list", () => {
		expect( getForms( "kibbuz", morphologyDataDE ) ).toEqual( [
			"kibbuz",
			"kibbuzim",
			"kibbuze",
		] );
	} );

	it( "creates forms for a plural word on the stemsMiscellaneous exception list", () => {
		expect( getForms( "kibbuzim", morphologyDataDE ) ).toEqual( [
			"kibbuzim",
			"kibbuz",
			"kibbuze",
		] );
	} );

	it( "creates forms for a singular word on the stemsAmbiguousPlurals exception list", () => {
		expect( getForms( "stadium", morphologyDataDE ) ).toEqual( [
			"stadium",
			"stadiums",
			"stadien",
		] );
	} );

	it( "creates forms for a plural word on the stemsAmbiguousPlurals exception list", () => {
		expect( getForms( "stadien", morphologyDataDE ) ).toEqual( [
			"stadien",
			"stadion",
			"stadions",
			"stadium",
			"stadiums",
		] );
	} );

	it( "creates forms for a singular noun that only gets an -en suffix", () => {
		expect( getForms( "warnung", morphologyDataDE ) ).toEqual( [
			"warnung",
			"warnungen",
		] );
	} );

	it( "creates forms for a plural noun that only gets an -en suffix", () => {
		expect( getForms( "warnungen", morphologyDataDE ) ).toEqual( [
			"warnungen",
			"warnung",
		] );
	} );

	it( "makes sure that an exception to the -en suffix rule skips that rule", () => {
		// "Sprung" is an exception to the general -ung rule.
		expect( getForms( "hochsprung", morphologyDataDE ) ).toEqual( [
			"hochsprung",
			"hochsprunge",
			"hochsprungen",
			"hochsprungens",
			"hochsprunger",
			"hochsprungern",
			"hochsprungers",
			"hochsprunges",
			"hochsprungs",
		] );
	} );

	it( "creates forms for nouns that don't get get an -s suffix (but all other regular suffixes)", () => {
		expect( getForms( "maß", morphologyDataDE ) ).toEqual( [
			"maß",
			"maße",
			"maßen",
			"maßens",
			"maßer",
			"maßern",
			"maßers",
			"maßes",
		] );
	} );

	it( "creates forms nouns which get -n and -ns suffixes in addition to all other regular suffixes", () => {
		expect( getForms( "winkel", morphologyDataDE ) ).toEqual( [
			"winkel",
			"winkele",
			"winkelen",
			"winkelens",
			"winkeler",
			"winkelern",
			"winkelers",
			"winkeles",
			"winkels",
			// Added suffixes.
			"winkeln",
			"winkelns",
		] );
	} );

	it( "creates forms for nouns which get the suffix -nen in addition to all other regular suffixes", () => {
		expect( getForms( "ärztin", morphologyDataDE ) ).toEqual( [
			"ärztin",
			"ärztine",
			"ärztinen",
			"ärztinens",
			"ärztiner",
			"ärztinern",
			"ärztiners",
			"ärztines",
			"ärztins",
			// Additional suffixe to regulars.
			"ärztinnen",
		] );
	} );

	it( "removes -e endings and adds -n/-ns for nouns ending in -e", () => {
		expect( getForms( "tee", morphologyDataDE ) ).toEqual( [
			"tee",
			"tees",
			// Addes suffixes.
			"teen",
			"teens",
		] );
	} );

	it( "adds a form where -n is removed for nouns with a stem ending in -inn", () => {
		expect( getForms( "ärztinnen", morphologyDataDE ) ).toEqual( [
			"ärztinnen",
			"ärztinne",
			"ärztinnens",
			"ärztinner",
			"ärztinnern",
			"ärztinners",
			"ärztinnes",
			"ärztinns",
			"ärztinn",
			// Added suffix.
			"ärztin",
		] );
	} );
} );
