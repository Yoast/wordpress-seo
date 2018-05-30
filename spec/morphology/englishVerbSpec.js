const getVerbForms = require( "../../src/morphology/english/getVerbForms.js" ).getVerbForms;
const irregularVerbsToTest = require( "../../src/morphology/english/irregularVerbs.js" );

const regularVerbsToTest = [
	[ "bill", "bills", "billing", "billed" ],
	[ "bully", "bullies", "bullying", "bullied" ],
	[ "swap", "swaps", "swapping", "swapped" ],
	[ "pass", "passes", "passing", "passed" ],
];

const doubleConsonantsAtTheEnd = [
	[ "assess", "assesses", "assessing", "assessed" ],
	[ "bless", "blesses", "blessing", "blessed" ],
	[ "caress", "caresses", "caressing", "caressed" ],
	[ "fuss", "fusses", "fussing", "fussed" ],
	[ "kiss", "kisses", "kissing", "kissed" ],
	[ "miss", "misses", "missing", "missed" ],
	[ "pass", "passes", "passing", "passed" ],
	[ "toss", "tosses", "tossing", "tossed" ],
	[ "blush", "blushes", "blushing", "blushed" ],
	[ "dash", "dashes", "dashing", "dashed" ],
	[ "flash", "flashes", "flashing", "flashed" ],
	[ "gnash", "gnashes", "gnashing", "gnashed" ],
	[ "hush", "hushes", "hushing", "hushed" ],
	[ "lash", "lashes", "lashing", "lashed" ],
	[ "mash", "mashes", "mashing", "mashed" ],
	[ "push", "pushes", "pushing", "pushed" ],
	[ "rush", "rushes", "rushing", "rushed" ],
	[ "splash", "splashes", "splashing", "splashed" ],
	[ "stash", "stashes", "stashing", "stashed" ],
	[ "wash", "washes", "washing", "washed" ],
	[ "wish", "wishes", "wishing", "wished" ],
	[ "ditch", "ditches", "ditching", "ditched" ],
	[ "etch", "etches", "etching", "etched" ],
	[ "flinch", "flinches", "flinching", "flinched" ],
	[ "hitch", "hitches", "hitching", "hitched" ],
	[ "itch", "itches", "itching", "itched" ],
	[ "march", "marches", "marching", "marched" ],
	[ "mooch", "mooches", "mooching", "mooched" ],
	[ "patch", "patches", "patching", "patched" ],
	[ "reach", "reaches", "reaching", "reached" ],
	[ "search", "searches", "searching", "searched" ],
	[ "scratch", "scratches", "scratching", "scratched" ],
	[ "touch", "touches", "touching", "touched" ],
	[ "watch", "watches", "watching", "watched" ],
	[ "buzz", "buzzes", "buzzing", "buzzed" ],
	[ "fizz", "fizzes", "fizzing", "fizzed" ],
	[ "box", "boxes", "boxing", "boxed" ],
	[ "coax", "coaxes", "coaxing", "coaxed" ],
	[ "fax", "faxes", "faxing", "faxed" ],
	[ "fix", "fixes", "fixing", "fixed" ],
	[ "relax", "relaxes", "relaxing", "relaxed" ],
	[ "vex", "vexes", "vexing", "vexed" ],
	[ "wax", "waxes", "waxing", "waxed" ],
];

const yAtTheEnd = [
	[ "apply", "applies", "applying", "applied" ],
	[ "bury", "buries", "burying", "buried" ],
	[ "carry", "carries", "carrying", "carried" ],
	[ "copy", "copies", "copying", "copied" ],
	[ "cry", "cries", "crying", "cried" ],
	[ "dry", "dries", "drying", "dried" ],
	[ "fly", "flies", "flying", "flied" ],
	[ "fry", "fries", "frying", "fried" ],
	[ "hurry", "hurries", "hurrying", "hurried" ],
	[ "marry", "marries", "marrying", "married" ],
	[ "pity", "pities", "pitying", "pitied" ],
	[ "ply", "plies", "plying", "plied" ],
	[ "pry", "pries", "prying", "pried" ],
	[ "tidy", "tidies", "tidying", "tidied" ],
	[ "try", "tries", "trying", "tried" ],
	[ "worry", "worries", "worrying", "worried" ],
	[ "buy", "buys", "buying", "buied" ],
	[ "employ", "employs", "employsing", "emploied" ],
	[ "enjoy", "enjoys", "enjoying", "enjoied" ],
	[ "flay", "flays", "flaying", "flaied" ],
	[ "lay", "lays", "laying", "laied" ],
	[ "pay", "pays", "paying", "paied" ],
	[ "play", "plays", "playing", "plaied" ],
	[ "say", "says", "saying", "saied" ],
	[ "slay", "slays", "slaying", "slaied" ],
	[ "spray", "sprays", "spraying", "spraied" ],
	[ "stay", "stays", "staying", "staied" ],
	[ "sway", "sways", "swaying", "swaied" ],
	[ "flay", "flays", "flaying", "flaied" ],
	[ "play", "plays", "playing", "plaied" ],
	[ "pray", "prays", "praying", "praied" ],
	[ "fly", "flies", "flying", "flied" ],
	[ "ply", "plies", "plying", "plied" ],
	[ "pry", "pries", "prying", "pried" ],
];

