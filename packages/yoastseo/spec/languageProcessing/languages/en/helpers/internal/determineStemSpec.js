import {
	findShortestAndAlphabeticallyFirst,
	determineIrregularStem,
	determineIrregularVerbStem,
	determineRegularStem,
	determineStem,
} from "../../../../../../src/languageProcessing/languages/en/helpers/internal/determineStem.js";

import getMorphologyData from "../../../../../specHelpers/getMorphologyData";


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
	const regularWords = [
		[ "word", "word" ],
		[ "words", "word" ],
		[ "worded", "word" ],
		[ "wording", "word" ],
		[ "worder", "word" ],
		[ "wordest", "word" ],
		[ "wordly", "word" ],
		[ "wordings", "word" ],
		[ "tomato", "tomato" ],
		[ "tomatos", "tomato" ],
		[ "tomatoes", "tomato" ],
		[ "bonus", "bonus" ],
		[ "bonuses", "bonus" ],
		[ "bonused", "bonus" ],
		[ "bonusing", "bonus" ],
		[ "bonusings", "bonus" ],
		[ "supply", "supply" ],
		[ "supplies", "supply" ],
		[ "supplied", "supply" ],
		[ "supplying", "supply" ],
		[ "supplyings", "supply" ],
		[ "supplier", "supplier" ],
		[ "release", "release" ],
		[ "releases", "release" ],
		[ "released", "release" ],
		[ "releasing", "release" ],
		[ "releasings", "release" ],
		[ "historic", "historical" ],
		[ "historical", "historical" ],
		[ "historically", "historical" ],
		[ "pathetic", "pathetical" ],
		[ "pathetical", "pathetical" ],
		[ "pathetically", "pathetical" ],
		[ "smart", "smart" ],
		[ "smarter", "smart" ],
		[ "smartest", "smart" ],
		[ "paper", "paper" ],
		[ "beer", "beer" ],
		[ "partner", "partner" ],
		[ "interest", "interest" ],
		[ "zest", "zest" ],
		[ "belly", "belly" ],
		[ "analysis", "analysis" ],
		[ "trwprtrw", "trwprtrw" ],
	];
	it.each( regularWords )( "stems regular word \"%s\" to \"%s\"", function( word, expected ) {
		expect( determineRegularStem( word, morphologyDataEN ) ).toEqual( expected );
	} );
} );

