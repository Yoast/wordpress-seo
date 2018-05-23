const getNounForms = require( "../../src/morphology/english/getNounForms.js" ).getNounForms;
const irregularNounsToTest = require( "../../src/morphology/english/irregularNouns.js" );

const regularNounsToTest = [
	[ "word", "words" ],
	[ "horse", "horses" ],
	[ "knife", "knives" ],
	[ "lolly", "lollies" ],
	[ "half", "halves" ],
	[ "scarf", "scarves" ],
	[ "handkerchief", "handkerchieves" ],
	[ "boss", "bosses" ],
	[ "ex", "exes" ],
	[ "man", "men" ],
	[ "news", "news" ],
	[ "paraphrenelium", "paraphrenelia" ],
	[ "crisis", "crises" ],
	[ "analytics", "analytics" ],
	[ "sickness", "sicknesses" ],
	[ "policeman", "policemen" ],
	[ "berry", "berries" ],
	[ "activity", "activities" ],
	[ "daisy", "daisies" ],
	[ "church", "churches" ],
	[ "fox", "foxes" ],
	[ "knife", "knives" ],
	[ "half", "halves" ],
	[ "scarf", "scarves" ],
	[ "chief", "chiefs" ],
	[ "spoof", "spoofs" ],
	[ "solo", "solos" ],
	[ "studio", "studios" ],
	[ "zoo", "zoos" ],
	[ "embryo", "embryos" ],
	[ "roof", "roofs" ],
	[ "proof", "proofs"],
	[ "chief", "chiefs"],
	[ "leaf", "leaves" ],
	[ "loaf", "loaves" ],
	[ "thief", "thieves" ],
	[ "move", "moves" ],
	[ "rodeo", "rodeos" ],
	[ "sex", "sexes" ],

	[ "thesis", "theses" ],


	// Latin: ix/ex/yx/ax/ux - ices
	[ "cortex", "cortices" ],
	[ "neocortex", "neocortices" ],
	[ "pontifex", "pontifices" ],
	[ "mesovertex", "mesovertices" ],
	[ "adjutrix", "adjutrices" ],
	[ "subappendix", "subappendices" ],
	[ "calyx", "calyces" ],
	[ "protothorax", "protothoraces" ],
	[ "crux", "cruces" ],

	// Latin: us - i
	[ "alumnus", "alumni" ],
	[ "bacillus", "bacilli" ],
	[ "cactus", "cacti" ],
	[ "hippopotamus", "hippopotami" ],
	[ "modulus", "moduli" ],
	[ "radius", "radii" ],
	[ "syllabus", "syllabi" ],
	[ "octopus", "octopi" ],
	[ "radius", "radii" ],
];

const hispanicNounsToTest = [
	[ "buffalo", "buffalos", "buffaloes" ],
	[ "potato", "potatos", "potatoes" ],
	[ "tomato", "tomatos", "tomatoes" ],
	[ "torpedo", "torpedos", "torpedoes" ],
	[ "veto", "vetos", "vetoes" ],
	[ "mosquito", "mosquitos", "mosquitoes" ],
	[ "embargo", "embargos", "embargoes" ],
	[ "hero", "heros", "heroes" ],
	[ "avocado", "avocados", "avocadoes" ],
	[ "banjo", "banjos", "banjoes" ],
	[ "cargo", "cargos", "cargoes" ],
	[ "flamingo", "flamingos", "flamingoes" ],
	[ "fresco", "frescos", "frescoes" ],
	[ "ghetto", "ghettos", "ghettoes" ],
	[ "halo", "halos", "haloes" ],
	[ "mango", "mangos", "mangoes" ],
	[ "domino", "dominoes", "dominos" ],
	[ "memento", "mementos", "mementoes" ],
	[ "motto", "mottos", "mottoes" ],
	[ "tornado", "tornados", "tornadoes" ],
	[ "tuxedo", "tuxedos", "tuxedoes" ],
	[ "volcano", "volcanos", "volcanoes" ],
];

const latinAeNounsToTest = [
	[ "antenna", "antennae", "antennas" ],
	[ "formula" ,"formulae" ,"formulas" ],
	[ "alga", "algae", "algas" ],
	[ "alumna", "alumnae", "alumnas" ],
	[ "larva", "larvae", "larvas" ],
	[ "vita", "vitae", "vitas" ],
];


let expectedForms = [];
let receivedForms = [];

describe( "Test for getting all possible word forms for regular words", function() {
	regularNounsToTest.forEach( function ( paradigm ) {

		it( "returns an array of word forms for a regular singular", function() {
			receivedForms = getNounForms( paradigm[ 0 ] );

			paradigm.forEach( function ( form ) {
				expect( receivedForms ).toContain( form );
			} );
		} );

		it( "returns an array of word forms for a regular plural", function() {
			receivedForms = getNounForms( paradigm[ 1 ] );

			paradigm.forEach( function ( form ) {
				expect( receivedForms ).toContain( form );
			} );
		} );
	} );
} );

describe( "Test for getting all possible word forms for hispanic words", function() {
	hispanicNounsToTest.forEach( function ( paradigm ) {

		it( "returns an array of word forms for a hispanic singular", function() {
			receivedForms = getNounForms( paradigm[ 0 ] );

			paradigm.forEach( function ( form ) {
				expect( receivedForms ).toContain( form );
			} );
		} );

		it( "returns an array of word forms for a hispanic plural with -os", function() {
			receivedForms = getNounForms( paradigm[ 1 ] );

			paradigm.forEach( function ( form ) {
				expect( receivedForms ).toContain( form );
			} );
		} );

		it( "returns an array of word forms for a hispanic plural with -oes", function() {
			receivedForms = getNounForms( paradigm[ 2 ] );

			paradigm.forEach( function ( form ) {
				expect( receivedForms ).toContain( form );
			} );
		} );
	} );
} );

describe( "Test for getting all possible word forms for irregular words", function() {
	irregularNounsToTest.forEach( function ( paradigm ) {
		paradigm.forEach (function( wordInParadigm ) {
			it( "returns an array of word forms for an irregular word", function() {
				receivedForms = getNounForms( wordInParadigm );
				paradigm.forEach (function( form ) {
					expect( receivedForms ).toContain( form );
				} );
			} );
		} );
	} );
} );
