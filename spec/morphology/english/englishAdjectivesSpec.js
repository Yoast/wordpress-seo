import { getAdjectiveForms, getBase  } from "../../../src/morphology/english/getAdjectiveForms";
import { buildOneFormFromRegex, buildTwoFormsFromRegex } from "../../../src/morphology/morphoHelpers/buildFormRule";
import createRulesFromMorphologyData from "../../../src/morphology/morphoHelpers/createRulesFromMorphologyData";

import morphologyData from "../../../src/morphology/morphologyData.json";
const adjectiveData = morphologyData.en.adjectives;
const irregularAdjectivesToTest = adjectiveData.irregularAdjectives;
const regexAdjective = adjectiveData.regexAdjective;

import { includes } from "lodash-es";

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

const icAtTheEnd = [
	[ "academic", "academically" ],
	[ "systematic", "systematically" ],
	[ "democratic", "democratically" ],
	[ "basic", "basically" ],
	[ "scientific", "scientifically" ],
	[ "realistic", "realistically" ],
	[ "organic", "organically" ],
	[ "genetic", "genetically" ],
	[ "magnetic", "magnetically" ],
	[ "problematic", "problematically" ],
	[ "nordic", "nordically" ],
	[ "manic", "manically" ],
	[ "galactic", "galactically" ],
];

const icallyBase = [
	[ "academic", "academical", "academically" ],
	[ "systematic", "systematical", "systematically" ],
	[ "democratic", "democratical", "democratically" ],
	[ "basic", "basical", "basically" ],
	[ "scientific", "scientifical", "scientifically" ],
	[ "realistic", "realistical", "realistically" ],
	[ "organic", "organical", "organically" ],
	[ "magic", "magical", "magically" ],
	[ "politic", "political", "politically" ],
	[ "typic", "typical", "typically" ],
	[ "logic", "logical", "logically" ],
	[ "optic", "optical", "optically" ],
	[ "mathematic", "mathematical", "mathematically" ],
	[ "geographic", "geographical", "geographically" ],
];

const bleAtTheEnd = [
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
];

const longAdjectives = [
	"beautiful",
	"necessary",
	"superior",
	"geographical",
	"habitual",
	"fictitious",
	"fantastic",
	"feminine",
	"parallel",
	"parisian",
	"pathetic",
	"powerless",
	"possible",
	"academic",
];

const OnlyBaseAdjective = [
	"boring",
	"calming",
	"numbing",
	"awful",
	"careful",
	"cheerful",
	"foolish",
	"childish",
	"stylish",
	"local",
	"cordial",
	"equal",
	"final",
	"alive",
	"passive",
	"naive",
	"childlike",
	"alike",
	"basic",
	"rustic",
	"anxious",
	"fearless",
	"jealous",
	"stable",
	"noble",
];

const allFormsToTestForBase = regularAdjectivesToTest.concat( yAtTheEnd, eAtTheEnd, needsDoublingLastConsonant );

const onlyBaseAndAdverbToTestForBase = bleAtTheEnd;

const icallyAdverbs = icallyBase;

const onlyBaseAndAdverb = longAdjectives.concat( OnlyBaseAdjective );

let receivedForms = [];

describe( "Test for getting all possible word forms for regular adjectives", function() {
	regularAdjectivesToTest.forEach( function( paradigm ) {
		paradigm.forEach( function( wordInParadigm ) {
			it( "returns an array of word forms for a regular adjective", function() {
				receivedForms = getAdjectiveForms( wordInParadigm, adjectiveData );
				paradigm.forEach( function( form ) {
					expect( receivedForms ).toContain( form );
				} );
			} );
		} );
	} );
} );

describe( "Test for getting all possible word forms for yAtTheEnd adjectives", function() {
	yAtTheEnd.forEach( function( paradigm ) {
		paradigm.forEach( function( wordInParadigm ) {
			it( "returns an array of word forms for a yAtTheEnd adjectives", function() {
				receivedForms = getAdjectiveForms( wordInParadigm, adjectiveData );
				paradigm.forEach( function( form ) {
					expect( receivedForms ).toContain( form );
				} );
			} );
		} );
	} );
} );

describe( "Test for getting all possible word forms for eAtTheEnd adjectives", function() {
	eAtTheEnd.forEach( function( paradigm ) {
		paradigm.forEach( function( wordInParadigm ) {
			it( "returns an array of word forms for a eAtTheEnd adjective", function() {
				receivedForms = getAdjectiveForms( wordInParadigm, adjectiveData );
				paradigm.forEach( function( form ) {
					expect( receivedForms ).toContain( form );
				} );
			} );
		} );
	} );
} );

describe( "Test for getting all possible word forms for needsDoublingLastConsonant adjectives", function() {
	needsDoublingLastConsonant.forEach( function( paradigm ) {
		paradigm.forEach( function( wordInParadigm ) {
			it( "returns an array of word forms for a needsDoublingLastConsonant adjectives", function() {
				receivedForms = getAdjectiveForms( wordInParadigm, adjectiveData );
				paradigm.forEach( function( form ) {
					expect( receivedForms ).toContain( form );
				} );
			} );
		} );
	} );
} );

describe( "Test for getting all possible word forms for icAtTheEnd adjectives", function() {
	icAtTheEnd.forEach( function( paradigm ) {
		paradigm.forEach( function( wordInParadigm ) {
			it( "returns an array of word forms for a icAtTheEnd adjectives", function() {
				receivedForms = getAdjectiveForms( wordInParadigm, adjectiveData );
				paradigm.forEach( function( form ) {
					expect( receivedForms ).toContain( form );
				} );
			} );
		} );
	} );
} );

