import { findShortestAndAlphabeticallyFirst } from  "../../../src/morphology/english/determineStem.js";
import { determineIrregularStem } from  "../../../src/morphology/english/determineStem.js";
import { determineRegularStem } from  "../../../src/morphology/english/determineStem.js";
import { determineStem } from  "../../../src/morphology/english/determineStem.js";

import { en as morphologyDataEN } from "../../../premium-configuration/data/morphologyData.json";

describe( "findShortestAndAlphabeticallyFirst", function() {
	it( "returns the shortest and the alphabetically-first word from an array", function() {
		expect( findShortestAndAlphabeticallyFirst( [ "d", "f", "a", "c", "b" ] ) ).toEqual( "a" );
		expect( findShortestAndAlphabeticallyFirst( [ "d", "f", "ab", "c", "b" ] ) ).toEqual( "b" );
		expect( findShortestAndAlphabeticallyFirst( [ "wording", "words", "word", "worded", "worder" ] ) ).toEqual( "word" );
		expect( findShortestAndAlphabeticallyFirst( [ "worded", "worder", "wording" ] ) ).toEqual( "worded" );
		expect( findShortestAndAlphabeticallyFirst( [ "word" ] ) ).toEqual( "word" );
	} );

	it( "returns undefined if the input array is empty", function() {
		expect( findShortestAndAlphabeticallyFirst( [] ) ).not.toBeDefined();
	} );
} );

describe( "getIrregularStem", function() {
	const nounAndAdjectiveIrregulars = [].concat(
		morphologyDataEN.nouns.irregularNouns,
		morphologyDataEN.adjectives.irregularAdjectives,
	);

	const verbMorphology = morphologyDataEN.verbs;

	it( "returns undefined if the word is not in the list of irregulars", function() {
		expect( determineIrregularStem( "word", nounAndAdjectiveIrregulars, verbMorphology ) ).not.toBeDefined();
	} );

	it( "returns the stem of an irregular noun", function() {
		expect( determineIrregularStem( "anaesthesia", nounAndAdjectiveIrregulars, verbMorphology ) ).toEqual( "anaesthesia" );
		expect( determineIrregularStem( "anaesthesiae", nounAndAdjectiveIrregulars, verbMorphology ) ).toEqual( "anaesthesia" );
		expect( determineIrregularStem( "anæsthesia", nounAndAdjectiveIrregulars, verbMorphology ) ).toEqual( "anaesthesia" );
		expect( determineIrregularStem( "anæsthesiæ", nounAndAdjectiveIrregulars, verbMorphology ) ).toEqual( "anaesthesia" );
		expect( determineIrregularStem( "anaesthesias", nounAndAdjectiveIrregulars, verbMorphology ) ).toEqual( "anaesthesia" );
	} );

	it( "returns the stem of an irregular verb", function() {
		expect( determineIrregularStem( "bless", nounAndAdjectiveIrregulars, verbMorphology ) ).toEqual( "bless" );
		expect( determineIrregularStem( "blesses", nounAndAdjectiveIrregulars, verbMorphology ) ).toEqual( "bless" );
		expect( determineIrregularStem( "blessing", nounAndAdjectiveIrregulars, verbMorphology ) ).toEqual( "bless" );
		expect( determineIrregularStem( "blessed", nounAndAdjectiveIrregulars, verbMorphology ) ).toEqual( "bless" );
		expect( determineIrregularStem( "blest", nounAndAdjectiveIrregulars, verbMorphology ) ).toEqual( "bless" );
	} );

	it( "returns the stem of an irregular verb with a prefix (which is processed separately)", function() {
		expect( determineIrregularStem( "foresee", nounAndAdjectiveIrregulars, verbMorphology ) ).toEqual( "foresee" );
		expect( determineIrregularStem( "foresees", nounAndAdjectiveIrregulars, verbMorphology ) ).toEqual( "foresee" );
		expect( determineIrregularStem( "foreseeing", nounAndAdjectiveIrregulars, verbMorphology ) ).toEqual( "foresee" );
		expect( determineIrregularStem( "foresaw", nounAndAdjectiveIrregulars, verbMorphology ) ).toEqual( "foresee" );
		expect( determineIrregularStem( "foreseen", nounAndAdjectiveIrregulars, verbMorphology ) ).toEqual( "foresee" );
	} );

	it( "returns the stem of an irregular adjective", function() {
		expect( determineIrregularStem( "good", nounAndAdjectiveIrregulars, verbMorphology ) ).toEqual( "good" );
		expect( determineIrregularStem( "well", nounAndAdjectiveIrregulars, verbMorphology ) ).toEqual( "good" );
		expect( determineIrregularStem( "better", nounAndAdjectiveIrregulars, verbMorphology ) ).toEqual( "good" );
		expect( determineIrregularStem( "best", nounAndAdjectiveIrregulars, verbMorphology ) ).toEqual( "good" );
	} );
} );

