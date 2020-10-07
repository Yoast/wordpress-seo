import { findShortestAndAlphabeticallyFirst } from "../../../src/languageProcessing/languages/en/morphology/determineStem.js";
import { determineIrregularStem } from "../../../src/languageProcessing/languages/en/morphology/determineStem.js";
import { determineIrregularVerbStem } from "../../../src/languageProcessing/languages/en/morphology/determineStem.js";
import { determineRegularStem } from "../../../src/languageProcessing/languages/en/morphology/determineStem.js";
import { determineStem } from "../../../src/languageProcessing/languages/en/morphology/determineStem.js";
import getMorphologyData from "../../specHelpers/getMorphologyData";


const morphologyDataEN = getMorphologyData( "en" ).en;

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

describe( "determineIrregularStem and determineIrregularVerbStem", function() {
	const nounIrregulars = morphologyDataEN.nouns.irregularNouns;
	const adjectiveIrregulars = morphologyDataEN.adjectives.irregularAdjectives;

	const verbMorphology = morphologyDataEN.verbs;

	it( "returns undefined if the word is not in the list of irregulars", function() {
		expect( determineIrregularStem( "word", nounIrregulars ) ).toBeNull();
		expect( determineIrregularVerbStem( "word", verbMorphology ) ).toBeNull();
	} );

	it( "returns the stem of an irregular noun", function() {
		expect( determineIrregularStem( "anaesthesia", nounIrregulars ) ).toEqual( "anaesthesia" );
		expect( determineIrregularStem( "anaesthesiae", nounIrregulars ) ).toEqual( "anaesthesia" );
		expect( determineIrregularStem( "anæsthesia", nounIrregulars ) ).toEqual( "anaesthesia" );
		expect( determineIrregularStem( "anæsthesiæ", nounIrregulars ) ).toEqual( "anaesthesia" );
		expect( determineIrregularStem( "anaesthesias", nounIrregulars ) ).toEqual( "anaesthesia" );
	} );

	it( "returns the stem of an irregular adjective", function() {
		expect( determineIrregularStem( "good", adjectiveIrregulars ) ).toEqual( "good" );
		expect( determineIrregularStem( "well", adjectiveIrregulars ) ).toEqual( "good" );
		expect( determineIrregularStem( "better", adjectiveIrregulars ) ).toEqual( "good" );
		expect( determineIrregularStem( "best", adjectiveIrregulars ) ).toEqual( "good" );
	} );

	it( "returns the stem of an irregular verb", function() {
		expect( determineIrregularVerbStem( "bless", verbMorphology ) ).toEqual( "bless" );
		expect( determineIrregularVerbStem( "blesses", verbMorphology ) ).toEqual( "bless" );
		expect( determineIrregularVerbStem( "blessing", verbMorphology ) ).toEqual( "bless" );
		expect( determineIrregularVerbStem( "blessed", verbMorphology ) ).toEqual( "bless" );
		expect( determineIrregularVerbStem( "blest", verbMorphology ) ).toEqual( "bless" );
	} );

	it( "returns the stem of an irregular verb with a prefix (which is processed separately)", function() {
		expect( determineIrregularVerbStem( "foresee", verbMorphology ) ).toEqual( "foresee" );
		expect( determineIrregularVerbStem( "foresees", verbMorphology ) ).toEqual( "foresee" );
		expect( determineIrregularVerbStem( "foreseeing", verbMorphology ) ).toEqual( "foresee" );
		expect( determineIrregularVerbStem( "foresaw", verbMorphology ) ).toEqual( "foresee" );
		expect( determineIrregularVerbStem( "foreseen", verbMorphology ) ).toEqual( "foresee" );
	} );
} );

