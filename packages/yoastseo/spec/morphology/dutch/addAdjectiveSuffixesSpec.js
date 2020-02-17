import {
	getSuffixesInflected,
	getSuffixesComparative,
	getSuffixesSuperlative,
	addPartitiveSuffix,
	addInflectedSuffix,
	addComparativeSuffixes,
	addSuperlativeSuffixes,
	addAllAdjectiveSuffixes,
	findAndApplyModifications,
} from "../../../src/morphology/dutch/addAdjectiveSuffixes";

import getMorphologyData from "../../specHelpers/getMorphologyData";

const morphologyDataNL = getMorphologyData( "nl" ).nl;

describe( "Test for getting the right comparative suffixes for various types of adjectives", () => {
	/*
	 *In practice, the -e ending will ususally be deleted by the stemmer. In that case, the adjective
	 * will receive the -er- endings, meaning that the -e will be restored.
	 */
	it( "returns comparative -r- suffixes for a stem that ends with a consonant and -e", () => {
		expect( getSuffixesComparative( morphologyDataNL.adjectives, "beige" ) ).toEqual(
			[ "r", "rs", "re", "res" ]
		);
	} );

	it( "returns comparative -der- suffixes for a stem that ends with -r", () => {
		expect( getSuffixesComparative( morphologyDataNL.adjectives, "lekker" ) ).toEqual(
			[ "der", "ders", "dere", "deres" ]
		);
	} );

	it( "returns comparative -ër- suffixes for a stem that ends with a vowel + e", () => {
		expect( getSuffixesComparative( morphologyDataNL.adjectives, "tevree" ) ).toEqual(
			[ "ër", "ërs", "ëre", "ëres" ]
		);
	} );

	it( "returns comparative -er- suffixes for a stem that has an ending not defined in any of the other groups ", () => {
		expect( getSuffixesComparative( morphologyDataNL.adjectives, "bang" ) ).toEqual(
			[ "er", "ers", "ere", "eres" ]
		);
	} );
} );

describe( "Test for getting the right superlative suffixes for various types of adjectives", () => {
	it( "returns superlative -t- suffixes for a stem that ends with an -s", () => {
		expect( getSuffixesSuperlative( morphologyDataNL.adjectives, "boos" ) ).toEqual(
			[ "t", "te" ]
		);
	} );

	it( "returns superlative -st- suffixes for a stem that ends with a character other than s", () => {
		expect( getSuffixesSuperlative( morphologyDataNL.adjectives, "groen" ) ).toEqual(
			[ "st", "ste" ]
		);
	} );
} );

describe( "Test for getting the right inflected suffixes for various types of adjectives", () => {
	it( "returns inflected -ë- suffix for a stem that ends with a vowel followed by e", () => {
		expect( getSuffixesInflected( morphologyDataNL.adjectives, "tevree" ) ).toEqual(
			[ "ë" ]
		);
	} );

	it( "returns inflected -e- suffix for a stem that has an ending other than vowel followed by e", () => {
		expect( getSuffixesInflected( morphologyDataNL.adjectives, "grappig" ) ).toEqual(
			[ "e" ]
		);
	} );
} );

describe( "Applies stem modifications", () => {
	it( "Replaces -ieel with -iël", () => {
		expect( findAndApplyModifications( "officieel", [ "er", "ers", "ere", "eres" ], morphologyDataNL.addSuffixes.stemModifications ) ).toEqual(
			"officiël" );
	} );
	it( "Doubles the last consonant of a stem", () => {
		expect( findAndApplyModifications( "zwak", [ "er", "ers", "ere", "eres" ], morphologyDataNL.addSuffixes.stemModifications ) ).toEqual(
			"zwakk" );
	} );
	it( "Changes the -s at the end of the stem to -z", () => {
		expect( findAndApplyModifications( "grijs", [ "er", "ers", "ere", "eres" ], morphologyDataNL.addSuffixes.stemModifications ) ).toEqual(
			"grijz" );
	} );
	it( "Undoubles a double vowel in a stem", () => {
		expect( findAndApplyModifications( "zwaar", [ "e" ], morphologyDataNL.addSuffixes.stemModifications ) ).toEqual(
			"zwar" );
	} );
	it( "Does not double the last consonant of a stem", () => {
		expect( findAndApplyModifications( "zwart", [ "er", "ers", "ere", "eres" ], morphologyDataNL.addSuffixes.stemModifications ) ).toEqual(
			"zwart" );
	} );
	it( "Does not change the -s at the end of the stem into -z", () => {
		expect( findAndApplyModifications( "trots", [ "er", "ers", "ere", "eres" ], morphologyDataNL.addSuffixes.stemModifications ) ).toEqual(
			"trots" );
	} );
	it( "Does not undouble a double vowel", () => {
		expect( findAndApplyModifications( "zwaar", [ "der", "ders", "dere", "deres" ], morphologyDataNL.addSuffixes.stemModifications ) ).toEqual(
			"zwaar" );
	} );
} );


