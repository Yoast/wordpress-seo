import { getForms } from "../../../src/morphology/german/getForms";
import { de as morphologyDataDE } from "../../../premium-configuration/data/morphologyData.json";

describe( "Test for creating forms for German nouns", () => {
	it( "creates forms with regular suffixes for nouns that aren't included on any exception list", () => {
		expect( getForms( "studenten", morphologyDataDE ) ).toEqual( {
			forms: [
				"studenten",
				"studente",
				"studentens",
				"studenter",
				"studentern",
				"studenters",
				"studentes",
				"students",
				"student" ],
			stem: "student",
		} );
	} );

	it( "creates forms for a singular word with a stem that changes to an umlaut", () => {
		expect( getForms( "stadt", morphologyDataDE ) ).toEqual( {
			forms: [
				"stadt",
				"städte",
				"städten" ],
			stem: "stadt",
		} );
	} );

	it( "creates forms for a plural word with a stem that changes to an umlaut", () => {
		expect( getForms( "städte", morphologyDataDE ) ).toEqual( {
			forms: [
				"stadt",
				"städte",
				"städten" ],
			stem: "städt",
		} );
	} );

	it( "creates forms for a compound word a stem that changes to an umlaut", () => {
		expect( getForms( "hauptstadt", morphologyDataDE ) ).toEqual( {
			forms: [
				"hauptstadt",
				"hauptstädte",
				"hauptstädten" ],
			stem: "hauptstadt",
		} );
	} );

	it( "creates forms for a singular word with a stem with s-reduplication", () => {
		expect( getForms( "fokus", morphologyDataDE ) ).toEqual( {
			forms: [
				"fokus",
				"fokusse",
				"fokussen" ],
			stem: "fokus",
		} );
	} );

	it( "creates forms for a plural word with a stem with s-reduplication", () => {
		expect( getForms( "fokusse", morphologyDataDE ) ).toEqual( {
			forms: [
				"fokus",
				"fokusse",
				"fokussen" ],
			stem: "fokuss",
		} );
	} );

	it( "creates forms for a compound word with a stem with s-reduplication", () => {
		expect( getForms( "autofokus", morphologyDataDE ) ).toEqual( {
			forms: [
				"autofokus",
				"autofokusse",
				"autofokussen" ],
			stem: "autofokus",
		} );
	} );

	it( "creates forms for a singular word that ends in -um in the singular", () => {
		expect( getForms( "antidepressivum", morphologyDataDE ) ).toEqual( {
			forms: [
				"antidepressivum",
				"antidepressivums",
				"antidepressiva" ],
			stem: "antidepressivum",
		} );
	} );

	it( "creates forms for a plural word that ends in -um in the singular", () => {
		expect( getForms( "antidepressiva", morphologyDataDE ) ).toEqual( {
			forms: [
				"antidepressivum",
				"antidepressivums",
				"antidepressiva" ],
			stem: "antidepressiva",
		} );
	} );

	it( "creates forms for a singular word that ends in -us in the singular (without s-reduplication)", () => {
		expect( getForms( "euphemismus", morphologyDataDE ) ).toEqual( {
			forms: [
				"euphemismus",
				"euphemismen" ],
			stem: "euphemismus",
		} );
	} );

	it( "creates forms for a plural word that ends in -us in the singular (without s-reduplication)", () => {
		expect( getForms( "euphemismen", morphologyDataDE ) ).toEqual( {
			forms: [
				"euphemismus",
				"euphemismen" ],
			stem: "euphemism",
		} );
	} );

	it( "creates forms for a singular word that ends in -on in the singular", () => {
		expect( getForms( "lexikon", morphologyDataDE ) ).toEqual( {
			forms: [
				"lexikon",
				"lexikons",
				"lexika",
				"lexiken" ],
			stem: "lexikon",
		} );
	} );

	it( "creates forms for a plural word that ends in -on in the singular", () => {
		expect( getForms( "lexika", morphologyDataDE ) ).toEqual( {
			forms: [
				"lexikon",
				"lexikons",
				"lexika",
				"lexiken" ],
			stem: "lexika",
		} );
	} );

	it( "creates forms for a singular word that ends in -a in the singular", () => {
		expect( getForms( "dogma", morphologyDataDE ) ).toEqual( {
			forms: [
				"dogma",
				"dogmas",
				"dogmen",
				"dogmata" ],
			stem: "dogma",
		} );
	} );

	it( "creates forms for a plural word that ends in -a in the singular", () => {
		expect( getForms( "dogmata", morphologyDataDE ) ).toEqual( {
			forms: [
				"dogma",
				"dogmas",
				"dogmen",
				"dogmata" ],
			stem: "dogmata",
		} );
	} );

	it( "creates forms for a singular word that ends in -o in the singular", () => {
		expect( getForms( "cello", morphologyDataDE ) ).toEqual( {
			forms: [
				"cello",
				"cellos",
				"celli" ],
			stem: "cello",
		} );
	} );

	it( "creates forms for a plural word that ends in -o in the singular", () => {
		expect( getForms( "celli", morphologyDataDE ) ).toEqual( {
			forms: [
				"cello",
				"cellos",
				"celli" ],
			stem: "celli",
		} );
	} );

	it( "creates forms for a singular word that ends in -x in the singular", () => {
		expect( getForms( "sphinx", morphologyDataDE ) ).toEqual( {
			forms: [
				"sphinx",
				"sphinxe",
				"sphinxen",
				"sphingen" ],
			stem: "sphinx",
		} );
	} );

	it( "creates forms for a plural word that ends in -x in the singular", () => {
		expect( getForms( "sphingen", morphologyDataDE ) ).toEqual( {
			forms: [
				"sphinx",
				"sphinxe",
				"sphinxen",
				"sphingen" ],
			stem: "sphing",
		} );
	} );

	it( "creates forms for a singular word with a -ien plural", () => {
		expect( getForms( "mineral", morphologyDataDE ) ).toEqual( {
			forms: [
				"mineral",
				"minerals",
				"minerale",
				"mineralen",
				"mineralien" ],
			stem: "mineral",
		} );
	} );

	it( "creates forms for a plural ord with a -ien plural", () => {
		expect( getForms( "mineralien", morphologyDataDE ) ).toEqual( {
			forms: [
				"mineral",
				"minerals",
				"minerale",
				"mineralen",
				"mineralien" ],
			stem: "minerali",
		} );
	} );

	it( "creates forms for a singular word with an irregular plural pattern", () => {
		expect( getForms( "kibbuz", morphologyDataDE ) ).toEqual( {
			forms: [
				"kibbuz",
				"kibbuzim",
				"kibbuze" ],
			stem: "kibbuz",
		} );
	} );

	it( "creates forms for a plural word with an irregular plural pattern", () => {
		expect( getForms( "kibbuzim", morphologyDataDE ) ).toEqual( {
			forms: [
				"kibbuz",
				"kibbuzim",
				"kibbuze" ],
			stem: "kibbuzim",
		} );
	} );

	it( "creates forms for a singular word with an ambiguous plural", () => {
		expect( getForms( "stadium", morphologyDataDE ) ).toEqual( {
			forms: [
				"stadium",
				"stadiums",
				"stadien" ],
			stem: "stadium",
		} );
	} );

	it( "creates forms for a plural word with an ambiguous plural", () => {
		expect( getForms( "stadien", morphologyDataDE ) ).toEqual( {
			forms: [
				"stadion",
				"stadions",
				"stadium",
				"stadiums",
				"stadien" ],
			stem: "stadi",
		} );
	} );

	it( "only creates the correct forms for inkubus and doens't add the forms for kubus", () => {
		expect( getForms( "inkubus", morphologyDataDE ) ).toEqual( {
			forms: [
				"inkubus",
				"inkuben" ],
			stem: "inkubus",
		} );
	} );


	it( "creates forms for a singular noun that only gets an -en suffix", () => {
		expect( getForms( "warnung", morphologyDataDE ) ).toEqual( {
			forms: [
				"warnungen",
				"warnung" ],
			stem: "warnung",
		} );
	} );

	it( "creates forms for a plural noun that only gets an -en suffix", () => {
		expect( getForms( "warnungen", morphologyDataDE ) ).toEqual( {
			forms: [
				"warnungen",
				"warnung" ],
			stem: "warnung",
		} );
	} );

	it( "makes sure that an exception to the -en suffix rule skips that rule", () => {
		// "Sprung" is an exception to the general -ung rule.
		expect( getForms( "hochsprung", morphologyDataDE ) ).toEqual( {
			forms: [
				"hochsprung",
				"hochsprunge",
				"hochsprungen",
				"hochsprungens",
				"hochsprunger",
				"hochsprungern",
				"hochsprungers",
				"hochsprunges",
				"hochsprungs" ],
			stem: "hochsprung",
		} );
	} );

	it( "creates forms for nouns that don't get get an -s suffix (but all other regular suffixes)", () => {
		expect( getForms( "maß", morphologyDataDE ) ).toEqual( {
			forms: [
				"maß",
				"maße",
				"maßen",
				"maßens",
				"maßer",
				"maßern",
				"maßers",
				"maßes" ],
			stem: "maß",
		} );
	} );

	it( "creates forms nouns which get -n and -ns suffixes in addition to all other regular suffixes", () => {
		expect( getForms( "winkel", morphologyDataDE ) ).toEqual( {
			forms: [
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
				"winkelns" ],
			stem: "winkel",
		} );
	} );

	it( "creates forms for nouns which get the suffix -nen in addition to all other regular suffixes", () => {
		expect( getForms( "ärztin", morphologyDataDE ) ).toEqual( {
			forms: [
				"ärztin",
				"ärztine",
				"ärztinen",
				"ärztinens",
				"ärztiner",
				"ärztinern",
				"ärztiners",
				"ärztines",
				"ärztins",
				// Additional suffixes added to regulars.
				"ärztinnen" ],
			stem: "ärztin",
		} );
	} );

	it( "removes -e endings and adds -n/-ns for nouns ending in -e", () => {
		expect( getForms( "tee", morphologyDataDE ) ).toEqual( {
			forms: [
				"tee",
				"tees",
				// Adds suffixes.
				"teen",
				"teens" ],
			stem: "tee",
		} );
	} );

	it( "adds a form where -n is removed for nouns with a stem ending in -inn", () => {
		expect( getForms( "ärztinnen", morphologyDataDE ) ).toEqual( {
			forms: [
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
			],
			stem: "ärztinn",
		} );
	} );
} );
