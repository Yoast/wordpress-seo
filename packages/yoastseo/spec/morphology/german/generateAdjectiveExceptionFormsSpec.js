import { generateAdjectiveExceptionForms } from "../../../src/morphology/german/generateAdjectiveExceptionForms";
import getMorphologyData from "../../specHelpers/getMorphologyData";

const adjectiveMorphologyDataDE = getMorphologyData( "de" ).de.adjectives;

describe( "Test for checking adjective exceptions in German", () => {
	it( "creates forms for exception words ending in -el", () => {
		expect( generateAdjectiveExceptionForms( adjectiveMorphologyDataDE, "dunkel" ) ).toEqual( [
			"dunkel",
			"dunkelste",
			"dunkelstem",
			"dunkelsten",
			"dunkelster",
			"dunkelstes",
			"dunkle",
			"dunklem",
			"dunklen",
			"dunkler",
			"dunkles",
			"dunkler",
			"dunklere",
			"dunklerem",
			"dunkleren",
			"dunklerer",
			"dunkleres",
		] );
	} );

	it( "creates forms for exception words ending in -el; output is the same for both stems", () => {
		expect( generateAdjectiveExceptionForms( adjectiveMorphologyDataDE, "dunkel" ) ).toEqual(
			generateAdjectiveExceptionForms( adjectiveMorphologyDataDE, "dunkl" )
		);
	} );

	it( "creates forms for adjectives ending in -er that lose the -er in the stemmer (and that don't have a second stem)", () => {
		expect( generateAdjectiveExceptionForms( adjectiveMorphologyDataDE, "ephem" ) ).toEqual( [
			"ephemer",
			"ephemere",
			"ephemerem",
			"ephemeren",
			"ephemerer",
			"ephemeres",
			"ephemerere",
			"ephemererem",
			"ephemereren",
			"ephemererer",
			"ephemereres",
			"ephemerste",
			"ephemerstem",
			"ephemersten",
			"ephemerster",
			"ephemerstes",
		] );
	} );

	it( "creates forms for adjectives ending in -er class 1", () => {
		expect( generateAdjectiveExceptionForms( adjectiveMorphologyDataDE, "integ" ) ).toEqual( [
			"integer",
			"integere",
			"integerem",
			"integeren",
			"integerer",
			"integeres",
			"integerste",
			"integerstem",
			"integersten",
			"integerster",
			"integerstes",
			"integrer",
			"integrere",
			"integrerem",
			"integreren",
			"integrerer",
			"integreres",
		], );
	} );

	it( "creates forms for adjectives ending in -er class 1; output is the same for both stems", () => {
		expect( generateAdjectiveExceptionForms( adjectiveMorphologyDataDE, "integ" ) ).toEqual(
			generateAdjectiveExceptionForms( adjectiveMorphologyDataDE, "integr" )
		);
	} );

	it( "creates forms for adjectives ending in -er class 2", () => {
		expect( generateAdjectiveExceptionForms( adjectiveMorphologyDataDE, "teu" ) ).toEqual( [
			"teuer",
			"teuerste",
			"teuerstem",
			"teuersten",
			"teuerster",
			"teuerstes",
			"teure",
			"teurem",
			"teuren",
			"teurer",
			"teures",
			"teurere",
			"teurerem",
			"teureren",
			"teurerer",
			"teureres",
		], );
	} );

	it( "creates forms for adjectives ending in -er class 2; output is the same for both stems", () => {
		expect( generateAdjectiveExceptionForms( adjectiveMorphologyDataDE, "teu" ) ).toEqual(
			generateAdjectiveExceptionForms( adjectiveMorphologyDataDE, "teur" )
		);
	} );

	it( "creates forms for adjectives ending in -er class 3", () => {
		expect( generateAdjectiveExceptionForms( adjectiveMorphologyDataDE, "clev" ) ).toEqual( [
			"clever",
			"clevere",
			"cleverem",
			"cleveren",
			"cleverer",
			"cleveres",
			"cleverere",
			"clevererem",
			"clevereren",
			"clevererer",
			"clevereres",
			"cleverste",
			"cleverstem",
			"cleversten",
			"cleverster",
			"cleverstes",
			"clevrer",
			"clevrere",
			"clevrerem",
			"clevreren",
			"clevrerer",
			"clevreres",
		], );
	} );

	it( "creates forms for adjectives ending in -er class 3; output is the same for both stems", () => {
		expect( generateAdjectiveExceptionForms( adjectiveMorphologyDataDE, "clev" ) ).toEqual(
			generateAdjectiveExceptionForms( adjectiveMorphologyDataDE, "clevr" )
		);
	} );


	it( "creates forms for exceptions where the first stem gets suffixed with regular suffixes and the second stem " +
		"gets suffixed with comparative/superlative suffixes", () => {
		expect( generateAdjectiveExceptionForms( adjectiveMorphologyDataDE, "scharf" ) ).toEqual( [
			"scharfe",
			"scharfem",
			"scharfen",
			"scharfer",
			"scharfes",
			"schärfer",
			"schärfere",
			"schärferem",
			"schärferen",
			"schärferer",
			"schärferes",
			"schärfste",
			"schärfstem",
			"schärfsten",
			"schärfster",
			"schärfstes",
		] );
	} );

	it( "creates forms for exceptions where the first stem gets suffixed with regular suffixes and the second stem " +
		"gets suffixed with comparative/superlative suffixes; output is the same for both stems", () => {
		expect( generateAdjectiveExceptionForms( adjectiveMorphologyDataDE, "scharf" ) ).toEqual(
			generateAdjectiveExceptionForms( adjectiveMorphologyDataDE, "schärf" )
		);
	} );

	it( "creates forms for exceptions where the first stem gets suffixed with all suffixes and the second stem " +
		"only gets suffixed with comparative/superlative suffixes", () => {
		expect( generateAdjectiveExceptionForms( adjectiveMorphologyDataDE, "rot" ) ).toEqual( [
			"rote",
			"rotem",
			"roten",
			"roter",
			"rotes",
			"rotere",
			"roterem",
			"roteren",
			"roterer",
			"roteres",
			"roteste",
			"rotestem",
			"rotesten",
			"rotester",
			"rotestes",
			"röter",
			"rötere",
			"röterem",
			"röteren",
			"röterer",
			"röteres",
			"röteste",
			"rötestem",
			"rötesten",
			"rötester",
			"rötestes",
		] );
	} );

	it( "creates forms for exceptions where the first stem gets suffixed with all suffixes and the second stem " +
		"only gets suffixed with comparative/superlative suffixes; output is the same for both stems", () => {
		expect( generateAdjectiveExceptionForms( adjectiveMorphologyDataDE, "rot" ) ).toEqual(
			generateAdjectiveExceptionForms( adjectiveMorphologyDataDE, "röt" )
		);
	} );
} );