describe( "Test for getting all possible word forms for bleAtTheEnd adjectives", function() {
	bleAtTheEnd.forEach( function( paradigm ) {
		paradigm.forEach( function( wordInParadigm ) {
			it( "returns an array of word forms for a bleAtTheEnd adjectives", function() {
				receivedForms = getAdjectiveForms( wordInParadigm, adjectiveData );
				paradigm.forEach( function( form ) {
					expect( receivedForms ).toContain( form );
				} );
			} );
		} );
	} );
} );

describe( "Test for getting all possible word forms for irregular adjectives", function() {
	irregularAdjectivesToTest.forEach( function( paradigm ) {
		paradigm.forEach( function( wordInParadigm ) {
			it( "returns an array of word forms for irregular adjectives", function() {
				receivedForms = getAdjectiveForms( wordInParadigm, adjectiveData );
				paradigm.forEach( function( form ) {
					expect( receivedForms ).toContain( form );
				} );
			} );
		} );
	} );
} );

let returnedGetBaseResult = "";

const comparativeToBaseRegex = createRulesFromMorphologyData( regexAdjective.comparativeToBase );
const superlativeToBaseRegex = createRulesFromMorphologyData( regexAdjective.superlativeToBase );
const adverbToBaseRegex = createRulesFromMorphologyData( regexAdjective.adverbToBase );

describe( "Test for getting the base from all types of regular adjectives", function() {
	allFormsToTestForBase.forEach( function( paradigm ) {
		const testBase = paradigm[ 0 ];
		it( "returns the base of the word form which is a base itself", function() {
			returnedGetBaseResult = getBase( testBase, comparativeToBaseRegex, superlativeToBaseRegex, adverbToBaseRegex );
			expect( returnedGetBaseResult.base ).toEqual( testBase );
			expect( returnedGetBaseResult.guessedForm ).toEqual( "base" );
		} );

		const testComparative = paradigm[ 1 ];
		it( "returns the base of the word form which is a comparative", function() {
			returnedGetBaseResult = getBase( testComparative, comparativeToBaseRegex, superlativeToBaseRegex, adverbToBaseRegex );
			expect( returnedGetBaseResult.base ).toEqual( testBase );
			expect( returnedGetBaseResult.guessedForm ).toEqual( "er" );
		} );

		const testSuperlative = paradigm[ 2 ];
		it( "returns the base of the word form which is a superlative", function() {
			returnedGetBaseResult = getBase( testSuperlative, comparativeToBaseRegex, superlativeToBaseRegex, adverbToBaseRegex );
			expect( returnedGetBaseResult.base ).toEqual( testBase );
			expect( returnedGetBaseResult.guessedForm ).toEqual( "est" );
		} );

		const testAdverb = paradigm[ 3 ];
		it( "returns the base of the word form which is an adverb", function() {
			returnedGetBaseResult = getBase( testAdverb, comparativeToBaseRegex, superlativeToBaseRegex, adverbToBaseRegex );
			expect( returnedGetBaseResult.base ).toEqual( testBase );
			expect( returnedGetBaseResult.guessedForm ).toEqual( "ly" );
		} );
	} );
} );

describe( "Test for getting two types of base forms for -ically adverbs", function() {
	icallyAdverbs.forEach( function( paradigm ) {
		it( "returns two possible base forms for a -ically adverb", function() {
			receivedForms = buildTwoFormsFromRegex( paradigm[ 2 ], createRulesFromMorphologyData( regexAdjective.icallyAdverbs ) );
			expect( receivedForms ).toContain( paradigm[ 1 ] );
			expect( receivedForms ).toContain( paradigm[ 0 ] );
		} );
	} );
} );

describe( "Test for getting the base from adjectives that have no comparative or superlative form", function() {
	onlyBaseAndAdverbToTestForBase.forEach( function( paradigm ) {
		const testBase = paradigm[ 0 ];
		it( "returns the base of the word form which is a base itself", function() {
			returnedGetBaseResult = getBase( testBase, comparativeToBaseRegex, superlativeToBaseRegex, adverbToBaseRegex );
			expect( returnedGetBaseResult.base ).toEqual( testBase );
			expect( returnedGetBaseResult.guessedForm ).toEqual( "base" );
		} );

		const testAdverb = paradigm[ 1 ];
		it( "returns the base of the word form which is an adverb", function() {
			returnedGetBaseResult = getBase( testAdverb, comparativeToBaseRegex, superlativeToBaseRegex, adverbToBaseRegex );
			expect( returnedGetBaseResult.base ).toEqual( testBase );
			expect( returnedGetBaseResult.guessedForm ).toEqual( "ly" );
		} );
	} );
} );

describe( "Test for returning the input form and the adverb of the adjectives that are too long to form comparatives/superlatives", function() {
	onlyBaseAndAdverb.forEach( function( word ) {
		it( "returns the input word and the adverb form", function() {
			receivedForms = getAdjectiveForms( word, adjectiveData );
			const fakeComparative = buildOneFormFromRegex( word, createRulesFromMorphologyData( regexAdjective.comparative ) );
			const fakeSuperlative = buildOneFormFromRegex( word, createRulesFromMorphologyData( regexAdjective.superlative ) );

			const whetherReceivedFormsHaveComparative = includes( receivedForms, fakeComparative );
			const whetherReceivedFormsHaveSuperlative = includes( receivedForms, fakeSuperlative );

			expect( whetherReceivedFormsHaveComparative ).toBe( false );
			expect( whetherReceivedFormsHaveSuperlative ).toBe( false );
		} );
	} );
} );