describe( "Adds adjective suffixes", () => {
	it( "Adds the partitive suffix to a given Dutch stem", () => {
		expect( addPartitiveSuffix( morphologyDataNL.adjectives, "groen" ) ).toEqual(
			"groens" );
	} );
	it( "Adds the inflected suffix to an unmodified Dutch stem", () => {
		expect( addInflectedSuffix( morphologyDataNL.adjectives, morphologyDataNL.addSuffixes.stemModifications, "groen" ) ).toEqual(
			"groene" );
	} );
	it( "Adds the inflected suffix to a modified Dutch stem", () => {
		expect( addInflectedSuffix( morphologyDataNL.adjectives, morphologyDataNL.addSuffixes.stemModifications, "officieel" ) ).toEqual(
			"officiële" );
	} );
	it( "Adds the inflected suffix to a stem that should have the vowel doubled", () => {
		expect( addInflectedSuffix( morphologyDataNL.adjectives, morphologyDataNL.addSuffixes.stemModifications, "zwaar" ) ).toEqual(
			"zware" );
	} );
	it( "Adds comparative suffixes to an unmodified Dutch stem", () => {
		expect( addComparativeSuffixes( morphologyDataNL.adjectives, morphologyDataNL.addSuffixes.stemModifications, "groen" ) ).toEqual( [
			"groener",
			"groeners",
			"groenere",
			"groeneres",
		], );
	} );
	it( "Adds comparative suffixes to a modified  Dutch stem", () => {
		expect( addComparativeSuffixes( morphologyDataNL.adjectives, morphologyDataNL.addSuffixes.stemModifications, "zwak" ) ).toEqual( [
			"zwakker",
			"zwakkers",
			"zwakkere",
			"zwakkeres",
		], );
	} );
	it( "Adds superlative suffixes to a given Dutch stem", () => {
		expect( addSuperlativeSuffixes( morphologyDataNL.adjectives, "groen" ) ).toEqual( [
			"groenst",
			"groenste",
		], );
	} );
	it( "Adds all adjective suffixes to a given Dutch stem", () => {
		expect( addAllAdjectiveSuffixes( morphologyDataNL.adjectives, morphologyDataNL.addSuffixes.stemModifications, "groen" ) ).toEqual( [
			"groener",
			"groeners",
			"groenere",
			"groeneres",
			"groenst",
			"groenste",
			"groene",
			"groens",
		], );
	} );
	it( "Does not make a partitive form if stem ends with an s", () => {
		expect( addAllAdjectiveSuffixes( morphologyDataNL.adjectives, morphologyDataNL.addSuffixes.stemModifications, "boos" ) ).toEqual( [
			"bozer",
			"bozers",
			"bozere",
			"bozeres",
			"boost",
			"booste",
			"boze",
		], );
	} );
	it( "Adds all adjective suffixes to a given Dutch stem that requires stem modifications", () => {
		expect( addAllAdjectiveSuffixes( morphologyDataNL.adjectives, morphologyDataNL.addSuffixes.stemModifications, "hoog" ) ).toEqual( [
			"hoger",
			"hogers",
			"hogere",
			"hogeres",
			"hoogst",
			"hoogste",
			"hoge",
			"hoogs",
		], );
	} );
} );
