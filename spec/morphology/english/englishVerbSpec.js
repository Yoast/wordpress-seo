const verbData = require( "../../../js/morphology/english/englishMorphology.json" ).en.verbs;
const irregularVerbsToTest = verbData.irregularVerbs;

const getVerbForms  = require(  "../../../js/morphology/english/getVerbForms" ).getVerbForms;
const normalizePrefixed  = require(  "../../../js/morphology/english/getVerbForms" ).normalizePrefixed;

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
	[ "ache", "aches", "aching", "ached" ],
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
];

const needsDoublingLastConsonant = [
	[ "beg", "begs", "begging", "begged" ],
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

const irregularVerbsWithPrefixes = [
	[ "abear", "abears", "abearing", "abore", "abare", "aborne" ],
	[ "atslip", "atslips", "atslipping", "atslipped", "atslope", "atslopen" ],
	[ "become", "becomes", "becoming", "became", "becomen" ],
	[ "enfreeze", "enfreezes", "enfreezing", "enfroze", "enfrozen" ],
	[ "inblow", "inblows", "inblowing", "inblew", "inblown" ],
	[ "onhold", "onholds", "onholding", "onheld", "onholden" ],
	[ "resow", "resows", "resowing", "resowed", "resown" ],
	[ "tobeat", "tobeats", "tobeating", "tobeat", "tobeaten" ],
	[ "undo", "undoes", "undoing", "undid", "undone" ],
	[ "upgrow", "upgrows", "upgrowing", "upgrew", "upgrown", "upgrowe", "upgrowes", "upgrewe", "upgrowne" ],
	[ "at-slip", "at-slips", "at-slipping", "at-slipped", "at-slope", "at-slopen" ],
	[ "be-come", "be-comes", "be-coming", "be-came", "be-comen" ],
	[ "co-write", "co-writes", "co-writing", "co-wrote", "co-written", "co-writ" ],
	[ "en-freeze", "en-freezes", "en-freezing", "en-froze", "en-frozen" ],
	[ "in-blow", "in-blows", "in-blowing", "in-blew", "in-blown" ],
	[ "on-hold", "on-holds", "on-holding", "on-held", "on-holden" ],
	[ "re-sow", "re-sows", "re-sowing", "re-sowed", "re-sown" ],
	[ "to-beat", "to-beats", "to-beating", "to-beat", "to-beaten" ],
	[ "un-do", "un-does", "un-doing", "un-did", "un-done" ],
	[ "up-grow", "up-grows", "up-growing", "up-grew", "up-grown", "up-growe", "up-growes", "up-grewe", "up-growne" ],
	[ "disprove", "disproves", "disproving", "disproved", "disproven" ],
	[ "farspeak", "farspeaks", "farspeaking", "farspoke", "farspoken" ],
	[ "fordrink", "fordrinks", "fordrinking", "fordrank", "fordrunk" ],
	[ "mischoose", "mischooses", "mischoosing", "mischose", "mischosen" ],
	[ "offtake", "offtakes", "offtaking", "offtook", "offtaken" ],
	[ "outgo", "outgoe", "outgoes", "outgoing", "outwent", "outgone" ],
	[ "preshow", "preshows", "preshowing", "preshowed", "preshown" ],
	[ "dis-prove", "dis-proves", "dis-proving", "dis-proved", "dis-proven" ],
	[ "far-speak", "far-speaks", "far-speaking", "far-spoke", "far-spoken" ],
	[ "for-drink", "for-drinks", "for-drinking", "for-drank", "for-drunk" ],
	[ "mis-choose", "mis-chooses", "mis-choosing", "mis-chose", "mis-chosen" ],
	[ "off-take", "off-takes", "off-taking", "off-took", "off-taken" ],
	[ "out-go", "out-goe", "out-goes", "out-going", "out-went", "out-gone" ],
	[ "pre-show", "pre-shows", "pre-showing", "pre-showed", "pre-shown" ],
	[ "autorun", "autoruns", "autorunning", "autoran", "autorin", "autorins", "autorinning" ],
	[ "backshine", "backshines", "backshining", "backshone", "backshined" ],
	[ "deepfreeze", "deepfreezes", "deepfreezing", "deepfroze", "deepfrozen" ],
	[ "downtrod", "downtrods", "downtrodding", "downtrod", "downtrodden" ],
	[ "finedraw", "finedraws", "finedrawing", "finedrew", "finedrawn" ],
	[ "forebear", "forebears", "forebearing", "forebore", "forebare", "foreborne" ],
	[ "freerid", "freerid", "freeridded", "freeride", "freerode", "freeridden" ],
	[ "fullcome", "fullcomes", "fullcoming", "fullcame", "fullcomen" ],
	[ "halfsew", "halfsews", "halfsewing", "halfsewed", "halfsewn" ],
	[ "handsew", "handsews", "handsewing", "handsewed", "handsewn" ],
	[ "heatsink", "heatsinks", "heatsinking", "heatsank", "heatsunk", "heatsunken" ],
	[ "overbreak", "overbreaks", "overbreaking", "overbroke", "overbroken" ],
	[ "testdrive", "testdrives", "testdriving", "testdrove", "testdriven" ],
	[ "umbeset", "umbesets", "umbesetting" ],
	[ "windbreak", "windbreaks", "windbreaking", "windbroke", "windbroken" ],
	[ "withhold", "withholds", "withholding", "withheld", "withholden" ],
	[ "auto-run", "auto-runs", "auto-running", "auto-ran", "auto-rin", "auto-rins", "auto-rinning" ],
	[ "back-shine", "back-shines", "back-shining", "back-shone", "back-shined" ],
	[ "deep-freeze", "deep-freezes", "deep-freezing", "deep-froze", "deep-frozen" ],
	[ "down-trod", "down-trods", "down-trodding", "down-trod", "down-trodden" ],
	[ "fine-draw", "fine-draws", "fine-drawing", "fine-drew", "fine-drawn" ],
	[ "fore-bear", "fore-bears", "fore-bearing", "fore-bore", "fore-bare", "fore-borne" ],
	[ "free-rid", "free-rid", "free-ridded", "free-ride", "free-rode", "free-ridden" ],
	[ "full-come", "full-comes", "full-coming", "full-came", "full-comen" ],
	[ "half-sew", "half-sews", "half-sewing", "half-sewed", "half-sewn" ],
	[ "hand-sew", "hand-sews", "hand-sewing", "hand-sewed", "hand-sewn" ],
	[ "heat-sink", "heat-sinks", "heat-sinking", "heat-sank", "heat-sunk", "heat-sunken" ],
	[ "over-break", "over-breaks", "over-breaking", "over-broke", "over-broken" ],
	[ "test-drive", "test-drives", "test-driving", "test-drove", "test-driven" ],
	[ "wind-break", "wind-breaks", "wind-breaking", "wind-broke", "wind-broken" ],
	[ "with-hold", "with-holds", "with-holding", "with-held", "with-holden" ],
	[ "aftersee", "aftersees", "afterseeing", "aftersaw", "afterseen", "aftersaws", "aftersawing", "aftersawed", "aftersawn" ],
	[ "belawgive", "belawgives", "belawgiving", "belawgave", "belawgiven" ],
	[ "entertake", "entertakes", "entertaking", "entertook", "entertaken" ],
	[ "forthnim", "forthnims", "forthnimming", "forthnimmed", "forthnam", "forthnumb", "forthnomen", "forthnum", "forthnome" ],
	[ "frostbite", "frostbites", "frostbiting", "frostbit", "frostbitten" ],
	[ "housebreak", "housebreaks", "housebreaking", "housebroke", "housebroken" ],
	[ "intercome", "intercomes", "intercoming", "intercame", "intercomen" ],
	[ "quickfreeze", "quickfreezes", "quickfreezing", "quickfroze", "quickfrozen" ],
	[ "roughhew", "roughhews", "roughhewing", "roughhewed", "roughhewn" ],
	[ "undercreep", "undercreeps", "undercreeping", "undercrept", "undercrope", "undercreeped", "undercropen" ],
	[ "after-see", "after-sees", "after-seeing", "after-saw", "after-seen", "after-saws", "after-sawing", "after-sawed", "after-sawn" ],
	[ "belaw-give", "belaw-gives", "belaw-giving", "belaw-gave", "belaw-given" ],
	[ "enter-take", "enter-takes", "enter-taking", "enter-took", "enter-taken" ],
	[ "forth-nim", "forth-nims", "forth-nimming", "forth-nimmed", "forth-nam", "forth-numb", "forth-nomen", "forth-num", "forth-nome" ],
	[ "frost-bite", "frost-bites", "frost-biting", "frost-bit", "frost-bitten" ],
	[ "house-break", "house-breaks", "house-breaking", "house-broke", "house-broken" ],
	[ "inter-come", "inter-comes", "inter-coming", "inter-came", "inter-comen" ],
	[ "quick-freeze", "quick-freezes", "quick-freezing", "quick-froze", "quick-frozen" ],
	[ "rough-hew", "rough-hews", "rough-hewing", "rough-hewed", "rough-hewn" ],
	[ "under-creep", "under-creeps", "under-creeping", "under-crept", "under-crope", "under-creeped", "under-cropen" ],
	[ "countersing", "countersings", "countersinging", "countersang", "countersung" ],
	[ "quartersee", "quartersees", "quarterseeing", "quartersaw", "quarterseen", "quartersaws", "quartersawing", "quartersawed", "quartersawn" ],
	[ "counter-sing", "counter-sings", "counter-singing", "counter-sang", "counter-sung" ],
	[ "quarter-see", "quarter-sees", "quarter-seeing", "quarter-saw", "quarter-seen", "quarter-saws", "quarter-sawing", "quarter-sawed", "quarter-sawn" ],
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

let receivedForms = [];

describe( "Test for normalizing verb prefix", function() {
	verbsToNormalizePrefix.forEach( function( paradigm ) {
		const verbToNormalize = paradigm[ 0 ];
		const expectedNormalization = paradigm[ 1 ].normalizedWord;
		const expectedPrefix = paradigm[ 1 ].prefix;
		it( "returns a normalized form for a prefixed verb", function() {
			const receivedNormalization = normalizePrefixed( verbToNormalize, verbData.regexVerb.verbPrefixes );
			expect( receivedNormalization.normalizedWord ).toEqual( expectedNormalization );
			expect( receivedNormalization.prefix ).toEqual( expectedPrefix );
		} );
	} );
} );

describe( "Test for getting all possible word forms for regular verbs", function() {
	regularVerbsToTest.forEach( function( paradigm ) {
		paradigm.forEach( function( wordInParadigm ) {
			it( "returns an array of word forms for a regular verb", function() {
				receivedForms = getVerbForms( wordInParadigm, verbData );
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
				receivedForms = getVerbForms( wordInParadigm, verbData );
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
				receivedForms = getVerbForms( wordInParadigm, verbData );
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
				receivedForms = getVerbForms( wordInParadigm, verbData );
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
				receivedForms = getVerbForms( wordInParadigm, verbData );
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
				receivedForms = getVerbForms( wordInParadigm, verbData );
				paradigm.forEach( function( form ) {
					expect( receivedForms ).toContain( form );
				} );
			} );
		} );
	} );
} );

describe( "Test for getting all possible word forms for irregular verbs with prefixes", function() {
	irregularVerbsWithPrefixes.forEach( function( paradigm ) {
		paradigm.forEach( function( wordInParadigm ) {
			it( "returns an array of word forms for an irregular verbs with prefixes", function() {
				receivedForms = getVerbForms( wordInParadigm, verbData );
				paradigm.forEach( function( form ) {
					expect( receivedForms ).toContain( form );
				} );
			} );
		} );
	} );
} );
