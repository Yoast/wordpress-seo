import getAdjectiveStem from "../../../../../../src/languageProcessing/languages/en/helpers/internal/getAdjectiveStem";
import getMorphologyData from "../../../../../specHelpers/getMorphologyData";

const morphologyData = getMorphologyData( "en" );
const adjectiveData = morphologyData.en.adjectives;
const regexAdjective = adjectiveData.regexAdjective;
const stopAdjectives = adjectiveData.stopAdjectives;
const multiSyllableAdjWithSuffixes = adjectiveData.multiSyllableAdjectives.list;

const oneSyllableRegularAdj = [
	[ "short", "shorter", "shortest", "shortly" ],
	[ "cool", "cooler", "coolest", "coolly" ],
	[ "warm", "warmer", "warmest", "warmly" ],
	[ "high", "higher", "highest", "highly" ],
	[ "kind", "kinder", "kindest", "kindly" ],
	[ "firm", "firmer", "firmest", "firmly" ],
	[ "cruel", "crueler", "cruelest", "cruelly" ],
	[ "green", "greener", "greenest", "greenly" ],
	[ "fresh", "fresher", "freshest", "freshly" ],
	[ "weak", "weaker", "weakest", "weakly" ],
	[ "cold", "colder", "coldest", "coldly" ],
	[ "few", "fewer", "fewest", "fewly" ],
	[ "light", "lighter", "lightest", "lightly" ],
	[ "hard", "harder", "hardest", "hardly" ],
	[ "low", "lower", "lowest", "lowly" ],
	[ "new", "newer", "newest", "newly" ],
	[ "old", "older", "oldest", "oldly" ],
	[ "young", "younger", "youngest", "youngly" ],
	[ "loud", "louder", "loudest", "loudly" ],
	[ "proud", "prouder", "proudest", "proudly" ],
	[ "great", "greater", "greatest", "greatly" ],
	[ "long", "longer", "longest", "longly" ],
	[ "bold", "bolder", "boldest", "boldly" ],
	[ "bald", "balder", "baldest", "baldly" ],
	[ "sweet", "sweeter", "sweetest", "sweetly" ],
	[ "quiet", "quieter", "quietest", "quietly" ],
	[ "stiff", "stiffer", "stiffest", "stiffly" ],
	[ "brief", "briefer", "briefest", "briefly" ],
	[ "rich", "richer", "richest", "richly" ],
	[ "smooth", "smoother", "smoothest", "smoothly" ],
	[ "tough", "tougher", "toughest", "toughly" ],
	[ "drunk", "drunker", "drunkest", "drunkly" ],
	[ "thick", "thicker", "thickest", "thickly" ],
	[ "lean", "leaner", "leanest", "leanly" ],
	[ "damn", "damner", "damnest", "damnly" ],
	[ "brown", "browner", "brownest", "brownly" ],
	[ "clear", "clearer", "clearest", "clearly" ],
	[ "kind", "kinder", "kindest", "kindly" ],
	[ "faint", "fainter", "faintest", "faintly" ],
];

const multiSyllableRegularAdj = [
	[ "narrow", "narrower", "narrowest", "narrowly" ],
	[ "stupid", "stupider", "stupidest", "stupidly" ],
	[ "clever", "cleverer", "cleverest", "cleverly" ],
	[ "shallow", "shallower", "shallowest", "shallowly" ],
	[ "alert", "alerter", "alertest", "alertly" ],
	[ "slender", "slenderer", "slenderest", "slenderly" ],
	[ "pleasant", "pleasanter", "pleasantest", "pleasantly" ],
	[ "mature", "maturer", "maturest", "maturely" ],
	[ "polite", "politer", "politest", "politely" ],
];