describe( "determineStem", function() {
	const regularWords = [
		[ "word", "word" ],
		[ "words", "word" ],
		[ "worded", "word" ],
		[ "wording", "word" ],
		[ "worder", "word" ],
		[ "wordest", "word" ],
		[ "wordly", "word" ],
		[ "word's", "word" ],
		[ "words's", "word" ],
		[ "words'", "word" ],
		[ "wording's", "word" ],
		[ "wordings'", "word" ],
		[ "wordings's", "word" ],
		[ "wordings", "word" ],
		[ "tomato", "tomato" ],
		[ "tomatos", "tomato" ],
		[ "tomatoes", "tomato" ],
		[ "tomato's", "tomato" ],
		[ "tomatos'", "tomato" ],
		[ "tomatos's", "tomato" ],
		[ "tomatoes's", "tomato" ],
		[ "town", "town" ],
		[ "towns", "town" ],
		[ "supply", "supply" ],
		[ "supplies", "supply" ],
		[ "supplied", "supply" ],
		[ "supplying", "supply" ],
		[ "supply's", "supply" ],
		[ "supplies'", "supply" ],
		[ "supplies's", "supply" ],
		[ "supplyings", "supply" ],
	];
	it.each( regularWords )( "stems regular word \"%s\" to \"%s\"", function( word, expected ) {
		expect( determineStem( word, morphologyDataEN ) ).toEqual( expected );
	} );

	const verbsEndingInE = [
		[ "share", "share" ],
		[ "sharing", "share" ],
		[ "shared", "share" ],
		[ "shares", "share" ],
		[ "improve", "improve" ],
		[ "improving", "improve" ],
		[ "improved", "improve" ],
		[ "improves", "improve" ],
		[ "compete", "compete" ],
		[ "competed", "compete" ],
		[ "competes", "compete" ],
		[ "competing", "compete" ],
		[ "schedule", "schedule" ],
		[ "scheduling", "schedule" ],
		[ "scheduled", "schedule" ],
		[ "schedules", "schedule" ],
		[ "type", "type" ],
		[ "typed", "type" ],
		[ "types", "type" ],
		[ "typing", "type" ],
		[ "release", "release" ],
		[ "releasing", "release" ],
		[ "released", "release" ],
		[ "releases", "release" ],
		[ "prepare", "prepare" ],
		[ "preparing", "prepare" ],
		[ "prepared", "prepare" ],
		[ "prepares", "prepare" ],
		[ "move", "move" ],
		[ "moving", "move" ],
		[ "moved", "move" ],
		[ "moves", "move" ],
		[ "amaze", "amaze" ],
		[ "amazing", "amaze" ],
		[ "amazed", "amaze" ],
		[ "amazes", "amaze" ],
		[ "specialize", "specialize" ],
		[ "specializing", "specialize" ],
		[ "specialized", "specialize" ],
		[ "specializes", "specialize" ],
		[ "optimize", "optimize" ],
		[ "optimizing", "optimize" ],
		[ "optimized", "optimize" ],
		[ "optimizes", "optimize" ],
	];
	it.each( verbsEndingInE )( "stems verb ending in -e \"%s\" to \"%s\"", function( word, expected ) {
		expect( determineStem( word, morphologyDataEN ) ).toEqual( expected );
	} );

	const verbalFormsNotGettingE = [
		[ "doom", "doom" ],
		[ "doomed", "doom" ],
		[ "dooming", "doom" ],
		[ "dooms", "doom" ],
		[ "load", "load" ],
		[ "loaded", "load" ],
		[ "loading", "load" ],
		[ "loads", "load" ],
		[ "develop", "develop" ],
		[ "developed", "develop" ],
		[ "developing", "develop" ],
		[ "develops", "develop" ],
	];
	it.each( verbalFormsNotGettingE )( "stems verb form \"%s\" to \"%s\", in which the base should not get -e ending", function( word, expected ) {
		expect( determineStem( word, morphologyDataEN ) ).toEqual( expected );
	} );

	const verbsNeedDoublingConsonant = [
		[ "prefer", "prefer" ],
		[ "preferring", "prefer" ],
		[ "prefers", "prefer" ],
		[ "preferred", "prefer" ],
		[ "program", "program" ],
		[ "programming", "program" ],
		[ "programs", "program" ],
		[ "programmed", "program" ],
	];
	it.each( verbsNeedDoublingConsonant )( "stems verb form \"%s\" that requires doubling the last consonant to \"%s\"", function( word, expected ) {
		expect( determineStem( word, morphologyDataEN ) ).toEqual( expected );
	} );

	const irregularWords = [
		[ "analysis", "analysis" ],
		[ "analyses", "analysis" ],
		[ "focus", "focus" ],
		[ "foci", "focus" ],
		[ "focuses", "focus" ],
		[ "fix", "fix" ],
		[ "fixes", "fix" ],
		[ "fixed", "fix" ],
		[ "fixing", "fix" ],
		[ "mix", "mix" ],
		[ "mixes", "mix" ],
		[ "mixed", "mix" ],
		[ "mixing", "mix" ],
		[ "plus", "plus" ],
		[ "ai", "ai" ],
		[ "data", "data" ],
		[ "beta", "beta" ],
		[ "extra", "extra" ],
		[ "meta", "meta" ],
	];
	it.each( irregularWords )( "stems irregular word \"%s\" to \"%s\"", function( word, expected ) {
		expect( determineStem( word, morphologyDataEN ) ).toEqual( expected );
	} );

	const adjEndingInOus = [
		[ "continuous", "continuous" ],
		[ "various", "various" ],
		[ "serious", "serious" ],
	];
	it.each( adjEndingInOus )( "stems adjective ending in -ous \"%s\" to \"%s\"", function( word, expected ) {
		expect( determineStem( word, morphologyDataEN ) ).toEqual( expected );
	} );

	const irregularNounsAndVerbs = [
		[ "anaesthesia", "anaesthesia" ],
		[ "anaesthesiae", "anaesthesia" ],
		[ "anæsthesia", "anaesthesia" ],
		[ "anæsthesiæ", "anaesthesia" ],
		[ "anaesthesias", "anaesthesia" ],
		[ "anaesthesia's", "anaesthesia" ],
		[ "anaesthesiae's", "anaesthesia" ],
		[ "anæsthesia's", "anaesthesia" ],
		[ "anæsthesiæ's", "anaesthesia" ],
		[ "anaesthesias's", "anaesthesia" ],
		[ "anaesthesias'", "anaesthesia" ],
		[ "traffic", "traffic" ],
		[ "ying", "ying" ],
		[ "bless", "bless" ],
		[ "blesses", "bless" ],
		[ "blessing", "bless" ],
		[ "blessed", "bless" ],
		[ "blest", "bless" ],
		[ "blessing's", "bless" ],
		[ "blessings'", "bless" ],
		[ "blessings's", "bless" ],
		[ "blessings", "bless" ],
		[ "hear", "hear" ],
		[ "hears", "hear" ],
		[ "hearing", "hear" ],
		[ "heard", "hear" ],
		[ "abear", "abear" ],
		[ "abears", "abear" ],
		[ "abearing", "abear" ],
		[ "abore", "abear" ],
		[ "abare", "abear" ],
		[ "aborne", "abear" ],
		[ "foresee", "foresee" ],
		[ "foresees", "foresee" ],
		[ "foreseeing", "foresee" ],
		[ "foresaw", "foresee" ],
		[ "foreseen", "foresee" ],
		[ "foresee's", "foresee" ],
		[ "foresees's", "foresee" ],
		[ "test-drive", "test-drive" ],
		[ "test-drives", "test-drive" ],
		[ "test-driving", "test-drive" ],
		[ "test-drove", "test-drive" ],
		[ "test-driven", "test-drive" ],
	];
	it.each( irregularNounsAndVerbs )( "stems irregular noun/verb \"%s\" to \"%s\"", function( word, expected ) {
		expect( determineStem( word, morphologyDataEN ) ).toEqual( expected );
	} );

	const irregularAdjectives = [
		[ "good", "good" ],
		[ "well", "good" ],
		[ "better", "good" ],
		[ "best", "good" ],
		[ "goods", "good" ],
		[ "gentle", "gentle" ],
		[ "gentler", "gentle" ],
		[ "gentlest", "gentle" ],
		[ "gently", "gentle" ],
		[ "simple", "simple" ],
		[ "simpler", "simple" ],
		[ "simplest", "simple" ],
		[ "simply", "simple" ],
	];
	it.each( irregularAdjectives )( "stems irregular adjective \"%s\" to \"%s\"", function( word, expected ) {
		expect( determineStem( word, morphologyDataEN ) ).toEqual( expected );
	} );
	const agentNouns = [
		[ "composers", "composer" ],
		[ "computers", "computer" ],
		[ "walkers", "walker" ],
		[ "makers", "maker" ],
		[ "writers", "writer" ],
		[ "players", "player" ],
		[ "doomers", "doomer" ],
		[ "testers", "tester" ],
	];
	it.each( agentNouns )( "stems plural agent noun \"%s\" to \"%s\", and doesn't stem the singular form", function( word, expected ) {
		expect( determineStem( word, morphologyDataEN ) ).toEqual( expected );
		expect( determineStem( expected, morphologyDataEN ) ).toEqual( expected );
	} );
} );

