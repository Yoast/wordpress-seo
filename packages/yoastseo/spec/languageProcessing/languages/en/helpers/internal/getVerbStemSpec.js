import getMorphologyData from "../../../../../specHelpers/getMorphologyData";
import {
	getInfinitive,
	checkIrregulars,
	normalizePrefixed,
} from "../../../../../../src/languageProcessing/languages/en/helpers/internal/getVerbStem";
import isUndefined from "lodash/isUndefined";

const morphologyData = getMorphologyData( "en" );
const regexVerb = morphologyData.en.verbs.regexVerb;

const regularVerbsToTest = [
	[ "bill", "bills", "billing", "billed" ],
	[ "bully", "bullies", "bullying", "bullied" ],
	[ "swap", "swaps", "swapping", "swapped" ],
	[ "pass", "passes", "passing", "passed" ],
	[ "develop", "develops", "developing", "developed" ],
	[ "join", "joins", "joining", "joined" ],
	[ "release", "releases", "releasing", "released" ],
	[ "create", "creates", "creating", "created" ],
	[ "compete", "competes", "competing", "competed" ],
	[ "improve", "improves", "improving", "improved" ],
	[ "color", "colors", "coloring", "colored" ],
	[ "brr" ],
	[ "bed", "beds", "bedding" ],
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
	[ "fry", "fries", "frying", "fried" ],
	[ "hurry", "hurries", "hurrying", "hurried" ],
	[ "marry", "marries", "marrying", "married" ],
	[ "pity", "pities", "pitying", "pitied" ],
	[ "ply", "plies", "plying", "plied" ],
	[ "pry", "pries", "prying", "pried" ],
	[ "tidy", "tidies", "tidying", "tidied" ],
	[ "try", "tries", "trying", "tried" ],
	[ "worry", "worries", "worrying", "worried" ],
	[ "employ", "employs", "employing", "employed" ],
	[ "enjoy", "enjoys", "enjoying", "enjoyed" ],
	[ "flay", "flays", "flaying", "flayed" ],
	[ "pay", "pays", "paying", "payed" ],
	[ "play", "plays", "playing", "played" ],
	[ "slay", "slays", "slaying", "slayed" ],
	[ "spray", "sprays", "spraying", "sprayed" ],
	[ "stay", "stays", "staying", "stayed" ],
	[ "sway", "sways", "swaying", "swayed" ],
	[ "flay", "flays", "flaying", "flayed" ],
	[ "play", "plays", "playing", "played" ],
	[ "pray", "prays", "praying", "prayed" ],
	[ "ply", "plies", "plying", "plied" ],
	[ "pry", "pries", "prying", "pried" ],
];

const eAtTheEnd = [
	[ "abate", "abates", "abating", "abated" ],
	[ "bathe", "bathes", "bathing", "bathed" ],
	[ "believe", "believes", "believing", "believed" ],
	[ "care", "cares", "caring", "cared" ],
	[ "delete", "deletes", "deleting", "deleted" ],
	[ "dive", "dives", "diving", "dived" ],
	[ "enslave", "enslaves", "enslaving", "enslaved" ],
	[ "excite", "excites", "exciting", "excited" ],
	[ "file", "files", "filing", "filed" ],
	[ "gripe", "gripes", "griping", "griped" ],
	[ "hope", "hopes", "hoping", "hoped" ],
	[ "joke", "jokes", "joking", "joked" ],
	[ "live", "lives", "living", "lived" ],
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
	[ "amaze", "amazes", "amazing", "amazed" ],
];

const needsDoublingLastConsonant = [
	[ "beg", "begs", "begging", "begged" ],
	[ "spam", "spams", "spamming", "spammed" ],
	[ "chat", "chats", "chatting", "chatted" ],
	[ "fit", "fits", "fitting", "fitted" ],
	[ "grin", "grins", "grinning", "grinned" ],
	[ "grip", "grips", "gripping", "gripped" ],
	[ "hop", "hops", "hopping", "hopped" ],
	[ "nip", "nips", "nipping", "nipped" ],
	[ "pin", "pins", "pinning", "pinned" ],
	[ "quit", "quits", "quitting", "quitted" ],
	[ "rip", "rips", "ripping", "ripped" ],
	[ "tip", "tips", "tipping", "tipped" ],
	[ "wet", "wets", "wetting", "wetted" ],
];