describe( "getRegularStem", function() {
	it( "returns the stem of an regular word", function() {
		expect( determineRegularStem( "word", morphologyDataEN ) ).toEqual( "word" );
		expect( determineRegularStem( "words", morphologyDataEN ) ).toEqual( "word" );
		expect( determineRegularStem( "worded", morphologyDataEN ) ).toEqual( "word" );
		expect( determineRegularStem( "wording", morphologyDataEN ) ).toEqual( "word" );
		expect( determineRegularStem( "worder", morphologyDataEN ) ).toEqual( "word" );
		expect( determineRegularStem( "wordest", morphologyDataEN ) ).toEqual( "word" );
		expect( determineRegularStem( "wordly", morphologyDataEN ) ).toEqual( "word" );
		expect( determineRegularStem( "wordings", morphologyDataEN ) ).toEqual( "word" );

		expect( determineRegularStem( "supply", morphologyDataEN ) ).toEqual( "supply" );
		expect( determineRegularStem( "supplies", morphologyDataEN ) ).toEqual( "supply" );
		expect( determineRegularStem( "supplied", morphologyDataEN ) ).toEqual( "supply" );
		expect( determineRegularStem( "supplying", morphologyDataEN ) ).toEqual( "supply" );
		expect( determineRegularStem( "supplyings", morphologyDataEN ) ).toEqual( "supply" );

		expect( determineRegularStem( "historic", morphologyDataEN ) ).toEqual( "historical" );
		expect( determineRegularStem( "historical", morphologyDataEN ) ).toEqual( "historical" );
		expect( determineRegularStem( "historically", morphologyDataEN ) ).toEqual( "historical" );

		expect( determineRegularStem( "smart", morphologyDataEN ) ).toEqual( "smart" );
		expect( determineRegularStem( "smarter", morphologyDataEN ) ).toEqual( "smart" );
		expect( determineRegularStem( "smartest", morphologyDataEN ) ).toEqual( "smart" );
		expect( determineRegularStem( "belly", morphologyDataEN ) ).toEqual( "belly" );

		expect( determineRegularStem( "trwprtrw", morphologyDataEN ) ).toEqual( "trwprtrw" );
	} );
} );