const eAtTheEnd = [
	[ "abate", "abates", "abating", "abated" ],
	[ "ache", "aches", "aching", "ached" ],
	[ "bathe", "bathes", "bathing", "bathed" ],
	[ "believe", "believes", "believing", "believed" ],
	[ "care", "cares", "carin", "cared" ],
	[ "delete", "deletes", "deleting", "deleted" ],
	[ "dive", "dives", "diving", "dived" ],
	[ "enslave", "enslaves", "enslaving", "enslaved" ],
	[ "excite", "excites", "exciting", "excited" ],
	[ "file", "files", "filing", "filed" ],
	[ "gripe", "gripes", "griping", "griped" ],
	[ "hope", "hopes", "hoping", "hoped" ],
	[ "joke", "jokes", "joking", "joked" ],
	[ "live", "lives", "living", "lived" ],
	[ "make", "makes", "making", "maked" ],
	[ "parade", "parades", "parading", "paraded" ],
	[ "paste", "pastes", "pasting", "pasted" ],
	[ "raise", "raises", "raising", "raised" ],
	[ "revile", "reviles", "reviling", "reviled" ],
	[ "save", "saves", "saving", "saved" ],
	[ "smoothe", "smoothes", "smoothing", "smoothed" ],
	[ "taste", "tastes", "tasting", "tasted" ],
	[ "glue", "glues", "gluing", "glued" ],
	[ "rue", "rues", "ruing", "rued" ],
	[ "sue", "sues", "suing", "sued" ],
];

const needsDoublingLastConsonant = [
	[ "beg", "begs", "begging", "begged" ],
	[ "chat", "chats", "chatting", "chatted" ],
	[ "dig", "digs", "digging", "digged" ],
	[ "fit", "fits", "fitting", "fitted" ],
	[ "grin", "grins", "grinning", "grinned" ],
	[ "grip", "grips", "gripping", "gripped" ],
	[ "hop", "hops", "hopping", "hopped" ],
	[ "nip", "nips", "nipping", "nipped" ],
	[ "pin", "pins", "pinning", "pinned" ],
	[ "quit", "quits", "quitting", "quitted" ],
	[ "rip", "rips", "ripping", "ripped" ],
	[ "tip", "tips", "tipping", "tipped" ],
];



let receivedForms = [];

describe( "Test for getting all possible word forms for regular verbs", function() {
	regularVerbsToTest.forEach( function( paradigm ) {
		paradigm.forEach( function( wordInParadigm ) {
			it( "returns an array of word forms for a regular verb", function() {
				receivedForms = getVerbForms( wordInParadigm );
				paradigm.forEach( function( form ) {
					expect( receivedForms ).toContain( form );
				} );
			} );
		} );
	} );
} );

describe( "Test for getting all possible word forms for doubleConsonantsAtTheEnd verbs", function() {
	doubleConsonantsAtTheEnd.forEach( function( paradigm ) {
		paradigm.forEach( function( wordInParadigm ) {
			it( "returns an array of word forms for a doubleConsonantsAtTheEnd verb", function() {
				receivedForms = getVerbForms( wordInParadigm );
				paradigm.forEach( function( form ) {
					expect( receivedForms ).toContain( form );
				} );
			} );
		} );
	} );
} );

describe( "Test for getting all possible word forms for yAtTheEnd verbs", function() {
	yAtTheEnd.forEach( function( paradigm ) {
		paradigm.forEach( function( wordInParadigm ) {
			it( "returns an array of word forms for a yAtTheEnd verb", function() {
				receivedForms = getVerbForms( wordInParadigm );
				paradigm.forEach( function( form ) {
					expect( receivedForms ).toContain( form );
				} );
			} );
		} );
	} );
} );

describe( "Test for getting all possible word forms for eAtTheEnd verbs", function() {
	eAtTheEnd.forEach( function( paradigm ) {
		paradigm.forEach( function( wordInParadigm ) {
			it( "returns an array of word forms for a eAtTheEnd verb", function() {
				receivedForms = getVerbForms( wordInParadigm );
				paradigm.forEach( function( form ) {
					expect( receivedForms ).toContain( form );
				} );
			} );
		} );
	} );
} );

describe( "Test for getting all possible word forms for needsDoublingLastConsonant verbs", function() {
	needsDoublingLastConsonant.forEach( function( paradigm ) {
		paradigm.forEach( function( wordInParadigm ) {
			it( "returns an array of word forms for a needsDoublingLastConsonant verb", function() {
				receivedForms = getVerbForms( wordInParadigm );
				paradigm.forEach( function( form ) {
					expect( receivedForms ).toContain( form );
				} );
			} );
		} );
	} );
} );

describe( "Test for getting all possible word forms for irregular verbs", function() {
	irregularVerbsToTest.forEach( function( paradigm ) {
		paradigm.forEach( function( wordInParadigm ) {
			it( "returns an array of word forms for an irregular verbs", function() {
				receivedForms = getVerbForms( wordInParadigm );
				paradigm.forEach( function( form ) {
					expect( receivedForms ).toContain( form );
				} );
			} );
		} );
	} );
} );
