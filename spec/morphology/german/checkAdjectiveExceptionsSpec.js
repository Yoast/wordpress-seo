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
		], );
	} );

	it( "creates forms for exceptions where both stems get suffixed; input: first stem", () => {
		expect( checkAdjectiveExceptions( morphologyDataDE.adjectives, "makab" ) ).toEqual( [
			"makabere",
			"makaberem",
			"makaberen",
			"makaberer",
			"makaberes",
			"makabre",
			"makabrem",
			"makabren",
			"makabrer",
			"makabres",
		], );
	} );

	it( "creates forms for exceptions where both stems get suffixed; input: second stem", () => {
		expect( checkAdjectiveExceptions( morphologyDataDE.adjectives, "makabr" ) ).toEqual( [
			"makabere",
			"makaberem",
			"makaberen",
			"makaberer",
			"makaberes",
			"makabre",
			"makabrem",
			"makabren",
			"makabrer",
			"makabres",
		], );
	} );
} );