describe( "getStem", function() {
	it( "returns the stem of a regular word", function() {
		expect( determineStem( "word", morphologyDataEN ) ).toEqual( "word" );
		expect( determineStem( "words", morphologyDataEN ) ).toEqual( "word" );
		expect( determineStem( "worded", morphologyDataEN ) ).toEqual( "word" );
		expect( determineStem( "wording", morphologyDataEN ) ).toEqual( "word" );
		expect( determineStem( "worder", morphologyDataEN ) ).toEqual( "word" );
		expect( determineStem( "wordest", morphologyDataEN ) ).toEqual( "word" );
		expect( determineStem( "wordly", morphologyDataEN ) ).toEqual( "word" );
		expect( determineStem( "word's", morphologyDataEN ) ).toEqual( "word" );
		expect( determineStem( "words's", morphologyDataEN ) ).toEqual( "word" );
		expect( determineStem( "words'", morphologyDataEN ) ).toEqual( "word" );
		expect( determineStem( "wording's", morphologyDataEN ) ).toEqual( "word" );
		expect( determineStem( "wordings'", morphologyDataEN ) ).toEqual( "word" );
		expect( determineStem( "wordings's", morphologyDataEN ) ).toEqual( "word" );
		expect( determineStem( "wordings", morphologyDataEN ) ).toEqual( "word" );

		expect( determineStem( "supply", morphologyDataEN ) ).toEqual( "supply" );
		expect( determineStem( "supplies", morphologyDataEN ) ).toEqual( "supply" );
		expect( determineStem( "supplied", morphologyDataEN ) ).toEqual( "supply" );
		expect( determineStem( "supplying", morphologyDataEN ) ).toEqual( "supply" );
		expect( determineStem( "supply's", morphologyDataEN ) ).toEqual( "supply" );
		expect( determineStem( "supplies'", morphologyDataEN ) ).toEqual( "supply" );
		expect( determineStem( "supplies's", morphologyDataEN ) ).toEqual( "supply" );
		expect( determineStem( "supplyings", morphologyDataEN ) ).toEqual( "supply" );
	} );

	it( "returns the stem of an irregular noun", function() {
		expect( determineStem( "anaesthesia", morphologyDataEN ) ).toEqual( "anaesthesia" );
		expect( determineStem( "anaesthesiae", morphologyDataEN ) ).toEqual( "anaesthesia" );
		expect( determineStem( "anæsthesia", morphologyDataEN ) ).toEqual( "anaesthesia" );
		expect( determineStem( "anæsthesiæ", morphologyDataEN ) ).toEqual( "anaesthesia" );
		expect( determineStem( "anaesthesias", morphologyDataEN ) ).toEqual( "anaesthesia" );
		expect( determineStem( "anaesthesia's", morphologyDataEN ) ).toEqual( "anaesthesia" );
		expect( determineStem( "anaesthesiae's", morphologyDataEN ) ).toEqual( "anaesthesia" );
		expect( determineStem( "anæsthesia's", morphologyDataEN ) ).toEqual( "anaesthesia" );
		expect( determineStem( "anæsthesiæ's", morphologyDataEN ) ).toEqual( "anaesthesia" );
		expect( determineStem( "anaesthesias's", morphologyDataEN ) ).toEqual( "anaesthesia" );
		expect( determineStem( "anaesthesias'", morphologyDataEN ) ).toEqual( "anaesthesia" );
	} );

	it( "returns the stem of an irregular verb/noun", function() {
		expect( determineStem( "bless", morphologyDataEN ) ).toEqual( "bless" );
		expect( determineStem( "blesses", morphologyDataEN ) ).toEqual( "bless" );
		expect( determineStem( "blessing", morphologyDataEN ) ).toEqual( "bless" );
		expect( determineStem( "blessed", morphologyDataEN ) ).toEqual( "bless" );
		expect( determineStem( "blest", morphologyDataEN ) ).toEqual( "bless" );
		expect( determineStem( "blessing's", morphologyDataEN ) ).toEqual( "bless" );
		expect( determineStem( "blessings'", morphologyDataEN ) ).toEqual( "bless" );
		expect( determineStem( "blessings's", morphologyDataEN ) ).toEqual( "bless" );
		expect( determineStem( "blessings", morphologyDataEN ) ).toEqual( "bless" );

		expect( determineStem( "foresee", morphologyDataEN ) ).toEqual( "foresee" );
		expect( determineStem( "foresees", morphologyDataEN ) ).toEqual( "foresee" );
		expect( determineStem( "foreseeing", morphologyDataEN ) ).toEqual( "foresee" );
		expect( determineStem( "foresaw", morphologyDataEN ) ).toEqual( "foresee" );
		expect( determineStem( "foreseen", morphologyDataEN ) ).toEqual( "foresee" );
		expect( determineStem( "foresee's", morphologyDataEN ) ).toEqual( "foresee" );
		expect( determineStem( "foresees's", morphologyDataEN ) ).toEqual( "foresee" );
	} );

	it( "returns the stem of an irregular adjective", function() {
		expect( determineStem( "good", morphologyDataEN ) ).toEqual( "good" );
		expect( determineStem( "well", morphologyDataEN ) ).toEqual( "good" );
		expect( determineStem( "better", morphologyDataEN ) ).toEqual( "good" );
		expect( determineStem( "best", morphologyDataEN ) ).toEqual( "good" );
		expect( determineStem( "goods", morphologyDataEN ) ).toEqual( "good" );
	} );

	it( "returns the word itself if no morphologyData is available", function() {
		expect( determineStem( "good", false ) ).toEqual( "good" );
		expect( determineStem( "well", false ) ).toEqual( "well" );
		expect( determineStem( "better", false ) ).toEqual( "better" );
		expect( determineStem( "best", false ) ).toEqual( "best" );
		expect( determineStem( "goods", false ) ).toEqual( "goods" );
	} );
} );