describe( "determineRegularStem", function() {
	it( "returns the stem of an regular word", function() {
		expect( determineRegularStem( "word", morphologyDataEN ) ).toEqual( "word" );
		expect( determineRegularStem( "words", morphologyDataEN ) ).toEqual( "word" );
		expect( determineRegularStem( "worded", morphologyDataEN ) ).toEqual( "word" );
		expect( determineRegularStem( "wording", morphologyDataEN ) ).toEqual( "word" );
		expect( determineRegularStem( "worder", morphologyDataEN ) ).toEqual( "word" );
		expect( determineRegularStem( "wordest", morphologyDataEN ) ).toEqual( "word" );
		expect( determineRegularStem( "wordly", morphologyDataEN ) ).toEqual( "word" );
		expect( determineRegularStem( "wordings", morphologyDataEN ) ).toEqual( "word" );

		expect( determineRegularStem( "tomato", morphologyDataEN ) ).toEqual( "tomato" );
		expect( determineRegularStem( "tomatos", morphologyDataEN ) ).toEqual( "tomato" );
		expect( determineRegularStem( "tomatoes", morphologyDataEN ) ).toEqual( "tomato" );

		expect( determineRegularStem( "bonus", morphologyDataEN ) ).toEqual( "bonus" );
		expect( determineRegularStem( "bonuses", morphologyDataEN ) ).toEqual( "bonus" );
		expect( determineRegularStem( "bonused", morphologyDataEN ) ).toEqual( "bonus" );
		expect( determineRegularStem( "bonusing", morphologyDataEN ) ).toEqual( "bonus" );
		expect( determineRegularStem( "bonusings", morphologyDataEN ) ).toEqual( "bonus" );

		expect( determineRegularStem( "supply", morphologyDataEN ) ).toEqual( "supply" );
		expect( determineRegularStem( "supplies", morphologyDataEN ) ).toEqual( "supply" );
		expect( determineRegularStem( "supplied", morphologyDataEN ) ).toEqual( "supply" );
		expect( determineRegularStem( "supplying", morphologyDataEN ) ).toEqual( "supply" );
		expect( determineRegularStem( "supplyings", morphologyDataEN ) ).toEqual( "supply" );
		expect( determineRegularStem( "supplier", morphologyDataEN ) ).toEqual( "supply" );

		expect( determineRegularStem( "release", morphologyDataEN ) ).toEqual( "release" );
		expect( determineRegularStem( "releases", morphologyDataEN ) ).toEqual( "release" );
		expect( determineRegularStem( "released", morphologyDataEN ) ).toEqual( "release" );
		expect( determineRegularStem( "releasing", morphologyDataEN ) ).toEqual( "release" );
		expect( determineRegularStem( "releasings", morphologyDataEN ) ).toEqual( "release" );

		expect( determineRegularStem( "historic", morphologyDataEN ) ).toEqual( "historical" );
		expect( determineRegularStem( "historical", morphologyDataEN ) ).toEqual( "historical" );
		expect( determineRegularStem( "historically", morphologyDataEN ) ).toEqual( "historical" );

		expect( determineRegularStem( "pathetic", morphologyDataEN ) ).toEqual( "pathetical" );
		expect( determineRegularStem( "pathetical", morphologyDataEN ) ).toEqual( "pathetical" );
		expect( determineRegularStem( "pathetically", morphologyDataEN ) ).toEqual( "pathetical" );

		expect( determineRegularStem( "smart", morphologyDataEN ) ).toEqual( "smart" );
		expect( determineRegularStem( "smarter", morphologyDataEN ) ).toEqual( "smart" );
		expect( determineRegularStem( "smartest", morphologyDataEN ) ).toEqual( "smart" );

		// The following words appear -er/-est/-ly forms of adjectives, so we need to make sure they are stemmed correctly.
		expect( determineRegularStem( "paper", morphologyDataEN ) ).toEqual( "paper" );
		expect( determineRegularStem( "beer", morphologyDataEN ) ).toEqual( "beer" );
		expect( determineRegularStem( "partner", morphologyDataEN ) ).toEqual( "partner" );
		expect( determineRegularStem( "interest", morphologyDataEN ) ).toEqual( "interest" );
		expect( determineRegularStem( "zest", morphologyDataEN ) ).toEqual( "zest" );
		expect( determineRegularStem( "belly", morphologyDataEN ) ).toEqual( "belly" );

		expect( determineRegularStem( "analysis", morphologyDataEN ) ).toEqual( "analysis" );

		expect( determineRegularStem( "trwprtrw", morphologyDataEN ) ).toEqual( "trwprtrw" );
	} );
} );