const verbsToNormalizePrefix = [
	[ "abear", { normalizedWord: "bear", prefix: "a" } ],
	[ "atslips", { normalizedWord: "slips", prefix: "at" } ],
	[ "became", { normalizedWord: "came", prefix: "be" } ],
	[ "enfreezes", { normalizedWord: "freezes", prefix: "en" } ],
	[ "at-slipped", { normalizedWord: "slipped", prefix: "at-" } ],
	[ "disproving", { normalizedWord: "proving", prefix: "dis" } ],
	[ "outgoing", { normalizedWord: "going", prefix: "out" } ],
	[ "far-speaks", { normalizedWord: "speaks", prefix: "far-" } ],
	[ "autorun", { normalizedWord: "run", prefix: "auto" } ],
	[ "backshined", { normalizedWord: "shined", prefix: "back" } ],
	[ "umbeset", { normalizedWord: "set", prefix: "umbe" } ],
	[ "auto-run", { normalizedWord: "run", prefix: "auto-" } ],
	[ "afterseen", { normalizedWord: "seen", prefix: "after" } ],
	[ "housebreak", { normalizedWord: "break", prefix: "house" } ],
	[ "after-see", { normalizedWord: "see", prefix: "after-" } ],
	[ "frost-bite", { normalizedWord: "bite", prefix: "frost-" } ],
	[ "quick-freeze", { normalizedWord: "freeze", prefix: "quick-" } ],
	[ "under-creep", { normalizedWord: "creep", prefix: "under-" } ],
	[ "countersing", { normalizedWord: "sing", prefix: "counter" } ],
	[ "quartersee", { normalizedWord: "see", prefix: "quarter" } ],
	[ "counter-singing", { normalizedWord: "singing", prefix: "counter-" } ],
	[ "quarter-see", { normalizedWord: "see", prefix: "quarter-" } ],
];

describe( "Test for normalizing verb prefix", function() {
	verbsToNormalizePrefix.forEach( function( paradigm ) {
		const verbToNormalize = paradigm[ 0 ];
		const expectedNormalization = paradigm[ 1 ].normalizedWord;
		const expectedPrefix = paradigm[ 1 ].prefix;
		it( "returns a normalized form for a prefixed verb", function() {
			const receivedNormalization = normalizePrefixed( verbToNormalize, regexVerb.verbPrefixes );
			expect( receivedNormalization.normalizedWord ).toEqual( expectedNormalization );
			expect( receivedNormalization.prefix ).toEqual( expectedPrefix );
		} );
	} );

	it( "returns undefined if the word doesn't match any of the verbPrefixes regex", function() {
		expect( isUndefined( normalizePrefixed( "long", regexVerb.verbPrefixes ) ) ).toBe( true );
	} );
} );

describe( "Test for irregular verbs", function() {
	const irregularVerbs = morphologyData.en.verbs.irregularVerbs;
	it( "returns an array of word forms from of the irregular verb", function() {
		expect( checkIrregulars( "bandsaw", irregularVerbs, regexVerb.verbPrefixes ) ).toEqual(
			[ "bandsaw", "bandsaws", "bandsawing", "bandsawed", "bandsawn" ]
		);
	} );

	it( "returns an array of word forms from of the irregular verb with normalized verb prefix", function() {
		expect( checkIrregulars( "unbreak", irregularVerbs, regexVerb.verbPrefixes ) ).toEqual(
			[ "unbreak", "unbreaks", "unbreaking", "unbroke", "unbroken" ]
		);
	} );

	it( "returns undefined if the word is not irregular verb", function() {
		expect( isUndefined( checkIrregulars( "cooked", irregularVerbs, regexVerb.verbPrefixes ) ) ).toBe( true );
	} );
} );

describe( "Test for getting infinitive", function() {
	regularVerbsToTest.forEach( function( paradigm ) {
		paradigm.forEach( function( wordInParadigm ) {
			it( "returns the infinitive form of the regular verbs", function() {
				expect( getInfinitive( wordInParadigm, regexVerb ).infinitive ).toEqual( paradigm[ 0 ] );
			} );
		} );
	} );

	doubleConsonantsAtTheEnd.forEach( function( paradigm ) {
		paradigm.forEach( function( wordInParadigm ) {
			it( "returns the infinitive form of verbs with double consonants at the end", function() {
				expect( getInfinitive( wordInParadigm, regexVerb ).infinitive ).toEqual( paradigm[ 0 ] );
			} );
		} );
	} );

	yAtTheEnd.forEach( function( paradigm ) {
		paradigm.forEach( function( wordInParadigm ) {
			it( "returns the infinitive form of verbs with y at the end", function() {
				expect( getInfinitive( wordInParadigm, regexVerb ).infinitive ).toEqual( paradigm[ 0 ] );
			} );
		} );
	} );

	eAtTheEnd.forEach( function( paradigm ) {
		paradigm.forEach( function( wordInParadigm ) {
			it( "returns the infinitive form of verbs with e at the end", function() {
				expect( getInfinitive( wordInParadigm, regexVerb ).infinitive ).toEqual( paradigm[ 0 ] );
			} );
		} );
	} );

	needsDoublingLastConsonant.forEach( function( paradigm ) {
		paradigm.forEach( function( wordInParadigm ) {
			it( "returns the infinitive form of verbs that need doubling of the last consonant", function() {
				expect( getInfinitive( wordInParadigm, regexVerb ).infinitive ).toEqual( paradigm[ 0 ] );
			} );
		} );
	} );
} );