describe( "Test for very irrgular adjective exceptions in German", () => {
	const exceptionStems = adjectiveMorphologyDataDE.exceptions;

	const gutForms = [
		"gut",
		"gute",
		"gutem",
		"guten",
		"guter",
		"gutes",
		"besser",
		"bessere",
		"besserem",
		"besseren",
		"besserer",
		"besseres",
		"beste",
		"bestem",
		"besten",
		"bester",
		"bestes",
	];

	const vielForms = [
		"viel",
		"viele",
		"vielem",
		"vielen",
		"vieler",
		"vieles",
		"mehr",
		"meiste",
		"meistem",
		"meisten",
		"meister",
		"meistes",
	];

	const hochForms = [
		"hoch",
		"hohe",
		"hohem",
		"hohen",
		"hoher",
		"hohes",
		"höher",
		"höhere",
		"höherem",
		"höheren",
		"höherer",
		"höheres",
		"höchste",
		"höchstem",
		"höchsten",
		"höchster",
		"höchstes",
	];

	it( "creates forms of the irregular adjective 'gut' for every stem", () => {
		exceptionStems.gut.forEach( function( gutStem ) {
			expect( generateAdjectiveExceptionForms( adjectiveMorphologyDataDE, gutStem ) ).toEqual( gutForms );
		} );
	} );

	it( "creates forms of the irregular adjective 'viel' for every stem", () => {
		exceptionStems.viel.forEach( function( vielStem ) {
			expect( generateAdjectiveExceptionForms( adjectiveMorphologyDataDE, vielStem ) ).toEqual( vielForms );
		} );
	} );

	it( "creates forms of the irregular adjective 'hoch' for every stem", () => {
		exceptionStems.hoch.forEach( function( hochStem ) {
			expect( generateAdjectiveExceptionForms( adjectiveMorphologyDataDE, hochStem ) ).toEqual( hochForms );
		} );
	} );
} );
