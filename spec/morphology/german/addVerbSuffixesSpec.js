import { addVerbSuffixes } from "../../../src/morphology/german/addVerbSuffixes";
import { de as morphologyDataDE } from "../../../premium-configuration/data/morphologyData.json";

describe( "Test for getting the right verb suffixes depending on the stem ending", () => {
	it( "adds all verb suffixes for a verb that doesn't fall into any of the modification categories", () => {
		expect( addVerbSuffixes( morphologyDataDE.verbs, "kauf" ) ).toEqual( [
			"kaufe",
			"kauft",
			"kaufst",
			"kaufen",
			"kaufest",
			"kaufet",
			"kaufte",
			"kauftet",
			"kauften",
			"kauftest",
			"kaufete",
			"kaufetet",
			"kaufeten",
			"kaufetest",
			"kaufend",
		] );
	} );

	it( "only adds suffixes starting with e if the stem ends in a t", () => {
		expect( addVerbSuffixes( morphologyDataDE.verbs, "tracht" ) ).toEqual( [
			"trachte",
			"trachten",
			"trachtest",
			"trachtet",
			"trachtete",
			"trachtetet",
			"trachteten",
			"trachtetest",
			"trachtend",
		] );
	} );

	it( "only adds suffixes starting with e if the stem ends in tm", () => {
		expect( addVerbSuffixes( morphologyDataDE.verbs, "atm" ) ).toEqual( [
			"atme",
			"atmen",
			"atmest",
			"atmet",
			"atmete",
			"atmetet",
			"atmeten",
			"atmetest",
			"atmend",
		] );
	} );

	it( "only adds suffixes starting with e if the stem ends in chn", () => {
		expect( addVerbSuffixes( morphologyDataDE.verbs, "rechn" ) ).toEqual( [
			"rechne",
			"rechnen",
			"rechnest",
			"rechnet",
			"rechnete",
			"rechnetet",
			"rechneten",
			"rechnetest",
			"rechnend",
		] );
	} );

	it( "doesn't add the suffix -st if the stem ends in z", () => {
		expect( addVerbSuffixes( morphologyDataDE.verbs, "ritz" ) ).toEqual( [
			"ritze",
			"ritzt",
			"ritzen",
			"ritzest",
			"ritzet",
			"ritzte",
			"ritztet",
			"ritzten",
			"ritztest",
			"ritzete",
			"ritzetet",
			"ritzeten",
			"ritzetest",
			"ritzend",
		] );
	} );

	it( "returns no forms if the stem has an ending that marks it as a non-verbal stem", () => {
		expect( addVerbSuffixes( morphologyDataDE.verbs, "foto" ) ).toEqual( [ ] );
	} );
} );
