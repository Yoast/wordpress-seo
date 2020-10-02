import getAdjectiveStem from "../../../src/languages/legacy/morphology/english/getAdjectiveStem";
import getMorphologyData from "../../specHelpers/getMorphologyData";

const morphologyData = getMorphologyData( "en" );
const adjectiveData = morphologyData.en.adjectives;
const regexAdjective = adjectiveData.regexAdjective;
const stopAdjectives = adjectiveData.stopAdjectives;

const regularAdjectivesToTest = [
	[ "short", "shorter", "shortest", "shortly" ],
	[ "cool", "cooler", "coolest", "coolly" ],
	[ "warm", "warmer", "warmest", "warmly" ],
	[ "high", "higher", "highest", "highly" ],
	[ "silent", "silenter", "silentest", "silently" ],
	[ "kind", "kinder", "kindest", "kindly" ],
	[ "firm", "firmer", "firmest", "firmly" ],
	[ "cruel", "crueler", "cruelest", "cruelly" ],
	[ "green", "greener", "greenest", "greenly" ],
	[ "fresh", "fresher", "freshest", "freshly" ],
	[ "weak", "weaker", "weakest", "weakly" ],
	[ "cold", "colder", "coldest", "coldly" ],
	[ "few", "fewer", "fewest", "fewly" ],
	[ "light", "lighter", "lightest", "lightly" ],
	[ "alert", "alerter", "alertest", "alertly" ],
	[ "certain", "certainer", "certainest", "certainly" ],
	[ "hard", "harder", "hardest", "hardly" ],
	[ "low", "lower", "lowest", "lowly" ],
	[ "new", "newer", "newest", "newly" ],
	[ "old", "older", "oldest", "oldly" ],
	[ "young", "younger", "youngest", "youngly" ],
	[ "loud", "louder", "loudest", "loudly" ],
	[ "proud", "prouder", "proudest", "proudly" ],
	[ "abrupt", "abrupter", "abruptest", "abruptly" ],
	[ "great", "greater", "greatest", "greatly" ],
	[ "long", "longer", "longest", "longly" ],
	[ "bold", "bolder", "boldest", "boldly" ],
	[ "bald", "balder", "baldest", "baldly" ],
	[ "sweet", "sweeter", "sweetest", "sweetly" ],
	[ "quiet", "quieter", "quietest", "quietly" ],
	[ "stupid", "stupider", "stupidest", "stupidly" ],
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
	[ "narrow", "narrower", "narrowest", "narrowly" ],
	[ "faint", "fainter", "faintest", "faintly" ],
	[ "test", "tester", "testest", "testly" ],
];

const yAtTheEnd = [
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
];

const eAtTheEnd = [
	[ "nice", "nicer", "nicest", "nicely" ],
	[ "white", "whiter", "whitest", "whitely" ],
	[ "large", "larger", "largest", "largely" ],
	[ "late", "later", "latest", "lately" ],
	[ "blue", "bluer", "bluest", "bluely" ],
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
	[ "extreme", "extremer", "extremest", "extremely" ],

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

const OnlyBaseAdjective = [
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

const allFormsToTestForBase = regularAdjectivesToTest.concat( yAtTheEnd, eAtTheEnd, needsDoublingLastConsonant );

let returnedGetBaseResult = "";

describe( "Test for getting the base from all types of regular adjectives", function() {
	allFormsToTestForBase.forEach( function( paradigm ) {
		const testBase = paradigm[ 0 ];
		it( "returns the base of the word form which is a base itself", function() {
			returnedGetBaseResult = getAdjectiveStem( testBase, regexAdjective, stopAdjectives );
			expect( returnedGetBaseResult.base ).toEqual( testBase );
			expect( returnedGetBaseResult.guessedForm ).toEqual( "base" );
		} );

		const testComparative = paradigm[ 1 ];
		it( "returns the base of the word form which is a comparative", function() {
			returnedGetBaseResult = getAdjectiveStem( testComparative, regexAdjective, stopAdjectives );
			expect( returnedGetBaseResult.base ).toEqual( testBase );
			expect( returnedGetBaseResult.guessedForm ).toEqual( "er" );
		} );

		const testSuperlative = paradigm[ 2 ];
		it( "returns the base of the word form which is a superlative", function() {
			returnedGetBaseResult = getAdjectiveStem( testSuperlative, regexAdjective, stopAdjectives );
			expect( returnedGetBaseResult.base ).toEqual( testBase );
			expect( returnedGetBaseResult.guessedForm ).toEqual( "est" );
		} );

		const testAdverb = paradigm[ 3 ];
		it( "returns the base of the word form which is an adverb", function() {
			returnedGetBaseResult = getAdjectiveStem( testAdverb, regexAdjective, stopAdjectives );
			expect( returnedGetBaseResult.base ).toEqual( testBase );
			expect( returnedGetBaseResult.guessedForm ).toEqual( "ly" );
		} );
	} );
} );

describe( "Test for getting the base from adjectives that only form an adverb", function() {
	adjectivesWithoutComparativesOrSuperlatives.forEach( function( paradigm ) {
		const testBase = paradigm[ 0 ];
		it( "returns the base of the word form which is a base itself", function() {
			returnedGetBaseResult = getAdjectiveStem( testBase, regexAdjective, stopAdjectives );
			expect( returnedGetBaseResult.base ).toEqual( testBase );
			expect( returnedGetBaseResult.guessedForm ).toEqual( "base" );
		} );

		const testAdverb = paradigm[ 1 ];
		it( "returns the base of the word form which is an adverb", function() {
			returnedGetBaseResult = getAdjectiveStem( testAdverb, regexAdjective, stopAdjectives );
			expect( returnedGetBaseResult.base ).toEqual( testBase );
			expect( returnedGetBaseResult.guessedForm ).toEqual( "ly" );
		} );
	} );
} );

describe( "Test for getting the base from adjectives that don't get any forms", function() {
	OnlyBaseAdjective.forEach( function( word ) {
		it( "returns the base of the word form which is a base itself", function() {
			returnedGetBaseResult = getAdjectiveStem( word, regexAdjective, stopAdjectives );
			expect( returnedGetBaseResult.base ).toEqual( word );
			expect( returnedGetBaseResult.guessedForm ).toEqual( "base" );
		} );
	} );
} );
