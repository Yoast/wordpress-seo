import { generateCorrectStemWithTAndDEnding } from "../../../src/morphology/dutch/getStemWordsWithTAndDEnding";
import getMorphologyData from "../../specHelpers/getMorphologyData";

const morphologyDataNL = getMorphologyData( "nl" ).nl;

describe( "Creates stem from words with ambiguous endings", () => {
	it( "Creates the stem of words whose stem ends in -te, -e should be stemmed even though it is a valid stem ending " +
		"After -e deletion, the stem should undergo stem modification when required", () => {
		expect( generateCorrectStemWithTAndDEnding( morphologyDataNL, "compote" ) ).toEqual(
			"compoot" );
	} );
	it( "Creates the stem of words ending in non-verb past suffix -ten " +
		"In this case, only -en should be deleted and modify the stem when required after suffix deletion.", () => {
		expect( generateCorrectStemWithTAndDEnding( morphologyDataNL, "taarten" ) ).toEqual(
			"taart" );
	} );
	it( "Creates the stem of words ending in non-verb past suffix -ten " +
		"In this case, only -en should be deleted and modify the stem when required after suffix deletion.", () => {
		expect( generateCorrectStemWithTAndDEnding( morphologyDataNL, "castraten" ) ).toEqual(
			"castraat" );
	} );
	it( "creates the stem of words that are listed in words not to be stemmed list.", () => {
		expect( generateCorrectStemWithTAndDEnding( morphologyDataNL, "helft" ) ).toEqual(
			"helft" );
	} );
	it( "Creates the stem of words whose stems ends in non-verb present singular suffix -t " +
		"The ending -t should not be stemmed.", () => {
		expect( generateCorrectStemWithTAndDEnding( morphologyDataNL, "effect" ) ).toEqual(
			"effect" );
	} );
	it( "Creates the stem of words whose stems ends in non-verb present singular suffix -t " +
		"The ending -t should not be stemmed.", () => {
		expect( generateCorrectStemWithTAndDEnding( morphologyDataNL, "baat" ) ).toEqual(
			"baat" );
	} );
	it(  "Creates the stem of words ending in non-verb past suffix -de, -e should be stemmed even though it is a valid stem ending " +
		"After -e deletion, the stem should undergo stem modification", () => {
		expect( generateCorrectStemWithTAndDEnding( morphologyDataNL, "periode" ) ).toEqual(
			"period" );
	} );
	it(  "Creates the stem of words ending in non-verb past suffix -de, -e should be stemmed even though it is a valid stem ending " +
		"After -e deletion, the stem should undergo stem modification", () => {
		expect( generateCorrectStemWithTAndDEnding( morphologyDataNL, "poularde" ) ).toEqual(
			"poulard" );
	} );
	it( "Creates the stem of words whose ends in non-verb past suffix -den " +
		"In this case, only -en should be deleted and modify the stem when required after suffix deletion.", () => {
		expect( generateCorrectStemWithTAndDEnding( morphologyDataNL, "branden" ) ).toEqual(
			"brand" );
	} );
	it( "Creates the stem of words whose ends in non-verb past suffix -den " +
		"Only -en should be deleted and modify the stem when required after suffix deletion.", () => {
		expect( generateCorrectStemWithTAndDEnding( morphologyDataNL, "ontbieden" ) ).toEqual(
			"ontbied" );
	} );
} );
