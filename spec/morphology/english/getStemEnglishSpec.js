import { getStem, getRegularStem, getIrregularStem, getFirstAndShortest } from  "../../../src/morphology/english/getStem.js";
import morphologyData from "../../../premium-configuration/data/morphologyData.json";
const morphologyDataEN = morphologyData.en;

describe( "getFirstAndShortest", function() {
	it( "returns the shortest and the alphabetically-first word from an array", function() {
		expect( getFirstAndShortest( [ "d", "f", "a", "c", "b" ] ) ).toEqual( "a" );
		expect( getFirstAndShortest( [ "d", "f", "ab", "c", "b" ] ) ).toEqual( "b" );
		expect( getFirstAndShortest( [ "wording", "words", "word", "worded", "worder" ] ) ).toEqual( "word" );
		expect( getFirstAndShortest( [ "worded", "worder", "wording" ] ) ).toEqual( "worded" );
		expect( getFirstAndShortest( [ "word" ] ) ).toEqual( "word" );
	} );
} );

describe( "getIrregularStem", function() {
	const nounAndAdjectiveIrregulars = [].concat(
		morphologyDataEN.nouns.irregularNouns,
		morphologyDataEN.adjectives.irregularAdjectives,
	);

	const verbMorphology = morphologyDataEN.verbs;

	it( "does not break if the word is not in the list of irregulars", function() {
		expect( getIrregularStem( "word", nounAndAdjectiveIrregulars, verbMorphology ) ).toEqual( "" );
	} );

	it( "returns the stem of an irregular noun", function() {
		expect( getIrregularStem( "anaesthesia", nounAndAdjectiveIrregulars, verbMorphology ) ).toEqual( "anaesthesia" );
		expect( getIrregularStem( "anaesthesiae", nounAndAdjectiveIrregulars, verbMorphology ) ).toEqual( "anaesthesia" );
		expect( getIrregularStem( "anæsthesia", nounAndAdjectiveIrregulars, verbMorphology ) ).toEqual( "anaesthesia" );
		expect( getIrregularStem( "anæsthesiæ", nounAndAdjectiveIrregulars, verbMorphology ) ).toEqual( "anaesthesia" );
		expect( getIrregularStem( "anaesthesias", nounAndAdjectiveIrregulars, verbMorphology ) ).toEqual( "anaesthesia" );
	} );

	it( "returns the stem of an irregular verb", function() {
		expect( getIrregularStem( "bless", nounAndAdjectiveIrregulars, verbMorphology ) ).toEqual( "bless" );
		expect( getIrregularStem( "blesses", nounAndAdjectiveIrregulars, verbMorphology ) ).toEqual( "bless" );
		expect( getIrregularStem( "blessing", nounAndAdjectiveIrregulars, verbMorphology ) ).toEqual( "bless" );
		expect( getIrregularStem( "blessed", nounAndAdjectiveIrregulars, verbMorphology ) ).toEqual( "bless" );
		expect( getIrregularStem( "blest", nounAndAdjectiveIrregulars, verbMorphology ) ).toEqual( "bless" );
	} );

	it( "returns the stem of an irregular verb with a prefix (which is processed separately)", function() {
		expect( getIrregularStem( "foresee", nounAndAdjectiveIrregulars, verbMorphology ) ).toEqual( "foresee" );
		expect( getIrregularStem( "foresees", nounAndAdjectiveIrregulars, verbMorphology ) ).toEqual( "foresee" );
		expect( getIrregularStem( "foreseeing", nounAndAdjectiveIrregulars, verbMorphology ) ).toEqual( "foresee" );
		expect( getIrregularStem( "foresaw", nounAndAdjectiveIrregulars, verbMorphology ) ).toEqual( "foresee" );
		expect( getIrregularStem( "foreseen", nounAndAdjectiveIrregulars, verbMorphology ) ).toEqual( "foresee" );
	} );

	it( "returns the stem of an irregular adjective", function() {
		expect( getIrregularStem( "good", nounAndAdjectiveIrregulars, verbMorphology ) ).toEqual( "good" );
		expect( getIrregularStem( "well", nounAndAdjectiveIrregulars, verbMorphology ) ).toEqual( "good" );
		expect( getIrregularStem( "better", nounAndAdjectiveIrregulars, verbMorphology ) ).toEqual( "good" );
		expect( getIrregularStem( "best", nounAndAdjectiveIrregulars, verbMorphology ) ).toEqual( "good" );
	} );
} );

describe( "getRegularStem", function() {
	it( "returns the stem of an regular word", function() {
		expect( getRegularStem( "word", morphologyDataEN ) ).toEqual( "word" );
		expect( getRegularStem( "words", morphologyDataEN ) ).toEqual( "word" );
		expect( getRegularStem( "worded", morphologyDataEN ) ).toEqual( "word" );
		expect( getRegularStem( "wording", morphologyDataEN ) ).toEqual( "word" );
		expect( getRegularStem( "worder", morphologyDataEN ) ).toEqual( "word" );
		expect( getRegularStem( "wordest", morphologyDataEN ) ).toEqual( "word" );
		expect( getRegularStem( "wordly", morphologyDataEN ) ).toEqual( "word" );
		expect( getRegularStem( "wordings", morphologyDataEN ) ).toEqual( "word" );

		expect( getRegularStem( "supply", morphologyDataEN ) ).toEqual( "supply" );
		expect( getRegularStem( "supplies", morphologyDataEN ) ).toEqual( "supply" );
		expect( getRegularStem( "supplied", morphologyDataEN ) ).toEqual( "supply" );
		expect( getRegularStem( "supplying", morphologyDataEN ) ).toEqual( "supply" );
		expect( getRegularStem( "supplyings", morphologyDataEN ) ).toEqual( "supply" );
	} );
} );

