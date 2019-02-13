import { checkAdjectiveExceptions } from "../../../src/morphology/german/checkAdjectiveExceptions";
import { de as morphologyDataDE } from "../../../premium-configuration/data/morphologyData.json";

describe( "Test for checking adjective exceptions in German", () => {
	it( "creates forms for exception words ending in -el", () => {
		expect( checkAdjectiveExceptions( morphologyDataDE.adjectives, "dunkel" ) ).toEqual( [
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
		expect( checkAdjectiveExceptions( morphologyDataDE.adjectives, "dunkel" ) ).toEqual(
			checkAdjectiveExceptions( morphologyDataDE.adjectives, "dunkl" )
		);
	} );

	it( "creates forms for adjectives ending in -er that lose the -er in the stemmer (and that don't have a second stem)", () => {
		expect( checkAdjectiveExceptions( morphologyDataDE.adjectives, "ephem" ) ).toEqual( [
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
		expect( checkAdjectiveExceptions( morphologyDataDE.adjectives, "integ" ) ).toEqual( [
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
		expect( checkAdjectiveExceptions( morphologyDataDE.adjectives, "integ" ) ).toEqual(
			checkAdjectiveExceptions( morphologyDataDE.adjectives, "integr" )
		);
	} );

	it( "creates forms for adjectives ending in -er class 2", () => {
		expect( checkAdjectiveExceptions( morphologyDataDE.adjectives, "teu" ) ).toEqual( [
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
		expect( checkAdjectiveExceptions( morphologyDataDE.adjectives, "teu" ) ).toEqual(
			checkAdjectiveExceptions( morphologyDataDE.adjectives, "teur" )
		);
	} );

	it( "creates forms for adjectives ending in -er class 3", () => {
		expect( checkAdjectiveExceptions( morphologyDataDE.adjectives, "clev" ) ).toEqual( [
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
		expect( checkAdjectiveExceptions( morphologyDataDE.adjectives, "clev" ) ).toEqual(
			checkAdjectiveExceptions( morphologyDataDE.adjectives, "clevr" )
		);
	} );


	it( "creates forms for exceptions where the first stem gets suffixed with regular suffixes and the second stem " +
		"gets suffixed with comparative/superlative suffixes", () => {
		expect( checkAdjectiveExceptions( morphologyDataDE.adjectives, "scharf" ) ).toEqual( [
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
		expect( checkAdjectiveExceptions( morphologyDataDE.adjectives, "scharf" ) ).toEqual(
			checkAdjectiveExceptions( morphologyDataDE.adjectives, "schärf" )
		);
	} );

	it( "creates forms for exceptions where the first stem gets suffixed with all suffixes and the second stem " +
		"only gets suffixed with comparative/superlative suffixes", () => {
		expect( checkAdjectiveExceptions( morphologyDataDE.adjectives, "rot" ) ).toEqual( [
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
		expect( checkAdjectiveExceptions( morphologyDataDE.adjectives, "rot" ) ).toEqual(
			checkAdjectiveExceptions( morphologyDataDE.adjectives, "röt" )
		);
	} );
} );