describe( "determineStem", function() {
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

		expect( determineStem( "tomato", morphologyDataEN ) ).toEqual( "tomato" );
		expect( determineStem( "tomatos", morphologyDataEN ) ).toEqual( "tomato" );
		expect( determineStem( "tomatoes", morphologyDataEN ) ).toEqual( "tomato" );
		expect( determineStem( "tomato's", morphologyDataEN ) ).toEqual( "tomato" );
		expect( determineStem( "tomatos'", morphologyDataEN ) ).toEqual( "tomato" );
		expect( determineStem( "tomatos's", morphologyDataEN ) ).toEqual( "tomato" );
		expect( determineStem( "tomatoes's", morphologyDataEN ) ).toEqual( "tomato" );

		expect( determineStem( "town", morphologyDataEN ) ).toEqual( "town" );
		expect( determineStem( "towns", morphologyDataEN ) ).toEqual( "town" );

		expect( determineStem( "supply", morphologyDataEN ) ).toEqual( "supply" );
		expect( determineStem( "supplies", morphologyDataEN ) ).toEqual( "supply" );
		expect( determineStem( "supplied", morphologyDataEN ) ).toEqual( "supply" );
		expect( determineStem( "supplying", morphologyDataEN ) ).toEqual( "supply" );
		expect( determineStem( "supply's", morphologyDataEN ) ).toEqual( "supply" );
		expect( determineStem( "supplies'", morphologyDataEN ) ).toEqual( "supply" );
		expect( determineStem( "supplies's", morphologyDataEN ) ).toEqual( "supply" );
		expect( determineStem( "supplyings", morphologyDataEN ) ).toEqual( "supply" );
	} );

	it( "returns the stem of verbal forms that should get -e at the end", function() {
		expect( determineStem( "sharing", morphologyDataEN ) ).toEqual( "share" );
		expect( determineStem( "shared", morphologyDataEN ) ).toEqual( "share" );
		expect( determineStem( "shares", morphologyDataEN ) ).toEqual( "share" );

		expect( determineStem( "improving", morphologyDataEN ) ).toEqual( "improve" );
		expect( determineStem( "improved", morphologyDataEN ) ).toEqual( "improve" );
		expect( determineStem( "improves", morphologyDataEN ) ).toEqual( "improve" );

		expect( determineStem( "competing", morphologyDataEN ) ).toEqual( "compete" );
		expect( determineStem( "competed", morphologyDataEN ) ).toEqual( "compete" );
		expect( determineStem( "competes", morphologyDataEN ) ).toEqual( "compete" );

		expect( determineStem( "scheduling", morphologyDataEN ) ).toEqual( "schedule" );
		expect( determineStem( "scheduled", morphologyDataEN ) ).toEqual( "schedule" );
		expect( determineStem( "schedules", morphologyDataEN ) ).toEqual( "schedule" );

		expect( determineStem( "typing", morphologyDataEN ) ).toEqual( "type" );
		expect( determineStem( "typed", morphologyDataEN ) ).toEqual( "type" );
		expect( determineStem( "types", morphologyDataEN ) ).toEqual( "type" );

		expect( determineStem( "releases", morphologyDataEN ) ).toEqual( "release" );
		expect( determineStem( "releasing", morphologyDataEN ) ).toEqual( "release" );
		expect( determineStem( "released", morphologyDataEN ) ).toEqual( "release" );

		expect( determineStem( "prepares", morphologyDataEN ) ).toEqual( "prepare" );
		expect( determineStem( "preparing", morphologyDataEN ) ).toEqual( "prepare" );
		expect( determineStem( "prepared", morphologyDataEN ) ).toEqual( "prepare" );

		expect( determineStem( "move", morphologyDataEN ) ).toEqual( "move" );
		expect( determineStem( "moved", morphologyDataEN ) ).toEqual( "move" );
		expect( determineStem( "moving", morphologyDataEN ) ).toEqual( "move" );
		expect( determineStem( "moves", morphologyDataEN ) ).toEqual( "move" );

		expect( determineStem( "amazing", morphologyDataEN ) ).toEqual( "amaze" );
		expect( determineStem( "amazed", morphologyDataEN ) ).toEqual( "amaze" );
		expect( determineStem( "amazes", morphologyDataEN ) ).toEqual( "amaze" );

		expect( determineStem( "specializing", morphologyDataEN ) ).toEqual( "specialize" );
		expect( determineStem( "specialized", morphologyDataEN ) ).toEqual( "specialize" );
		expect( determineStem( "specializes", morphologyDataEN ) ).toEqual( "specialize" );

		expect( determineStem( "optimizing", morphologyDataEN ) ).toEqual( "optimize" );
		expect( determineStem( "optimized", morphologyDataEN ) ).toEqual( "optimize" );
		expect( determineStem( "optimizes", morphologyDataEN ) ).toEqual( "optimize" );
	} );

	it( "returns the stem of verbal forms that should NOT get -e at the end", function() {
		expect( determineStem( "doom", morphologyDataEN ) ).toEqual( "doom" );
		expect( determineStem( "doomed", morphologyDataEN ) ).toEqual( "doom" );
		expect( determineStem( "dooming", morphologyDataEN ) ).toEqual( "doom" );
		expect( determineStem( "dooms", morphologyDataEN ) ).toEqual( "doom" );

		expect( determineStem( "load", morphologyDataEN ) ).toEqual( "load" );
		expect( determineStem( "loaded", morphologyDataEN ) ).toEqual( "load" );
		expect( determineStem( "loading", morphologyDataEN ) ).toEqual( "load" );
		expect( determineStem( "loads", morphologyDataEN ) ).toEqual( "load" );

		expect( determineStem( "develop", morphologyDataEN ) ).toEqual( "develop" );
		expect( determineStem( "developed", morphologyDataEN ) ).toEqual( "develop" );
		expect( determineStem( "developing", morphologyDataEN ) ).toEqual( "develop" );
		expect( determineStem( "develops", morphologyDataEN ) ).toEqual( "develop" );
	} );

	it( "returns the stem of verbs with doubling consonant at the end of the stem", function() {
		expect( determineStem( "prefer", morphologyDataEN ) ).toEqual( "prefer" );
		expect( determineStem( "preferring", morphologyDataEN ) ).toEqual( "prefer" );
		expect( determineStem( "prefers", morphologyDataEN ) ).toEqual( "prefer" );
		expect( determineStem( "preferred", morphologyDataEN ) ).toEqual( "prefer" );

		expect( determineStem( "program", morphologyDataEN ) ).toEqual( "program" );
		expect( determineStem( "programming", morphologyDataEN ) ).toEqual( "program" );
		expect( determineStem( "programs", morphologyDataEN ) ).toEqual( "program" );
		expect( determineStem( "programmed", morphologyDataEN ) ).toEqual( "program" );
	} );

	it( "returns the stem of -ix, -isis, -a and -us words", function() {
		expect( determineStem( "analysis", morphologyDataEN ) ).toEqual( "analysis" );
		expect( determineStem( "analyses", morphologyDataEN ) ).toEqual( "analysis" );

		expect( determineStem( "focus", morphologyDataEN ) ).toEqual( "focus" );
		expect( determineStem( "foci", morphologyDataEN ) ).toEqual( "focus" );
		expect( determineStem( "focuses", morphologyDataEN ) ).toEqual( "focus" );

		expect( determineStem( "fix", morphologyDataEN ) ).toEqual( "fix" );
		expect( determineStem( "fixes", morphologyDataEN ) ).toEqual( "fix" );
		expect( determineStem( "fixed", morphologyDataEN ) ).toEqual( "fix" );
		expect( determineStem( "fixing", morphologyDataEN ) ).toEqual( "fix" );

		expect( determineStem( "mix", morphologyDataEN ) ).toEqual( "mix" );
		expect( determineStem( "mixes", morphologyDataEN ) ).toEqual( "mix" );
		expect( determineStem( "mixed", morphologyDataEN ) ).toEqual( "mix" );
		expect( determineStem( "mixing", morphologyDataEN ) ).toEqual( "mix" );

		expect( determineStem( "plus", morphologyDataEN ) ).toEqual( "plus" );

		expect( determineStem( "ai", morphologyDataEN ) ).toEqual( "ai" );
		expect( determineStem( "data", morphologyDataEN ) ).toEqual( "data" );
		expect( determineStem( "beta", morphologyDataEN ) ).toEqual( "beta" );
		expect( determineStem( "extra", morphologyDataEN ) ).toEqual( "extra" );
		expect( determineStem( "meta", morphologyDataEN ) ).toEqual( "meta" );
	} );

	it( "returns the stem of adjectives ending with -ious/-uous", function() {
		expect( determineStem( "continuous", morphologyDataEN ) ).toEqual( "continuous" );
		expect( determineStem( "various", morphologyDataEN ) ).toEqual( "various" );
		expect( determineStem( "serious", morphologyDataEN ) ).toEqual( "serious" );
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

		expect( determineStem( "traffic", morphologyDataEN ) ).toEqual( "traffic" );
		expect( determineStem( "ying", morphologyDataEN ) ).toEqual( "ying" );
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

		expect( determineStem( "hear", morphologyDataEN ) ).toEqual( "hear" );
		expect( determineStem( "hears", morphologyDataEN ) ).toEqual( "hear" );
		expect( determineStem( "hearing", morphologyDataEN ) ).toEqual( "hear" );
		expect( determineStem( "heard", morphologyDataEN ) ).toEqual( "hear" );

		expect( determineStem( "abear", morphologyDataEN ) ).toEqual( "abear" );
		expect( determineStem( "abears", morphologyDataEN ) ).toEqual( "abear" );
		expect( determineStem( "abearing", morphologyDataEN ) ).toEqual( "abear" );
		expect( determineStem( "abore", morphologyDataEN ) ).toEqual( "abear" );
		expect( determineStem( "abare", morphologyDataEN ) ).toEqual( "abear" );
		expect( determineStem( "aborne", morphologyDataEN ) ).toEqual( "abear" );

		expect( determineStem( "foresee", morphologyDataEN ) ).toEqual( "foresee" );
		expect( determineStem( "foresees", morphologyDataEN ) ).toEqual( "foresee" );
		expect( determineStem( "foreseeing", morphologyDataEN ) ).toEqual( "foresee" );
		expect( determineStem( "foresaw", morphologyDataEN ) ).toEqual( "foresee" );
		expect( determineStem( "foreseen", morphologyDataEN ) ).toEqual( "foresee" );
		expect( determineStem( "foresee's", morphologyDataEN ) ).toEqual( "foresee" );
		expect( determineStem( "foresees's", morphologyDataEN ) ).toEqual( "foresee" );

		expect( determineStem( "test-drive", morphologyDataEN ) ).toEqual( "test-drive" );
		expect( determineStem( "test-drives", morphologyDataEN ) ).toEqual( "test-drive" );
		expect( determineStem( "test-driving", morphologyDataEN ) ).toEqual( "test-drive" );
		expect( determineStem( "test-drove", morphologyDataEN ) ).toEqual( "test-drive" );
		expect( determineStem( "test-driven", morphologyDataEN ) ).toEqual( "test-drive" );
	} );

	it( "returns the stem of an irregular adjective", function() {
		expect( determineStem( "good", morphologyDataEN ) ).toEqual( "good" );
		expect( determineStem( "well", morphologyDataEN ) ).toEqual( "good" );
		expect( determineStem( "better", morphologyDataEN ) ).toEqual( "good" );
		expect( determineStem( "best", morphologyDataEN ) ).toEqual( "good" );
		expect( determineStem( "goods", morphologyDataEN ) ).toEqual( "good" );
	} );
} );
