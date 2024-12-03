import {
	findShortestAndAlphabeticallyFirst,
	determineIrregularStem,
	determineIrregularVerbStem,
	determineRegularStem,
	determineStem,
} from "../../../../../../src/languageProcessing/languages/en/helpers/internal/determineStem.js";

import getMorphologyData from "../../../../../specHelpers/getMorphologyData";

const morphologyDataEN = getMorphologyData( "en" ).en;

describe( "a test for the following function: findShortestAndAlphabeticallyFirst", function() {
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

describe( "a test for the following functions: determineIrregularStem and determineIrregularVerbStem", function() {
	const nounIrregulars = morphologyDataEN.nouns.irregularNouns;
	const adjectiveIrregulars = morphologyDataEN.adjectives.irregularAdjectives;

	const verbMorphology = morphologyDataEN.verbs;

	it( "returns undefined if the word is not in the list of irregulars", function() {
		expect( determineIrregularStem( "word", nounIrregulars ) ).toBeNull();
		expect( determineIrregularVerbStem( "word", verbMorphology ) ).toBeNull();
	} );

	const irregularNouns = [ "anaesthesia", "anaesthesiae", "anæsthesia", "anæsthesiæ", "anaesthesias" ];
	it.each( irregularNouns )( "stems irregular noun \"%s\" to \"anaesthesia\"", function( word ) {
		expect( determineIrregularStem( word, nounIrregulars ) ).toEqual( "anaesthesia" );
	} );

	const irregularAdjectives = [ "good", "well", "better", "best" ];
	it.each( irregularAdjectives )( "stems irregular adjective \"%s\" to \"good\"", function( word ) {
		expect( determineIrregularStem( word, adjectiveIrregulars ) ).toEqual( "good" );
	} );

	const irregularVerbs = [ "bless", "blesses", "blessing", "blessed", "blest" ];
	it.each( irregularVerbs )( "stems irregular verb form \"%s\" to \"bless\"", function( word ) {
		expect( determineIrregularVerbStem( word, verbMorphology ) ).toEqual( "bless" );
	} );

	const irregularVerbsWithPrefix = [ "foresee", "foresees", "foreseeing", "foresaw", "foreseen" ];
	it.each( irregularVerbsWithPrefix )( "stems irregular verb form with prefix \"%s\" to \"foresee\"", function( word ) {
		expect( determineIrregularVerbStem( word, verbMorphology ) ).toEqual( "foresee" );
	} );
} );

describe( "a test for the following function: determineRegularStem", function() {
	const regularWords = [
		[ "beer", "beer" ],
		[ "belly", "belly" ],
		[ "bonus", "bonus" ],
		[ "bonused", "bonus" ],
		[ "bonuses", "bonus" ],
		[ "bonusing", "bonus" ],
		[ "bonusings", "bonus" ],
		[ "historic", "historical" ],
		[ "historical", "historical" ],
		[ "historically", "historical" ],
		[ "interest", "interest" ],
		[ "paper", "paper" ],
		[ "partner", "partner" ],
		[ "pathetic", "pathetical" ],
		[ "pathetical", "pathetical" ],
		[ "pathetically", "pathetical" ],
		[ "release", "release" ],
		[ "released", "release" ],
		[ "releases", "release" ],
		[ "releasing", "release" ],
		[ "releasings", "release" ],
		[ "smart", "smart" ],
		[ "smarter", "smart" ],
		[ "smartest", "smart" ],
		[ "supplied", "supply" ],
		[ "supplies", "supply" ],
		[ "supply", "supply" ],
		[ "supplying", "supply" ],
		[ "supplyings", "supply" ],
		[ "tomato", "tomato" ],
		[ "tomatoes", "tomato" ],
		[ "tomatos", "tomato" ],
		// Made up word.
		[ "trwprtrw", "trwprtrw" ],
		[ "word", "word" ],
		[ "worded", "word" ],
		[ "worder", "word" ],
		[ "wordest", "word" ],
		[ "wording", "word" ],
		[ "wordings", "word" ],
		[ "wordly", "word" ],
		[ "words", "word" ],
		[ "zest", "zest" ],
	];
	it.each( regularWords )( "stems regular word \"%s\" to \"%s\"", function( word, expected ) {
		expect( determineRegularStem( word, morphologyDataEN ) ).toEqual( expected );
	} );
} );

describe( "a test for the following function: determineStem", function() {
	const possessiveFormsOfRegularWords = [
		[ "supplies'", "supply" ],
		[ "supplies's", "supply" ],
		[ "supply's", "supply" ],
		[ "tomato's", "tomato" ],
		[ "tomatoes's", "tomato" ],
		[ "tomatos's", "tomato" ],
		[ "word's", "word" ],
		[ "wording's", "word" ],
		[ "wordings'", "word" ],
		[ "wordings's", "word" ],
		[ "words'", "word" ],
		[ "words's", "word" ],
	];
	it.each( possessiveFormsOfRegularWords )( "stems possessive form of regular noun \"%s\" to \"%s\"", function( word, expected ) {
		expect( determineStem( word, morphologyDataEN ) ).toEqual( expected );
	} );

	const verbsEndingInE = [
		[ "amaze", "amaze" ],
		[ "amazed", "amaze" ],
		[ "amazes", "amaze" ],
		[ "amazing", "amaze" ],
		[ "compete", "compete" ],
		[ "competed", "compete" ],
		[ "competes", "compete" ],
		[ "competing", "compete" ],
		[ "improve", "improve" ],
		[ "improved", "improve" ],
		[ "improves", "improve" ],
		[ "improving", "improve" ],
		[ "move", "move" ],
		[ "moved", "move" ],
		[ "moves", "move" ],
		[ "moving", "move" ],
		[ "optimize", "optimize" ],
		[ "optimized", "optimize" ],
		[ "optimizes", "optimize" ],
		[ "optimizing", "optimize" ],
		[ "prepare", "prepare" ],
		[ "prepared", "prepare" ],
		[ "prepares", "prepare" ],
		[ "preparing", "prepare" ],
		[ "schedule", "schedule" ],
		[ "scheduled", "schedule" ],
		[ "schedules", "schedule" ],
		[ "scheduling", "schedule" ],
		[ "share", "share" ],
		[ "shared", "share" ],
		[ "shares", "share" ],
		[ "sharing", "share" ],
		[ "specialize", "specialize" ],
		[ "specialized", "specialize" ],
		[ "specializes", "specialize" ],
		[ "specializing", "specialize" ],
		[ "type", "type" ],
		[ "typed", "type" ],
		[ "types", "type" ],
		[ "typing", "type" ],
	];
	it.each( verbsEndingInE )( "correctly stems verb form whose base ending in -e: \"%s\" to \"%s\"", function( word, expected ) {
		expect( determineStem( word, morphologyDataEN ) ).toEqual( expected );
	} );

	const verbalFormsNotGettingE = [
		[ "develop", "develop" ],
		[ "developed", "develop" ],
		[ "developing", "develop" ],
		[ "develops", "develop" ],
		[ "doom", "doom" ],
		[ "doomed", "doom" ],
		[ "dooming", "doom" ],
		[ "dooms", "doom" ],
		[ "load", "load" ],
		[ "loaded", "load" ],
		[ "loading", "load" ],
		[ "loads", "load" ],
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
		[ "ai", "ai" ],
		[ "analyses", "analysis" ],
		[ "analysis", "analysis" ],
		[ "beta", "beta" ],
		[ "data", "data" ],
		[ "extra", "extra" ],
		[ "fix", "fix" ],
		[ "fixed", "fix" ],
		[ "fixes", "fix" ],
		[ "fixing", "fix" ],
		[ "foci", "focus" ],
		[ "focus", "focus" ],
		[ "focuses", "focus" ],
		[ "meta", "meta" ],
		[ "mix", "mix" ],
		[ "mixed", "mix" ],
		[ "mixes", "mix" ],
		[ "mixing", "mix" ],
		[ "plus", "plus" ],
	];
	it.each( irregularWords )( "stems irregular word \"%s\" to \"%s\"", function( word, expected ) {
		expect( determineStem( word, morphologyDataEN ) ).toEqual( expected );
		expect( determineStem( expected, morphologyDataEN ) ).toEqual( expected );
	} );

	const adjEndingInOus = [ "continuous", "various", "serious" ];
	it.each( adjEndingInOus )( "stems adjective ending in -ous \"%s\"", function( word ) {
		expect( determineStem( word, morphologyDataEN ) ).toEqual( word );
	} );

	const irregularNounsAndVerbs = [
		[ "abare", "abear" ],
		[ "abear", "abear" ],
		[ "abearing", "abear" ],
		[ "abears", "abear" ],
		[ "abore", "abear" ],
		[ "aborne", "abear" ],
		[ "hear", "hear" ],
		[ "heard", "hear" ],
		[ "hearing", "hear" ],
		[ "hears", "hear" ],
		[ "hyena", "hyena" ],
		[ "hyenas", "hyena" ],
		[ "hyenae", "hyena" ],
		[ "hyenæ", "hyena" ],
		[ "hyena's", "hyena" ],
		[ "hyenas'", "hyena" ],
		[ "hyenae's", "hyena" ],
		[ "hyenæ's", "hyena" ],
		[ "test-drive", "test-drive" ],
		[ "test-driven", "test-drive" ],
		[ "test-drives", "test-drive" ],
		[ "test-driving", "test-drive" ],
		[ "test-drove", "test-drive" ],
		[ "traffic", "traffic" ],
		[ "ying", "ying" ],
	];
	it.each( irregularNounsAndVerbs )( "stems irregular noun/verb \"%s\" to \"%s\"", function( word, expected ) {
		expect( determineStem( word, morphologyDataEN ) ).toEqual( expected );
	} );

	const irregularAdjectives = [
		[ "freer", "free" ],
		[ "freest", "free" ],
		[ "gentle", "gentle" ],
		[ "gentler", "gentle" ],
		[ "gentlest", "gentle" ],
		[ "gently", "gentle" ],
		[ "goods", "good" ],
		[ "simple", "simple" ],
		[ "simpler", "simple" ],
		[ "simplest", "simple" ],
		[ "simply", "simple" ],
		[ "truer", "true" ],
		[ "truest", "true" ],
	];
	it.each( irregularAdjectives )( "stems irregular adjective \"%s\" to \"%s\"", function( word, expected ) {
		expect( determineStem( word, morphologyDataEN ) ).toEqual( expected );
		expect( determineStem( expected, morphologyDataEN ) ).toEqual( expected );
	} );

	const agentNouns = [
		[ "composers", "composer" ],
		[ "computers", "computer" ],
		[ "doomers", "doomer" ],
		[ "makers", "maker" ],
		[ "players", "player" ],
		[ "suppliers", "supplier" ],
		[ "testers", "tester" ],
		[ "walkers", "walker" ],
		[ "writers", "writer" ],
	];
	it.each( agentNouns )( "stems plural agent noun \"%s\" to \"%s\", and doesn't stem the singular form", function( word, expected ) {
		expect( determineStem( word, morphologyDataEN ) ).toEqual( expected );
		expect( determineStem( expected, morphologyDataEN ) ).toEqual( expected );
	} );
} );

