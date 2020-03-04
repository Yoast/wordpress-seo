import { generateCorrectStemWithTAndDEnding } from "../../../src/morphology/dutch/getStemWordsWithTAndDEnding";
import getMorphologyData from "../../specHelpers/getMorphologyData";

const morphologyDataNL = getMorphologyData( "nl" ).nl;

describe( "Creates stem from words with ambiguous endings", () => {
	it( "Creates the stem of a word which matches a regex for a word that ends in -te and that should have only the -e stemmed." +
		"It also modifies the stem by doubling the final vowel after removing the -e.", () => {
		expect( generateCorrectStemWithTAndDEnding( morphologyDataNL.stemming, "compote" ) ).toEqual(
			"compoot" );
	} );
	it( "Creates the stem of a word which matches a regex for a word that ends in -ten and that should have only the -en stemmed.", () => {
		expect( generateCorrectStemWithTAndDEnding( morphologyDataNL.stemming, "taarten" ) ).toEqual(
			"taart" );
	} );
	it( "Creates the stem of a word which matches a regex for a word that ends in -ten and that should have only the -en stemmed." +
		"It also modifies the stem by doubling the final vowel after removing the -en.", () => {
		expect( generateCorrectStemWithTAndDEnding( morphologyDataNL.stemming, "castraten" ) ).toEqual(
			"castraat" );
	} );
	it( "Creates the stem of a word which matches a regex for when -t should not be stemmed.", () => {
		expect( generateCorrectStemWithTAndDEnding( morphologyDataNL.stemming, "effect" ) ).toEqual(
			"effect" );
	} );
	it(  "Creates the stem of a word which matches a regex for a word that ends in -de and that should have only the -e stemmed.", () => {
		expect( generateCorrectStemWithTAndDEnding( morphologyDataNL.stemming, "beenharde" ) ).toEqual( "beenhard" );
	} );
	it( "Creates the stem of a word which is in the list of words ending in -den that should only have -en stemmed.", () => {
		expect( generateCorrectStemWithTAndDEnding( morphologyDataNL.stemming, "branden" ) ).toEqual(
			"brand" );
	} );
	it( "Creates the stem of a word which is a compound word with an ending from the exception list of words ending in -en" +
		"which should only have -en stemmed.", () => {
		expect( generateCorrectStemWithTAndDEnding( morphologyDataNL.stemming, "ontbieden" ) ).toEqual(
			"ontbied" );
	} );
	it( "Only stems -ten if the word ends in -tten", () => {
		expect( generateCorrectStemWithTAndDEnding( morphologyDataNL.stemming, "blaatten" ) ).toEqual(
			"blaat" );
	} );
	it( "Stems -t if the word is on the list of verbs that should have the -t stemmed", () => {
		expect( generateCorrectStemWithTAndDEnding( morphologyDataNL.stemming, "roeit" ) ).toEqual(
			"roei" );
	} );
	it( "Stems -d if the word is on the list of verbs that should have the -d stemmed", () => {
		expect( generateCorrectStemWithTAndDEnding( morphologyDataNL.stemming, "vouwden" ) ).toEqual( null );
	} );
	it( "Returns undefined if a word is not matched in any of the checks", () => {
		expect( generateCorrectStemWithTAndDEnding( morphologyDataNL.stemming, "poolt" ) ).toEqual( null );
	} );
	it( "Creates the stem of a word which is in the list of words ending in -end.", () => {
		expect( generateCorrectStemWithTAndDEnding( morphologyDataNL.stemming, "sportend" ) ).toEqual(
			"sport" );
	} );
	it( "Creates the stem of a word which is in the list of words ending in -den that should only have -en stemmed.", () => {
		expect( generateCorrectStemWithTAndDEnding( morphologyDataNL.stemming, "hoofden" ) ).toEqual(
			"hoofd" );
	} );
} );
