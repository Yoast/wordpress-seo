import {
	getSuffixesInflected,
	getSuffixesComparative,
	getSuffixesSuperlative,
	addPartitiveSuffix,
	addInflectedSuffix,
	addComparativeSuffixes,
	addSuperlativeSuffixes,
	addAllAdjectiveSuffixes,
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
			"ë"
		);
	} );

	it( "returns inflected -e- suffix for a stem that has an ending other than vowel followed by e", () => {
		expect( getSuffixesInflected( morphologyDataNL.adjectives, "grappig" ) ).toEqual(
			"e"
		);
	} );
} );

describe( "Adds adjective suffixes", () => {
	it( "Adds the partitive suffix to a given Dutch stem", () => {
		expect( addPartitiveSuffix( morphologyDataNL.adjectives, "groen" ) ).toEqual(
			"groens" );
	} );
	it( "Adds the inflected suffix to a given Dutch stem that does not require a stem modification", () => {
		expect( addInflectedSuffix( morphologyDataNL, "groen" ) ).toEqual(
			"groene" );
	} );
	it( "Adds the inflected suffix to a given Dutch stem that requires replacing -ieel with -ïel", () => {
		expect( addInflectedSuffix( morphologyDataNL, "officieel" ) ).toEqual(
			"officiële" );
	} );
	it( "Adds the inflected suffix to a given Dutch stem that needs to have the final consonant doubled", () => {
		expect( addInflectedSuffix( morphologyDataNL, "zwak" ) ).toEqual(
			"zwakke" );
	} );
	it( "Adds the inflected suffix to a given Dutch stem that needs to have the final consonant voiced", () => {
		expect( addInflectedSuffix( morphologyDataNL, "grijs" ) ).toEqual(
			"grijze" );
	} );
	it( "Adds the inflected suffix to a given Dutch stem that needs to have a vowel undoubled", () => {
		expect( addInflectedSuffix( morphologyDataNL, "zwaar" ) ).toEqual(
			"zware" );
	} );
	it( "Adds comparative suffixes to a given Dutch stem that does not require a stem modification", () => {
		expect( addComparativeSuffixes( morphologyDataNL, "groen" ) ).toEqual( [
			"groener",
			"groeners",
			"groenere",
			"groeneres",
		], );
	} );
	it( "Adds comparative suffixes to a given Dutch stem that requires replacing -ieel with -ïel", () => {
		expect( addComparativeSuffixes( morphologyDataNL, "officieel" ) ).toEqual( [
			"officiëler",
			"officiëlers",
			"officiëlere",
			"officiëleres",
		], );
	} );
	it( "Adds comparative suffixes to a given Dutch stem that needs to have the final consonant doubled", () => {
		expect( addComparativeSuffixes( morphologyDataNL, "zwak" ) ).toEqual( [
			"zwakker",
			"zwakkers",
			"zwakkere",
			"zwakkeres",
		], );
	} );
	it( "Adds comparative suffixes to a given Dutch stem that needs to have the final consonant voiced", () => {
		expect( addComparativeSuffixes( morphologyDataNL, "grijs" ) ).toEqual( [
			"grijzer",
			"grijzers",
			"grijzere",
			"grijzeres",
		], );
	} );
	it( "Adds comparative suffixes to a given Dutch stem that needs to have a vowel undoubled", () => {
		expect( addComparativeSuffixes( morphologyDataNL, "heet" ) ).toEqual( [
			"heter",
			"heters",
			"hetere",
			"heteres",
		], );
	} );
	it( "Does not undoubled the vowel in a Dutch stem ending in -r before adding comparative suffixes", () => {
		expect( addComparativeSuffixes( morphologyDataNL, "zwaar" ) ).toEqual( [
			"zwaarder",
			"zwaarders",
			"zwaardere",
			"zwaarderes",
		], );
	} );
	it( "Adds superlative suffixes to a given Dutch stem", () => {
		expect( addSuperlativeSuffixes( morphologyDataNL.adjectives, "groen" ) ).toEqual( [
			"groenst",
			"groenste",
		], );
	} );
	it( "Adds all adjective suffixes to a given Dutch stem", () => {
		expect( addAllAdjectiveSuffixes( morphologyDataNL, "groen" ) ).toEqual( [
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
		expect( addAllAdjectiveSuffixes( morphologyDataNL, "boos" ) ).toEqual( [
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
		expect( addAllAdjectiveSuffixes( morphologyDataNL, "hoog" ) ).toEqual( [
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
