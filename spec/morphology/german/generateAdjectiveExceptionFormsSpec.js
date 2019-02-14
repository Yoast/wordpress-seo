import { generateAdjectiveExceptionForms } from "../../../src/morphology/german/generateAdjectiveExceptionForms";
import { de as morphologyDataDE } from "../../../premium-configuration/data/morphologyData.json";

describe( "Test for checking adjective exceptions in German", () => {
	it( "creates forms for exception words ending in -el", () => {
		expect( generateAdjectiveExceptionForms( morphologyDataDE.adjectives, "dunkel" ) ).toEqual( [
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
		expect( generateAdjectiveExceptionForms( morphologyDataDE.adjectives, "dunkel" ) ).toEqual(
			generateAdjectiveExceptionForms( morphologyDataDE.adjectives, "dunkl" )
		);
	} );

	it( "creates forms for adjectives ending in -er that lose the -er in the stemmer (and that don't have a second stem)", () => {
		expect( generateAdjectiveExceptionForms( morphologyDataDE.adjectives, "ephem" ) ).toEqual( [
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
		expect( generateAdjectiveExceptionForms( morphologyDataDE.adjectives, "integ" ) ).toEqual( [
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
		expect( generateAdjectiveExceptionForms( morphologyDataDE.adjectives, "integ" ) ).toEqual(
			generateAdjectiveExceptionForms( morphologyDataDE.adjectives, "integr" )
		);
	} );

	it( "creates forms for adjectives ending in -er class 2", () => {
		expect( generateAdjectiveExceptionForms( morphologyDataDE.adjectives, "teu" ) ).toEqual( [
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
		expect( generateAdjectiveExceptionForms( morphologyDataDE.adjectives, "teu" ) ).toEqual(
			generateAdjectiveExceptionForms( morphologyDataDE.adjectives, "teur" )
		);
	} );

	it( "creates forms for adjectives ending in -er class 3", () => {
		expect( generateAdjectiveExceptionForms( morphologyDataDE.adjectives, "clev" ) ).toEqual( [
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
		expect( generateAdjectiveExceptionForms( morphologyDataDE.adjectives, "clev" ) ).toEqual(
			generateAdjectiveExceptionForms( morphologyDataDE.adjectives, "clevr" )
		);
	} );


	it( "creates forms for exceptions where the first stem gets suffixed with regular suffixes and the second stem " +
		"gets suffixed with comparative/superlative suffixes", () => {
		expect( generateAdjectiveExceptionForms( morphologyDataDE.adjectives, "scharf" ) ).toEqual( [
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
		expect( generateAdjectiveExceptionForms( morphologyDataDE.adjectives, "scharf" ) ).toEqual(
			generateAdjectiveExceptionForms( morphologyDataDE.adjectives, "schärf" )
		);
	} );

	it( "creates forms for exceptions where the first stem gets suffixed with all suffixes and the second stem " +
		"only gets suffixed with comparative/superlative suffixes", () => {
		expect( generateAdjectiveExceptionForms( morphologyDataDE.adjectives, "rot" ) ).toEqual( [
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
		expect( generateAdjectiveExceptionForms( morphologyDataDE.adjectives, "rot" ) ).toEqual(
			generateAdjectiveExceptionForms( morphologyDataDE.adjectives, "röt" )
		);
	} );
} );