// Adjectives ending in -y.
const yAtTheEnd = [
	// One syllable adjectives ending in -y.
	[ "dry", "drier", "driest", "dryly" ],
	[ "shy", "shier", "shiest", "shyly" ],
	[ "sly", "slier", "sliest", "slyly" ],
	// Two syllable adjectives ending in -y.
	[ "happy", "happier", "happiest", "happily" ],
	[ "pretty", "prettier", "prettiest", "prettily" ],
	[ "heavy", "heavier", "heaviest", "heavily" ],
	[ "tiny", "tinier", "tiniest", "tinily" ],
	[ "healthy", "healthier", "healthiest", "healthily" ],
	[ "funny", "funnier", "funniest", "funnily" ],
	[ "angry", "angrier", "angriest", "angrily" ],
	[ "crazy", "crazier", "craziest", "crazily" ],
	[ "empty", "emptier", "emptiest", "emptily" ],
	[ "busy", "busier", "busiest", "busily" ],
	[ "guilty", "guiltier", "guiltiest", "guiltily" ],
	[ "lucky", "luckier", "luckiest", "luckily" ],
	[ "dirty", "dirtier", "dirtiest", "dirtily" ],
	[ "hungry", "hungrier", "hungriest", "hungrily" ],
	[ "wealthy", "wealthier", "wealthiest", "wealthily" ],
	[ "scary", "scarier", "scariest", "scarily" ],
	[ "sunny", "sunnier", "sunniest", "sunnily" ],
	[ "risky", "riskier", "riskiest", "riskily" ],
	[ "fancy", "fancier", "fanciest", "fancily" ],
	[ "easy", "easier", "easiest", "easily" ],
	// Three syllable adjectives ending in -y.
	[ "unhappy", "unhappier", "unhappiest", "unhappily" ],
	[ "unlucky", "unluckier", "unluckiest", "unluckily" ],
	[ "unhealthy", "unhealthier", "unhealthiest", "unhealthily" ],
];

// Adjectives ending in -e with one syllable.
const eAtTheEnd = [
	[ "nice", "nicer", "nicest", "nicely" ],
	[ "white", "whiter", "whitest", "whitely" ],
	[ "large", "larger", "largest", "largely" ],
	[ "late", "later", "latest", "lately" ],
	[ "safe", "safer", "safest", "safely" ],
	[ "wide", "wider", "widest", "widely" ],
	[ "rare", "rarer", "rarest", "rarely" ],
	[ "pure", "purer", "purest", "purely" ],
	[ "wise", "wiser", "wisest", "wisely" ],
	[ "cute", "cuter", "cutest", "cutely" ],
	[ "brave", "braver", "bravest", "bravely" ],
	[ "dense", "denser", "densest", "densely" ],
	[ "vague", "vaguer", "vaguest", "vaguely" ],
	[ "rude", "ruder", "rudest", "rudely" ],
	[ "strange", "stranger", "strangest", "strangely" ],
	[ "huge", "huger", "hugest", "hugely" ],
];

const needsDoublingLastConsonant = [
	[ "big", "bigger", "biggest", "bigly" ],
	[ "sad", "sadder", "saddest", "sadly" ],
	[ "mad", "madder", "maddest", "madly" ],
	[ "slim", "slimmer", "slimmest", "slimly" ],
	[ "dim", "dimmer", "dimmest", "dimly" ],
	[ "grim", "grimmer", "grimmest", "grimly" ],
	[ "thin", "thinner", "thinnest", "thinly" ],
	[ "tan", "tanner", "tannest", "tanly" ],
	[ "hip", "hipper", "hippest", "hiply" ],
	[ "hot", "hotter", "hottest", "hotly" ],
	[ "fat", "fatter", "fattest", "fatly" ],
	[ "wet", "wetter", "wettest", "wetly" ],
	[ "fit", "fitter", "fittest", "fitly" ],
];

