import { getForms } from "../../../src/morphology/german/getForms";
import morphologyData from "../../../premium-configuration/data/morphologyData.json";
const morphologyDataDE = morphologyData.de;

describe( "Test for creating forms from German nouns", () => {
	it( "creates noun forms with regular suffixes for nouns that aren't included on any exception list", () => {
		expect( getForms( "studenten", morphologyDataDE ) ).toEqual( [
			"studenten",
			"studente",
			"studenten",
			"studentens",
			"studenter",
			"studentern",
			"studenters",
			"studentes",
			"students",
		] );
	} );

	it( "creates noun forms for a singular noun on the stemsWithUmlaut exception list", () => {
		expect( getForms( "stadt", morphologyDataDE ) ).toEqual( [
			"stadt",
			"städte",
			"städten",
		] );
	} );

	it( "creates noun forms for a plural noun on the stemsWithUmlaut exception list", () => {
		expect( getForms( "städte", morphologyDataDE ) ).toEqual( [
			"städte",
			"stadt",
			"städten",
		] );
	} );

	it( "creates noun forms for a compound noun on the stemsWithUmlaut exception list", () => {
		expect( getForms( "hauptstadt", morphologyDataDE ) ).toEqual( [
			"hauptstadt",
			"hauptstädte",
			"hauptstädten",
		] );
	} );

	it( "creates noun forms for a singular noun on the stemsWithSReduplication exception list", () => {
		expect( getForms( "fokus", morphologyDataDE ) ).toEqual( [
			"fokus",
			"fokusse",
			"fokussen",
		] );
	} );

	it( "creates noun forms for a plural noun on the stemsWithSReduplication exception list", () => {
		/*
		 * For this noun, also the stemsWithUmlaut word "kuss" matches, hence there are more forms than
		 * for the singular noun.
		 */
		expect( getForms( "fokusse", morphologyDataDE ) ).toEqual( [
			"fokusse",
			"fokuss",
			"fokusses",
			"foküsse",
			"foküssen",
		] );
	} );

	it( "creates noun forms for a compound noun on the stemsWithSReduplication exception list", () => {
		expect( getForms( "autofokus", morphologyDataDE ) ).toEqual( [
			"autofokus",
			"autofokusse",
			"autofokussen",
		] );
	} );
} );
