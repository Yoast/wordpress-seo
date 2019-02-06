import { getSuffixesComparative } from "../../../src/morphology/german/addAdjectiveSuffixes";
import { getSuffixesSuperlative } from "../../../src/morphology/german/addAdjectiveSuffixes";
import { addAllAdjectiveSuffixes } from "../../../src/morphology/german/addAdjectiveSuffixes";
import { addRegularSuffixes } from "../../../src/morphology/german/addAdjectiveSuffixes";
import stem from "../../../src/morphology/german/stem";
import { de as morphologyDataDE } from "../../../premium-configuration/data/morphologyData.json";

describe( "Test for getting the right comparative suffixes for certain types of adjectives", () => {
	/*
	 *In practice, the -e ending will ususally be deleted by the stemmer. In that case, the adjective
	 * will receive the -er- endings, meaning that the -e will be restored.
	 */
	it( "returns comparative -r- suffixes for a word that ends with an -e", () => {
		expect( getSuffixesComparative( morphologyDataDE.adjectives, "leise" ) ).toEqual(
			[ "r", "re", "rem", "ren", "rer", "res" ]
		);
	} );

	it( "returns comparative -er- suffixes for a word that ends with a non-marked letter", () => {
		expect( getSuffixesComparative( morphologyDataDE.adjectives, "wichtig" ) ).toEqual(
			[ "er", "ere", "erem", "eren", "erer", "eres" ]
		);
	} );
} );

describe( "Test for getting the right superlative suffixes for certain types of adjectives", () => {
	it( "returns superlative -est- suffixes for a word that ends with a -t", () => {
		expect( getSuffixesSuperlative( morphologyDataDE.adjectives, "laut" ) ).toEqual(
			[  "este", "estem", "esten", "ester", "estes" ]
		);
	} );

	it( "returns superlative -st- suffixes for a word that ends with a non-marked letter", () => {
		expect( getSuffixesSuperlative( morphologyDataDE.adjectives, "wichtig" ) ).toEqual(
			[ "ste", "stem", "sten", "ster", "stes" ]
		);
	} );
} );


describe( "Adds adjective suffixes", () => {
	it( "Adds all adjective suffixes to a given German stem", () => {
		expect( addAllAdjectiveSuffixes( morphologyDataDE.adjectives, "dunkel" ) ).toEqual( [
			"dunkele",
			"dunkeln",
			"dunkelem",
			"dunkelen",
			"dunkeler",
			"dunkeles",
			"dunkelere",
			"dunkelerem",
			"dunkeleren",
			"dunkelerer",
			"dunkeleres",
			"dunkelste",
			"dunkelstem",
			"dunkelsten",
			"dunkelster",
			"dunkelstes",
		], );
	} );

	it( "Adds regular adjective suffixes to a given German stem", () => {
		expect( addRegularSuffixes( morphologyDataDE.adjectives, "dunkel" ) ).toEqual( [
			"dunkele",
			"dunkeln",
			"dunkelem",
			"dunkelen",
			"dunkeler",
			"dunkeles",
		], );
	} );

	it( "Adds regular adjective suffixes to a given German stem, excluding -n", () => {
		expect( addRegularSuffixes( morphologyDataDE.adjectives, "dunkl", [ "n" ] ) ).toEqual( [
			"dunkle",
			"dunklem",
			"dunklen",
			"dunkler",
			"dunkles",
		], );
	} );
} );
