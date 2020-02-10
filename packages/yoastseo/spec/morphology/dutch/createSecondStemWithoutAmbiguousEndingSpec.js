import { createSecondStemWithoutAmbiguousEnding } from "../../../src/morphology/dutch/createSecondStemWithoutAmbiguousEnding";
import getMorphologyData from "../../specHelpers/getMorphologyData";

const morphologyDataNL = getMorphologyData( "nl" ).nl;

describe( "Creates forms form stem from words with ambiguous endings", () => {
	it( "Removes the -t from the end of a stem which was not matched in a previous check", () => {
		expect( createSecondStemWithoutAmbiguousEnding( morphologyDataNL, "dreunt", "dreunt" ) ).toEqual( "dreun" );
	} );
	it( "Removes the -d from the end of a stem which was not matched in a previous check", () => {
		expect( createSecondStemWithoutAmbiguousEnding( morphologyDataNL, "wend", "wend" ) ).toEqual( "wen" );
	} );
	it( "doesn't additionally stem a stem that does not end in -t/-d", () => {
		expect( createSecondStemWithoutAmbiguousEnding( morphologyDataNL, "zwik", "zwik" ) ).toBeNull();
	} );
	it( "doesn't stem a past participle ending in -t/-d", () => {
		expect( createSecondStemWithoutAmbiguousEnding( morphologyDataNL, "aai", "geaaid" ) ).toBeNull();
	} );
} );
