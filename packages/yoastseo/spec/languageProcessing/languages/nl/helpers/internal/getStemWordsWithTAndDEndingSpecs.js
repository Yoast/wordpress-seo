import { generateCorrectStemWithTAndDEnding } from "../../../../../../src/languageProcessing/languages/nl/helpers/internal/getStemWordsWithTAndDEnding";
import getMorphologyData from "../../../../../specHelpers/getMorphologyData";

const morphologyDataNL = getMorphologyData( "nl" ).nl;

describe( "Creates stem from words with ambiguous endings", () => {
	it( "Creates the stem of a word which matches a regex for a word that ends in -te and that should have only the -e stemmed." +
		"It also modifies the stem by doubling the final vowel after removing the -e.", () => {
		expect( generateCorrectStemWithTAndDEnding( morphologyDataNL, "compote" ) ).toEqual(
			"compoot" );
	} );
	it( "Creates the stem of a word which matches a regex for a word that ends in -ten and that should have only the -en stemmed.", () => {
		expect( generateCorrectStemWithTAndDEnding( morphologyDataNL, "taarten" ) ).toEqual(
			"taart" );
	} );
	it( "Creates the stem of a word which matches a regex for a word that ends in -ten and that should have only the -en stemmed." +
		"It also modifies the stem by doubling the final vowel after removing the -en.", () => {
		expect( generateCorrectStemWithTAndDEnding( morphologyDataNL, "castraten" ) ).toEqual(
			"castraat" );
	} );
	it( "Creates the stem of a word which matches a regex for when -t should not be stemmed.", () => {
		expect( generateCorrectStemWithTAndDEnding( morphologyDataNL, "effect" ) ).toEqual(
			"effect" );
	} );
	it(  "Creates the stem of a word which matches a regex for a word that ends in -de and that should have only the -e stemmed.", () => {
		expect( generateCorrectStemWithTAndDEnding( morphologyDataNL, "beenharde" ) ).toEqual( "beenhard" );
	} );
	it( "Creates the stem of a word which is in the endingMatch list of words ending in -den that should only have -en stemmed.", () => {
		expect( generateCorrectStemWithTAndDEnding( morphologyDataNL, "honden" ) ).toEqual(
			"hond" );
	} );
	it( "Creates the stem of a compound word which ends with a word on the endingMatch sub-list of words ending in -den " +
		"that should only have -en stemmed.", () => {
		expect( generateCorrectStemWithTAndDEnding( morphologyDataNL, "zeehonden" ) ).toEqual(
			"zeehond" );
	} );
	it( "Creates the stem of a word which is on the verbs sub-list of the exception list of words ending in -en" +
		"which should only have -en stemmed.", () => {
		expect( generateCorrectStemWithTAndDEnding( morphologyDataNL,  "bieden" ) ).toEqual(
			"bied" );
	} );
	it( "Creates the stem of a past-tense verb that ends in -den and that should have -den stemmed.", () => {
		expect( generateCorrectStemWithTAndDEnding( morphologyDataNL, "aanblaasden" ) ).toEqual(
			"aanblaas" );
		expect( generateCorrectStemWithTAndDEnding( morphologyDataNL, "aandurfden" ) ).toEqual(
			"aandurf" );
	} );
	it( "Creates the stem of a compound word which ends with a word from the verbs sub-list of the exception list of words ending in -en" +
		"which should only have -en stemmed.", () => {
		expect( generateCorrectStemWithTAndDEnding( morphologyDataNL,  "ontbieden" ) ).toEqual(
			"ontbied" );
	} );
	it( "Only stems -ten if the word ends in -tten", () => {
		expect( generateCorrectStemWithTAndDEnding( morphologyDataNL, "blaatten" ) ).toEqual(
			"blaat" );
	} );
	it( "Stems -t if the word is on the list of verbs that should have the -t stemmed", () => {
		expect( generateCorrectStemWithTAndDEnding( morphologyDataNL, "roeit" ) ).toEqual(
			"roei" );
	} );
	it( "Returns undefined if a word is not matched in any of the checks", () => {
		expect( generateCorrectStemWithTAndDEnding( morphologyDataNL, "poolt" ) ).toEqual( null );
	} );
	it( "Returns null if a word is not matched in any of the checks", () => {
		expect( generateCorrectStemWithTAndDEnding( morphologyDataNL, "vouwden" ) ).toBeNull();
	} );
	it( "Returns null if a word is not matched in any of the checks", () => {
		expect( generateCorrectStemWithTAndDEnding( morphologyDataNL, "poolt" ) ).toBeNull();
	} );
	it( "Creates the stem of a word which is in the list of words ending in -end.", () => {
		expect( generateCorrectStemWithTAndDEnding( morphologyDataNL, "sportend" ) ).toEqual(
			"sport" );
	} );
	it( "Creates the stem of a word which is in the list of words ending in -den that should only have -en stemmed.", () => {
		expect( generateCorrectStemWithTAndDEnding( morphologyDataNL, "hoofden" ) ).toEqual(
			"hoofd" );
	} );
	it( "Creates the stem of a word which is in the list of words ending in -den that should only have -en stemmed," +
		"and which requires vowel doubling.", () => {
		expect( generateCorrectStemWithTAndDEnding( morphologyDataNL, "daden" ) ).toEqual(
			"daad" );
	} );
} );
