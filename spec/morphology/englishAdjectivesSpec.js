const getAdjectiveForms = require( "../../src/morphology/english/getAdjectiveForms.js" ).getAdjectiveForms;
const irregularAdjectivesToTest = require( "../../src/morphology/english/irregularAdjectives.js" );

const regularAdjectivesToTest = [
	[ "tall", "taller", "tallest" ],
	[ "short", "shorter", "shortest" ],
	[ "cool", "cooler", "coolest" ],
	[ "warm", "warmer", "warmest" ],
	[ "dull", "duller", "dullest" ],
	[ "high", "higher", "highest" ],
	[ "silent", "silenter", "silentest" ],
	[ "kind", "kinder", "kindest" ],
	[ "firm", "firmer", "firmest" ],
	[ "cruel", "crueler", "cruelest" ],
	[ "green", "greener", "greenest" ],
	[ "bitter", "bitterer", "bitterest" ],
	[ "fresh", "fresher", "freshest" ],
	[ "weak", "weaker", "weakest" ],
	[ "cold", "colder", "coldest" ],
	[ "cool", "cooler", "coolest" ],
	[ "few", "fewer", "fewest" ],
	[ "full", "fuller", "fullest" ],
	[ "light", "lighter", "lightest" ],
	[ "alert", "alerter", "alertest" ],
	[ "certain", "certainer", "certainest" ],
	[ "hard", "harder", "hardest" ],
	[ "low", "lower", "lowest" ],
	[ "new", "newer", "newest" ],
	// [ "old", "older", "oldest" ],
	// [ "young", "younger", "youngest" ],
	// [ "loud", "louder", "loudest" ],
	// [ "abrupt", "abrupter", "abruptest" ],
	// [ "great", "greater", "greatest" ],
	// [ "long", "longer", "longest" ],
];

const yAtTheEnd = [
	[ "happy", "happier", "happiest" ],
	[ "pretty", "prettier", "prettiest" ],
	[ "heavy", "heavier", "heaviest" ],
	[ "tiny", "tinier", "tiniest" ],
	[ "healthy", "healthier", "healthiest" ],
	[ "funny", "funnier", "funniest" ],
	[ "angry", "angrier", "angriest" ],
	[ "crazy", "crazier", "craziest" ],
	[ "empty", "emptier", "emptiest" ],
	[ "busy", "busier", "busiest" ],
	[ "guilty", "guiltier", "guiltiest" ],
	[ "lucky", "luckier", "luckiest" ],
	[ "holy", "holier", "holiest" ],
	[ "dirty", "dirtier", "dirtiest" ],
	[ "hungry", "hungrier", "hungriest" ],
	[ "ugly", "uglier", "ugliest" ],
	[ "wealthy", "wealthier", "wealthiest" ],
	[ "deadly", "deadlier", "deadliest" ],
	[ "silly", "sillier", "silliest" ],
	[ "scary", "scarier", "scariest" ],
	[ "lonely", "lonelier", "loneliest" ],
	[ "sunny", "sunnier", "sunniest" ],
	[ "risky", "riskier", "riskiest" ],
	[ "fancy", "fancier", "fanciest" ],
	[ "early", "earlier", "earliest" ],
	[ "easy", "easier", "easiest" ],
];

const eAtTheEnd = [
	[ "nice", "nicer", "nicest" ],
	[ "white", "whiter", "whitest" ],
	[ "large", "larger", "largest" ],
	[ "true", "truer", "truest" ],
	[ "late", "later", "latest" ],
	[ "blue", "bluer", "bluest" ],
	[ "simple", "simpler", "simplest" ],
	[ "safe", "safer", "safest" ],
	[ "wide", "wider", "widest" ],
	[ "rare", "rarer", "rarest" ],
	[ "pure", "purer", "purest" ],
	[ "stable", "stabler", "stablest" ],
	[ "subtle", "subtler", "subtlest" ],
	[ "wise", "wiser", "wisest" ],
	[ "cute", "cuter", "cutest" ],
	[ "brave", "braver", "bravest" ],
	[ "dense", "denser", "densest" ],
	[ "vague", "vaguer", "vaguest" ],
	[ "rude", "ruder", "rudest" ],
	[ "gentle", "gentler", "gentlest" ],

];

const needsDoublingLastConsonant = [
	[ "big", "bigger", "biggest" ],
	[ "red", "redder", "reddest" ],
	[ "sad", "sadder", "saddest" ],
	[ "mad", "madder", "maddest" ],
	[ "slim", "slimmer", "slimmest" ],
	[ "dim", "dimmer", "dimmest" ],
	[ "grim", "grimmer", "grimmest" ],
	[ "thin", "thinner", "thinnest" ],
	[ "tan", "tanner", "tannest" ],
	[ "hip", "hipper", "hippest" ],
	[ "hot", "hotter", "hottest" ],
	[ "fat", "fatter", "fattest" ],
	[ "wet", "wetter", "wettest" ],
	[ "fit", "fitter", "fittest" ],

];

let receivedForms = [];

describe( "Test for getting all possible word forms for regular adjectives", function() {
	regularAdjectivesToTest.forEach( function( paradigm ) {
		paradigm.forEach( function( wordInParadigm ) {
			it( "returns an array of word forms for a regular adjective", function() {
				receivedForms = getAdjectiveForms( wordInParadigm );
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
				receivedForms = getAdjectiveForms( wordInParadigm );
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
				receivedForms = getAdjectiveForms( wordInParadigm );
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
				receivedForms = getAdjectiveForms( wordInParadigm );
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
				receivedForms = getAdjectiveForms( wordInParadigm );
				paradigm.forEach( function( form ) {
					expect( receivedForms ).toContain( form );
				} );
			} );
		} );
	} );
} );
