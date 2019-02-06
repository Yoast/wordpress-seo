import { checkAdjectiveExceptions } from "../../../src/morphology/german/checkAdjectiveExceptions";
import { de as morphologyDataDE } from "../../../premium-configuration/data/morphologyData.json";

describe( "Test for checking adjective exceptions in German", () => {
	it( "creates forms for exceptions where only one stem gets suffixed; input: first stem", () => {
		expect( checkAdjectiveExceptions( morphologyDataDE.adjectives, "dunkel" ) ).toEqual( [
			"dunkel",
			"dunkle",
			"dunklem",
			"dunklen",
			"dunkler",
			"dunkles",
			"dunklere",
			"dunklerem",
			"dunkleren",
			"dunklerer",
			"dunkleres",
			"dunklste",
			"dunklstem",
			"dunklsten",
			"dunklster",
			"dunklstes",
		], );
	} );

	it( "creates forms for exceptions where only one stem gets suffixed; input: second stem", () => {
		expect( checkAdjectiveExceptions( morphologyDataDE.adjectives, "dunkl" ) ).toEqual( [
			"dunkel",
			"dunkle",
			"dunklem",
			"dunklen",
			"dunkler",
			"dunkles",
			"dunklere",
			"dunklerem",
			"dunkleren",
			"dunklerer",
			"dunkleres",
			"dunklste",
			"dunklstem",
			"dunklsten",
			"dunklster",
			"dunklstes",
		], );
	} );

	it( "creates forms for exceptions where both stems get suffixed; input: first stem", () => {
		expect( checkAdjectiveExceptions( morphologyDataDE.adjectives, "makab" ) ).toEqual( [
			"makabere",
			"makaberem",
			"makaberen",
			"makaberer",
			"makaberes",
			"makaberere",
			"makabererem",
			"makabereren",
			"makabererer",
			"makabereres",
			"makaberste",
			"makaberstem",
			"makabersten",
			"makaberster",
			"makaberstes",
			"makabre",
			"makabrem",
			"makabren",
			"makabrer",
			"makabres",
			"makabrere",
			"makabrerem",
			"makabreren",
			"makabrerer",
			"makabreres",
			"makabrste",
			"makabrstem",
			"makabrsten",
			"makabrster",
			"makabrstes",
		], );
	} );

	it( "creates forms for exceptions where both stems get suffixed; input: second stem", () => {
		expect( checkAdjectiveExceptions( morphologyDataDE.adjectives, "makabr" ) ).toEqual( [
			"makabere",
			"makaberem",
			"makaberen",
			"makaberer",
			"makaberes",
			"makaberere",
			"makabererem",
			"makabereren",
			"makabererer",
			"makabereres",
			"makaberste",
			"makaberstem",
			"makabersten",
			"makaberster",
			"makaberstes",
			"makabre",
			"makabrem",
			"makabren",
			"makabrer",
			"makabres",
			"makabrere",
			"makabrerem",
			"makabreren",
			"makabrerer",
			"makabreres",
			"makabrste",
			"makabrstem",
			"makabrsten",
			"makabrster",
			"makabrstes",
		], );
	} );

	it( "creates forms for exceptions where the first stem gets suffixed with regular suffixes and the second stem " +
		"gets suffixed with comparative/superlative suffixes; input: first stem", () => {
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
		], );
	} );

	it( "creates forms for exceptions where the first stem gets suffixed with regular suffixes and the second stem " +
		"gets suffixed with comparative/superlative suffixes; input: second stem", () => {
		expect( checkAdjectiveExceptions( morphologyDataDE.adjectives, "schärf" ) ).toEqual( [
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
		], );
	} );

	it( "creates forms for exceptions where the first stem gets suffixed with all suffixes and the second stem " +
		"gets only suffixed with comparative/superlative suffixes; input: first stem", () => {
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
		], );
	} );
} );