const adjectivesWithoutComparativesOrSuperlatives = [
	[ "noble", "nobly" ],
	[ "stable", "stably" ],
	[ "possible", "possibly" ],
	[ "responsible", "responsibly" ],
	[ "incredible", "incredibly" ],
	[ "uncomfortable", "uncomfortably" ],
	[ "comparable", "comparably" ],
	[ "invisible", "invisibly" ],
	[ "reasonable", "reasonably" ],
	[ "flexible", "flexibly" ],
	[ "inevitable", "inevitably" ],
	[ "horrible", "horribly" ],
	[ "suitable", "suitably" ],
	[ "remarkable", "remarkably" ],
	[ "beautiful", "beautifully" ],
	[ "necessary", "necessarily" ],
	[ "habitual", "habitually" ],
	[ "fictitious", "fictitiously" ],
	[ "powerless", "powerlessly" ],
	[ "possible", "possibly" ],
	[ "awful",  "awfully" ],
	[ "careful", "carefully" ],
	[ "cheerful", "cheerfully" ],
	[ "foolish", "foolishly" ],
	[ "childish", "childishly" ],
	[ "stylish", "stylishly" ],
	[ "local",  "locally" ],
	[ "cordial", "cordially" ],
	[ "equal",  "equally" ],
	[ "final",  "finally" ],
	[ "passive", "passively" ],
	[ "naive",  "naively" ],
	[ "anxious", "anxiously" ],
	[ "fearless", "fearlessly" ],
	[ "jealous", "jealously" ],
];

const onlyBaseAdjective = [
	"boring",
	"calming",
	"numbing",
	"alive",
	"childlike",
	"alike",
	"stable",
	"noble",
	"superior",
	"feminine",
	"parallel",
];

const allFormsToTestForBase = oneSyllableRegularAdj.concat( yAtTheEnd, eAtTheEnd, needsDoublingLastConsonant );

let returnedGetBaseResult = "";

describe.each( multiSyllableRegularAdj )( "Test for getting the base from multi-syllable adjectives",
	function( base, comparative, superlative, adverb ) {
		it( "doesn't stem base of the word form: " + base, function() {
			returnedGetBaseResult = getAdjectiveStem( base, regexAdjective, stopAdjectives, multiSyllableAdjWithSuffixes );
			expect( returnedGetBaseResult.base ).toEqual( base );
			expect( returnedGetBaseResult.guessedForm ).toEqual( "base" );
		} );

		it( "stems comparative form " + comparative + " to " + base, function() {
			returnedGetBaseResult = getAdjectiveStem( comparative, regexAdjective, stopAdjectives, multiSyllableAdjWithSuffixes );
			expect( returnedGetBaseResult.base ).toEqual( base );
			expect( returnedGetBaseResult.guessedForm ).toEqual( "er" );
		} );

		it( "stems superlative form " + superlative + " to " + base, function() {
			returnedGetBaseResult = getAdjectiveStem( superlative, regexAdjective, stopAdjectives, multiSyllableAdjWithSuffixes );
			expect( returnedGetBaseResult.base ).toEqual( base );
			expect( returnedGetBaseResult.guessedForm ).toEqual( "est" );
		} );

		it( "stems adverb form " + adverb + " to " + base, function() {
			returnedGetBaseResult = getAdjectiveStem( adverb, regexAdjective, stopAdjectives, multiSyllableAdjWithSuffixes );
			expect( returnedGetBaseResult.base ).toEqual( base );
			expect( returnedGetBaseResult.guessedForm ).toEqual( "ly" );
		} );
	} );

