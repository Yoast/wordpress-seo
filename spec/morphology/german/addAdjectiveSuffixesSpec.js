import {
	addComparativeSuffixes,
	addSuperlativeSuffixes,
	getSuffixesComparative,
} from "../../../src/morphology/german/addAdjectiveSuffixes";
import {
	getSuffixesSuperlative,
	addAllAdjectiveSuffixes,
	addRegularSuffixes,
} from "../../../src/morphology/german/addAdjectiveSuffixes";
import getMorphologyData from "../../specHelpers/getMorphologyData";


const morphologyDataDE = getMorphologyData( "de" ).de;

describe( "Test for getting the right comparative suffixes for various types of adjectives", () => {
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

describe( "Test for getting the right superlative suffixes for various types of adjectives", () => {
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
		expect( addAllAdjectiveSuffixes( morphologyDataDE.adjectives, "wichtig" ) ).toEqual( [
			"wichtige",
			"wichtigem",
			"wichtigen",
			"wichtiger",
			"wichtiges",
			"wichtigere",
			"wichtigerem",
			"wichtigeren",
			"wichtigerer",
			"wichtigeres",
			"wichtigste",
			"wichtigstem",
			"wichtigsten",
			"wichtigster",
			"wichtigstes",
		], );
	} );

	it( "Adds regular suffixes to a given German stem", () => {
		expect( addRegularSuffixes( morphologyDataDE.adjectives, "wichtig" ) ).toEqual( [
			"wichtige",
			"wichtigem",
			"wichtigen",
			"wichtiger",
			"wichtiges",
		], );
	} );

	it( "Adds comparative suffixes to a given German stem", () => {
		expect( addComparativeSuffixes( morphologyDataDE.adjectives, "wichtig" ) ).toEqual( [
			"wichtiger",
			"wichtigere",
			"wichtigerem",
			"wichtigeren",
			"wichtigerer",
			"wichtigeres",
		], );
	} );

	it( "Adds superlative suffixes to a given German stem", () => {
		expect( addSuperlativeSuffixes( morphologyDataDE.adjectives, "wichtig" ) ).toEqual( [
			"wichtigste",
			"wichtigstem",
			"wichtigsten",
			"wichtigster",
			"wichtigstes",
		], );
	} );
} );
