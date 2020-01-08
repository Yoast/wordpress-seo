import { createVerbFormsWithTAndDEndings } from "../../../src/morphology/dutch/createVerbFormsWithTAndDEndings";
import getMorphologyData from "../../specHelpers/getMorphologyData";

const morphologyDataNL = getMorphologyData( "nl" ).nl;

describe( "Creates forms form stem from words with ambiguous endings", () => {
	it( "creates additional forms for ambiguous stems ending in -t/-d; input: verb that's not on exception list", () => {
		expect( createVerbFormsWithTAndDEndings( morphologyDataNL, "dreunt" ) ).toEqual( [
			"dreunt",
			"dreunde",
			"dreunden",
			"dreunen",
			"dreunend",
		] );
	} );
	it( "creates additional forms for ambiguous stems ending in -t/-d; input: verb that's not on exception list", () => {
		expect( createVerbFormsWithTAndDEndings( morphologyDataNL, "lent" ) ).toEqual( [
			"lent",
			"lende",
			"lenden",
			"lennen",
			"lennend",
		] );
	} );
	it( "creates additional forms for ambiguous stems ending in -t/-d; input: verb that's not on exception list", () => {
		expect( createVerbFormsWithTAndDEndings( morphologyDataNL, "wend" ) ).toEqual( [
			"went",
			"wende",
			"wenden",
			"wennen",
			"wennend",
		] );
	} );
	it( "creates additional forms for ambiguous stems ending in -t/-d; input: verb that's not on exception list", () => {
		expect( createVerbFormsWithTAndDEndings( morphologyDataNL, "diend" ) ).toEqual( [
			"dient",
			"diende",
			"dienden",
			"dienen",
			"dienend",
		] );
	} );
	it( "creates additional forms for ambiguous stems ending in -t/-d; input: verb that's on an exception list", () => {
		expect( createVerbFormsWithTAndDEndings( morphologyDataNL, "begint" ) ).toEqual( [
			"begin",
			"beginnen",
			"beginnend",
			"begint",
			"begon",
			"begonnen",
		] );
	} );
	it( "doesn't create additional forms for stems that do not end in -t/-d", () => {
		expect( createVerbFormsWithTAndDEndings( morphologyDataNL, "zwik" ) ).toBeNull();
	} );
	it( "doesn't create additional forms for past participle ending in -t/-d", () => {
		expect( createVerbFormsWithTAndDEndings( morphologyDataNL, "geaaid" ) ).toBeNull();
	} );
} );