describe.each( allFormsToTestForBase )( "Test for getting the base from all types of regular adjectives",
	function( base, comparative, superlative, adverb ) {
		it( "doesn't stem base of the word form: " + base, function() {
			returnedGetBaseResult = getAdjectiveStem( base, regexAdjective, stopAdjectives, multiSyllableAdjWithSuffixes );
			expect( returnedGetBaseResult.base ).toEqual( base );
			expect( returnedGetBaseResult.guessedForm ).toEqual( "base" );
		} );

		it( "stems comparative form " + comparative + " to " + base, function() {
			returnedGetBaseResult = getAdjectiveStem( comparative, regexAdjective, stopAdjectives, multiSyllableAdjWithSuffixes );
			expect( returnedGetBaseResult.base ).toEqual( base );
			expect( returnedGetBaseResult.guessedForm ).toEqual( "er" );
		} );

		it( "stems superlative form " + superlative + " to " + base, function() {
			returnedGetBaseResult = getAdjectiveStem( superlative, regexAdjective, stopAdjectives, multiSyllableAdjWithSuffixes );
			expect( returnedGetBaseResult.base ).toEqual( base );
			expect( returnedGetBaseResult.guessedForm ).toEqual( "est" );
		} );

		it( "stems adverb form " + adverb + " to " + base, function() {
			returnedGetBaseResult = getAdjectiveStem( adverb, regexAdjective, stopAdjectives, multiSyllableAdjWithSuffixes );
			expect( returnedGetBaseResult.base ).toEqual( base );
			expect( returnedGetBaseResult.guessedForm ).toEqual( "ly" );
		} );
	} );

describe( "Test for getting the base from words that look like an adjective form but aren't", function() {
	const oneSyllableNonComparative = [
		"per",
		"her",
		"cher",
	];
	it.each( oneSyllableNonComparative )( "should not stem one syllable word ending in -er: \"%s\"", function( word ) {
		returnedGetBaseResult = getAdjectiveStem( word, regexAdjective, stopAdjectives, multiSyllableAdjWithSuffixes );
		expect( returnedGetBaseResult ).toHaveProperty( "base", word );
		expect( returnedGetBaseResult ).toHaveProperty( "guessedForm", "base" );
	} );

	// Two syllable non-comparative forms of words that end in -er.
	const twoSyllableNonComparative = [
		"baker",
		"builder",
		"teacher",
		"driver",
		"digger",
		"power",
		"shower",
		"bower",
		"tower",
		"blower",
		"skewer",
		"answer",
		"brewer",
		"mower",
		"grower",
		"sewer",
		"flower",
		"drawer",
		"viewer",
		"rower",
		"snower",
	];
	it.each( twoSyllableNonComparative )( "should not stem word that is listed in the exception list `stopAdjectives.erExceptions`: \"%s\"", function( word ) {
		returnedGetBaseResult = getAdjectiveStem( word, regexAdjective, stopAdjectives, multiSyllableAdjWithSuffixes );
		expect( returnedGetBaseResult ).toHaveProperty( "base", word );
		expect( returnedGetBaseResult ).toHaveProperty( "guessedForm", "base" );
	} );

	// These words are not in the exception list.
	const multiSyllableNonComparative = [
		"caretaker",
		"carpenter",
		"character",
		"consider",
		"cucumber",
		"deliver",
		"disaster",
		"empower",
		"helicopter",
		"lavender",
		"minister",
		"newsletter",
		"register",
		"remember",
		"semester",
		"sinister",
		"surrender",
		"volunteer",
		"together",
		"reviewer",
		"widower",
		// 3-syllable words ending in -ier
		"cashier",
		"premier",
		"supplier",
		"glacier",
		"occupier",
	];
	it.each( multiSyllableNonComparative )( "should not stem word ending in -er that have two syllables or more \"%s\": the word is not listed in `multiSyllableAdjWithSuffixes`", function( word ) {
		returnedGetBaseResult = getAdjectiveStem( word, regexAdjective, stopAdjectives, multiSyllableAdjWithSuffixes );
		expect( returnedGetBaseResult ).toHaveProperty( "base", word );
		expect( returnedGetBaseResult ).toHaveProperty( "guessedForm", "base" );
	} );

	/*
	These are two syllable words ending in -er that are not a comparative form. They are not in the exception list, but they should not be stemmed.
	Currently, this unit test passes because the `countSyllablesInWord` function recognizes these words as having one syllable.
	If at some point the `countSyllablesInWord` function is updated to recognize these words as having two syllables, this test will fail,
	and the words should be added to the `multiSyllableAdjWithSuffixes` list.
	 */
	const twoSyllableWordsEndingInEr = [
		"beer",
		"deer",
		"doer",
		"jeer",
		"peer",
		"seer",
		"veer",
		"cheer",
		"sheer",
	];
	it.each( twoSyllableWordsEndingInEr )( "should not stem two syllable word ending in -er \"%s\": the word is not listed in `multiSyllableAdjWithSuffixes`", function( word ) {
		returnedGetBaseResult = getAdjectiveStem( word, regexAdjective, stopAdjectives, multiSyllableAdjWithSuffixes );
		expect( returnedGetBaseResult ).toHaveProperty( "base", word );
		expect( returnedGetBaseResult ).toHaveProperty( "guessedForm", "base" );
	} );

	// One syllable words ending in -est that are not superlatives. They should not be stemmed. They are not in the exception list.
	const oneSyllableWordsEndingInEst = [
		"zest",
		"fest",
		"gest",
		"hest",
		"jest",
		"chest",
		"crest",
		"drest",
		"geest",
		"guest",
		"prest",
	];
	it.each( oneSyllableWordsEndingInEst )( "should not stem one syllable word ending in -est that is not superlative: \"%s\"", function( word ) {
		returnedGetBaseResult = getAdjectiveStem( word, regexAdjective, stopAdjectives, multiSyllableAdjWithSuffixes );
		expect( returnedGetBaseResult ).toHaveProperty( "base", word );
		expect( returnedGetBaseResult ).toHaveProperty( "guessedForm", "base" );
	} );

	const multiSyllableWordsEndingInEst = [
		"anapest",
		"almagest",
		"interest",
		"manifest",
		"palimpsest",
		"rinderpest",
		"wildebeest",
	];
	it.each( multiSyllableWordsEndingInEst )( "should not stem multi-syllable word ending in -est that is not superlative: \"%s\"", function( word ) {
		returnedGetBaseResult = getAdjectiveStem( word, regexAdjective, stopAdjectives, multiSyllableAdjWithSuffixes );
		expect( returnedGetBaseResult ).toHaveProperty( "base", word );
		expect( returnedGetBaseResult ).toHaveProperty( "guessedForm", "base" );
	} );
} );