describe( "getStem", function() {
	it( "returns the stem of a regular word", function() {
		expect( getStem( "word", morphologyDataEN ) ).toEqual( "word" );
		expect( getStem( "words", morphologyDataEN ) ).toEqual( "word" );
		expect( getStem( "worded", morphologyDataEN ) ).toEqual( "word" );
		expect( getStem( "wording", morphologyDataEN ) ).toEqual( "word" );
		expect( getStem( "worder", morphologyDataEN ) ).toEqual( "word" );
		expect( getStem( "wordest", morphologyDataEN ) ).toEqual( "word" );
		expect( getStem( "wordly", morphologyDataEN ) ).toEqual( "word" );
		expect( getStem( "word's", morphologyDataEN ) ).toEqual( "word" );
		expect( getStem( "words's", morphologyDataEN ) ).toEqual( "word" );
		expect( getStem( "words'", morphologyDataEN ) ).toEqual( "word" );
		expect( getStem( "wording's", morphologyDataEN ) ).toEqual( "word" );
		expect( getStem( "wordings'", morphologyDataEN ) ).toEqual( "word" );
		expect( getStem( "wordings's", morphologyDataEN ) ).toEqual( "word" );
		expect( getStem( "wordings", morphologyDataEN ) ).toEqual( "word" );

		expect( getStem( "supply", morphologyDataEN ) ).toEqual( "supply" );
		expect( getStem( "supplies", morphologyDataEN ) ).toEqual( "supply" );
		expect( getStem( "supplied", morphologyDataEN ) ).toEqual( "supply" );
		expect( getStem( "supplying", morphologyDataEN ) ).toEqual( "supply" );
		expect( getStem( "supply's", morphologyDataEN ) ).toEqual( "supply" );
		expect( getStem( "supplies'", morphologyDataEN ) ).toEqual( "supply" );
		expect( getStem( "supplies's", morphologyDataEN ) ).toEqual( "supply" );
		expect( getStem( "supplyings", morphologyDataEN ) ).toEqual( "supply" );
	} );

	it( "returns the stem of an irregular noun", function() {
		expect( getStem( "anaesthesia", morphologyDataEN ) ).toEqual( "anaesthesia" );
		expect( getStem( "anaesthesiae", morphologyDataEN ) ).toEqual( "anaesthesia" );
		expect( getStem( "anæsthesia", morphologyDataEN ) ).toEqual( "anaesthesia" );
		expect( getStem( "anæsthesiæ", morphologyDataEN ) ).toEqual( "anaesthesia" );
		expect( getStem( "anaesthesias", morphologyDataEN ) ).toEqual( "anaesthesia" );
		expect( getStem( "anaesthesia's", morphologyDataEN ) ).toEqual( "anaesthesia" );
		expect( getStem( "anaesthesiae's", morphologyDataEN ) ).toEqual( "anaesthesia" );
		expect( getStem( "anæsthesia's", morphologyDataEN ) ).toEqual( "anaesthesia" );
		expect( getStem( "anæsthesiæ's", morphologyDataEN ) ).toEqual( "anaesthesia" );
		expect( getStem( "anaesthesias's", morphologyDataEN ) ).toEqual( "anaesthesia" );
		expect( getStem( "anaesthesias'", morphologyDataEN ) ).toEqual( "anaesthesia" );
	} );

	it( "returns the stem of an irregular verb/noun", function() {
		expect( getStem( "bless", morphologyDataEN ) ).toEqual( "bless" );
		expect( getStem( "blesses", morphologyDataEN ) ).toEqual( "bless" );
		expect( getStem( "blessing", morphologyDataEN ) ).toEqual( "bless" );
		expect( getStem( "blessed", morphologyDataEN ) ).toEqual( "bless" );
		expect( getStem( "blest", morphologyDataEN ) ).toEqual( "bless" );
		expect( getStem( "blessing's", morphologyDataEN ) ).toEqual( "bless" );
		expect( getStem( "blessings'", morphologyDataEN ) ).toEqual( "bless" );
		expect( getStem( "blessings's", morphologyDataEN ) ).toEqual( "bless" );
		expect( getStem( "blessings", morphologyDataEN ) ).toEqual( "bless" );

		expect( getStem( "foresee", morphologyDataEN ) ).toEqual( "foresee" );
		expect( getStem( "foresees", morphologyDataEN ) ).toEqual( "foresee" );
		expect( getStem( "foreseeing", morphologyDataEN ) ).toEqual( "foresee" );
		expect( getStem( "foresaw", morphologyDataEN ) ).toEqual( "foresee" );
		expect( getStem( "foreseen", morphologyDataEN ) ).toEqual( "foresee" );
		expect( getStem( "foresee's", morphologyDataEN ) ).toEqual( "foresee" );
		expect( getStem( "foresees's", morphologyDataEN ) ).toEqual( "foresee" );
	} );

	it( "returns the stem of an irregular adjective", function() {
		expect( getStem( "good", morphologyDataEN ) ).toEqual( "good" );
		expect( getStem( "well", morphologyDataEN ) ).toEqual( "good" );
		expect( getStem( "better", morphologyDataEN ) ).toEqual( "good" );
		expect( getStem( "best", morphologyDataEN ) ).toEqual( "good" );
		expect( getStem( "goods", morphologyDataEN ) ).toEqual( "good" );
	} );
} );