describe.each( adjectivesWithoutComparativesOrSuperlatives )( "Test for getting the base from adjectives that only form an adverb", function( base, adverb ) {
	it( "should not stem the base itself: \"%s\"", function() {
		returnedGetBaseResult = getAdjectiveStem( base, regexAdjective, stopAdjectives );
		expect( returnedGetBaseResult ).toHaveProperty( "base", base );
		expect( returnedGetBaseResult ).toHaveProperty( "guessedForm", "base" );
	} );
	it( "gets the stem \"%s\" from the adverb form \"%s\"", function() {
		returnedGetBaseResult = getAdjectiveStem( adverb, regexAdjective, stopAdjectives );
		expect( returnedGetBaseResult ).toHaveProperty( "base", base );
		expect( returnedGetBaseResult ).toHaveProperty( "guessedForm", "ly" );
	} );
} );

describe.each( onlyBaseAdjective )( "Test for getting the base from adjectives that don't get any forms", function( word ) {
	it( "doesn't stem the base form itself: " + word, function() {
		returnedGetBaseResult = getAdjectiveStem( word, regexAdjective, stopAdjectives );
		expect( returnedGetBaseResult ).toHaveProperty( "base", word );
	} );
	it( "should return 'base' as the guessed form for the following word: " + word, function() {
		returnedGetBaseResult = getAdjectiveStem( word, regexAdjective, stopAdjectives );
		expect( returnedGetBaseResult ).toHaveProperty( "guessedForm", "base" );
	} );
} );

