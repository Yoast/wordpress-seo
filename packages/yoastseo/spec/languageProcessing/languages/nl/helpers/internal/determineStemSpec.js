import determineStem from "../../../../../../src/languageProcessing/languages/nl/helpers/internal/determineStem";
import getMorphologyData from "../../../../../specHelpers/getMorphologyData";


const morphologyDataNL = getMorphologyData( "nl" ).nl;

/**
 * The first word in each array is the word, the second one is the expected stem. The numbers/letters assigned to the specs
 * refer to the numbers assigned to the different paths in the flowcharts
 *  (https://drive.google.com/drive/u/0/folders/1O5pOnRBCpZnTFAUlrNB3ViiqY3Voj9L3) that the spec covers.
 */
const wordsToStem = [
	// A word that exists on the list of words that should not be stemmed and that is a strong verb (3-11 condition in flowchart).
	[ "smolt", "smelt" ],
	// Words that are on the verb sub-list of words that should not be stemmed (3-12)
	[ "hoest", "hoest" ],
	[ "aanplant", "aanplant" ],
	[ "verpest", "verpest" ],
	// Words that are on the ending match sub-list of words that should not be stemmed (3-12)
	[ "economist", "economist" ],
	[ "antifascist", "antifascist" ],
	[ "koffer", "koffer" ],
	// Words that are on the exact match sub-list of words that should not be stemmed (3-12)
	[ "loft", "loft" ],
	[ "rijst", "rijst" ],
	// Words that are on the list of words with full forms (1-12)
	// Words that are on the verb sub-list of full forms exception list (1-12)
	[ "aanbevelen", "aanbeveel" ],
	[ "krijsend", "krijs" ],
	// Words that are on the exact match sub-list of full forms exception list (1-13)
	[ "bijdehandst", "bijdehand" ],
	// Words that are on the exact match sub-list of full forms exception list (1-12)
	[ "blaséëre", "blasé" ],
	// Words that are on the ending match sub-list of full forms exception list (1-12)
	[ "hoekschoppen", "hoekschop" ],
	[ "raderen", "rad" ],
	[ "grofs", "grof" ],
	[ "cafeetje", "café" ],
	// Words that are on the list of nonParticiples (are matched with participle regex but are not actually participles) (2a-15).
	[ "gevelwand", "gevelwand" ],
	[ "beurt", "beurt" ],
	// A word on the list of inseparable compound verbs that should not be stemmed (2b)
	[ "onderricht", "onderricht" ],
	// A participle without separable or inseparable prefixes that should not have the ge- stemmed (2c)
	[ "gebeurd", "gebeur" ],
	// A word on the list of inseparable compound verbs (2d)
	[ "onderverhuurd", "onderverhuur" ],
	// A participle of a strong verb without separable or inseparable prefixes which should have the suffix removed (2e-11)
	[ "gevraagd", "vraag" ],
	[ "gejaagd", "jaag" ],
	// A participle of a regular verb without separable or inseparable prefixes which should have the suffix removed (2e-12)
	[ "gewandeld", "wandel" ],
	[ "gezwikt", "zwik" ],
	[ "geankerd", "anker" ],
	// A participle of a strong verb without separable or inseparable prefixes which should not have the suffix removed (2f-11)
	[ "gebracht", "breng" ],
	// A participle of a regular verb without separable or inseparable prefixes which should not have the suffix removed (2f-15)
	[ "gesport", "sport" ],
	[ "getocht", "tocht" ],
	[ "gekorst", "korst" ],
	// A participle of a strong verb with a separable prefix which should have the suffix removed. (2h-11)
	[ "afgescheerd", "afscheer" ],
	// A participle of a regular verb with a separable prefix which should have the suffix removed (2h-12).
	[ "aangegroeid", "aangroei" ],
	[ "opgesmukt", "opsmuk" ],
	[ "aangebakt", "aanbak" ],
	// A participle of a strong verb with a separable prefix which should not have the suffix removed. (2i-11)
	[ "aangebracht", "aanbreng" ],
	// A participle of a regular verb with a separable prefix which should not have the suffix removed. (2i-15)
	[ "afgerond", "afrond" ],
	[ "uitgerust", "uitrust" ],
	[ "aangelicht", "aanlicht" ],
	// A participle of a strong verb with an inseparable prefix which should have the suffix removed. (2k-11)
	[ "verzind", "verzin" ],
	// A participle of a regular verb with an inseparable prefix which should have the suffix removed. (2k-12)
	[ "verlakt", "verlak" ],
	[ "onderdrukt", "onderdruk" ],
	[ "herhaald", "herhaal" ],
	// A participle of a strong verb with an inseparable prefix which should not have the suffix removed. (2l-11)
	[ "onderbracht", "onderbreng" ],
	// A participle of a regular verb with an inseparable prefix which should not have the suffix removed. (2l-15)
	[ "vertroost", "vertroost" ],
	[ "beantwoord", "beantwoord" ],
	[ "verlicht", "verlicht" ],
	// A verb ending in -t that is on the list of verbs that should have the -t stemmed (4a-12)
	[ "scratcht", "scratch" ],
	[ "vrijt", "vrij" ],
	[ "groeit", "groei" ],
	// A noun matched with a regex for when -t should not be stemmed, that is on the list of nouns with multiple stems (4b-10)
	[ "vaat", "vat" ],
	[ "loot", "lot" ],
	// A strong verb matched with a regex for when -t should not be stemmed (4b-11)
	[ "kweet", "kwijt" ],
	// A word matched with a regex for when -t should not be stemmed (4b-13)
	[ "astronaut", "astronaut" ],
	[ "nacht", "nacht" ],
	[ "favoriet", "favoriet" ],
	// A strong verb ending in -tte/tten/dde/dden (4c-11)
	[ "zoutten", "zout" ],
	[ "barstten", "barst" ],
	[ "ziedden", "zied" ],
	// A word ending in -tte/tten/dde/dden (4c-13)
	[ "katten", "kat" ],
	[ "grondden", "grond" ],
	[ "splitten", "split" ],
	// Word that ends in -heid/-heden
	[ "snelheid", "snelheid" ],
	[ "snelheden", "snelheid" ],
	[ "gezonheid", "gezonheid" ],
	[ "gezonheden", "gezonheid" ],
	/*
	 * Word that ends in -den with -d being part of the stem which is in the verb sub-list of wordsStemOnlyEnEnding list
	 * and the stem is in verb exception list (4e-11).
	 */
	[ "belijden", "belijd" ],
	// Word that ends in -den with -d being part of the stem and the stem ends in t/d (4e-13)
	[ "onthoofden", "onthoofd" ],
	/*
	 * Word that ends in -den with -d being part of the stem  which is in the ending match sub-list of wordsStemOnlyEnEnding list
	 * and undergoes vowel doubling after suffix deletion and the stem ends in t/d (4d-13)
	 */
	[ "potloden", "potlood" ],
	// Past-tense forms of verbs ending in fden/sden
	[ "aanblaasden", "aanblaas" ],
	[ "aandurfden", "aandurf" ],
	/*
	 * Word that ends in -de with -d being part of the stem and undergoes vowel doubling after suffix deletion
	 * and the stem ends in t/d (4f-13)
	 */
	[ "mode", "mood" ],
	/*
	 * Word that ends in -te/-ten with -t being part of the stem and undergoes vowel doubling after suffix deletion
	 * and the stem ends in t/d (4h-13)
	 */
	[ "blaten", "blaat" ],
	/*
	 * Word that ends in -te/-ten with -t being part of the stem and undergoes vowel doubling after suffix deletion
	 * and the stem is in verb exception list (4h-11)
	 */
	[ "stoten", "stoot" ],
	// Word that ends in -te/-ten with -t being part of the stem and the stem is in verb exception list (4i-11)
	[ "zouten", "zout" ],
	// Word that ends in -te/-ten with -t being part of the stem and the stem ends in t/d (4i-13)
	[ "taarten", "taart" ],
	// Word that is in adjective exception list and gets suffix -er/-ere and the stem ends in t/d (6-13)
	[ "harder", "hard" ],
	[ "absurdere", "absurd" ],
	// Word that gets suffix -je and is in doNotStemTOrD list (7-13)
	[ "ingrediëntje", "ingrediënt" ],
	// Word that gets suffix -tje/-etje and is in removeSuffixFromFullForms list and the stem does not end in -t/-d (7-12)
	[ "taxietje", "taxi" ],
	[ "watertaxietje", "watertaxi" ],
	// Word that gets suffix -etje and the stem is in the exception list with two stems.
	[ "garagetje", "garaag" ],
	[ "parkeergaragetje", "parkeergaraag" ],
	// Noun that is in the ending match stemJeAndOnePrecedingVowel list and the stem does not end in -t/-d (8-12)
	[ "dramaatje", "drama" ],
	[ "cameraatje", "camera" ],
	[ "filmcameraatje", "filmcamera" ],
	// Noun that is in the exact match stemJeAndOnePrecedingVowel list and the stem does not end in -t/-d (8-12)
	[ "omaatje", "oma" ],
	[ "lamaatje", "lama" ],
	// Verb that gets suffix -ten and is in verb exception list (9b-11)
	[ "lachten", "lach" ],
	[ "bakten", "bak" ],
	// Verb with a separable prefix that gets suffix -ten and is in verb exception list (9b-11)
	[ "afbakten", "afbak" ],
	// Verb with an inseparable prefix that gets suffix -ten and is in verb exception list (9b-11)
	[ "belachten", "belach" ],
	// Verb that gets suffix -ten and is neither in an exception list nor ends in t/d (9b-12)
	[ "etsten", "ets" ],
	// Word that gets suffix -en and undergoes stem modification after suffix deletion and is in noun exception list (9co-10)
	[ "bruggen", "brug" ],
	// Word that gets suffix -en and is in verb exception list (9c-11)
	[ "duiken", "duik" ],
	[ "ontduiken", "ontduik" ],
	[ "opduiken", "opduik" ],
	// Word that gets suffix -en and undergoes stem modification after suffix deletion and is in verb exception list (9co-11)
	[ "klimmen", "klim" ],
	[ "afklimmen", "afklim" ],
	[ "beklimmen", "beklim" ],
	// Word that gets suffix -en and is in getVowelDoubling list and does not end in t/d (9di-12)
	[ "nivelleren", "nivelleer" ],
	[ "verafgoden", "verafgood" ],
	// Word that gets suffix -en and is in noVowelOrConsonantDoubling list and is in noun exception list (9dii-10)
	[ "vaten", "vat" ],
	// Word that gets suffix -en and is in noVowelOrConsonantDoubling list and is in verb exception list (9dii-11)
	[ "traden", "treed" ],
	// Word that gets suffix -en and does not end in t/d (9c-12)
	[ "werken", "werk" ],
	// Word that gets suffix -en and does not end in t/d (9diii-12)
	[ "luttelen", "luttel" ],
	// Word that gets suffix -en and the stem ends in -t/-d (9c-15)
	[ "duiden", "duid" ],
	// Change -ied/-ïed to -id after suffix -st/-ste deletion and the stem ends in -t/-d (9e-15)
	[ "rigiedst", "rigid" ],
	[ "paranoïedste", "paranoïd" ],
	// Word that gets suffix -t and is in an verb exception list (9f-11)
	[ "sterft", "sterf" ],
	[ "afsterft", "afsterf" ],
	[ "versterft", "versterf" ],
	[ "bindt", "bind" ],
	/*
	 * Word that gets suffix -ën and also gets its last -e deleted after suffix deletion
	 * and is neither in an exception list nor ends in t/d (9fm-12)
	 */
	[ "melodieën", "melodie" ],
	// Word that gets suffix -der and is neither in an exception list nor ends in t/d (9f-12)
	[ "lekkerder", "lekker" ],
	// Word that gets suffix -je and is in an noun exception list (9g-10)
	[ "glaasje", "glas" ],
	[ "biggetje", "big" ],
	// Word that gets suffix -je and the stem ends in -t/-d (9g-15)
	[ "plaatje", "plaat" ],
	// Word that gets suffix -pje and is neither in an exception list nor ends in t/d (9g-12)
	[ "museumpje", "museum" ],
	// Word that gets suffix -kje and is neither in an exception list nor ends in t/d (9h-12)
	[ "kettinkje", "ketting" ],
	[ "woninkje", "woning" ],
	// Word that gets suffix -end/-ende and is neither in an exception list nor ends in t/d (9i-12)
	[ "werkend", "werk" ],
	/*
	 * Word that gets suffix -end/-ende and gets stem modification after suffix deletion
	 * and is neither in an exception list nor ends in t/d (9io-12)
	 */
	[ "rennende", "ren" ],
	// Word that gets suffix -end/-ende and is in an verb exception list (9i-11)
	[ "smeltend", "smelt" ],
	[ "afsmeltend", "afsmelt" ],
	[ "helpende", "help" ],
	// Word that gets suffix -end/-ende and gets stem modification after suffix deletion and is in an verb exception list (9j-11)
	[ "wegend", "weeg" ],
	[ "wegende", "weeg" ],
	// Past participle that starts with an inseparable prefix and ends in -end.
	[ "erkend", "erken" ],
	// Present participle that starts with an inseparable prefix and ends in -end(e).
	[ "bedelvend", "bedelf" ],
	[ "bedelvende", "bedelf" ],
	// Word that ends in -t end gets -end suffix (4h-13)
	[ "plantend", "plant" ],
	/*
	 * Word that gets suffix -end/-ende and gets stem modification after suffix deletion
	 * and is neither in an exception list nor ends in t/d (9j-12)
	 */
	[ "makende", "maak" ],
	[ "makend", "maak" ],
	// Word that gets suffix -de/-den and is in an verb exception list (9k-11)
	[ "beginde", "begin" ],
	[ "vouwden", "vouw" ],
	[ "omvouwden", "omvouw" ],
	// Word that gets suffix -de/-den and is neither in an exception list nor ends in t/d (9k-12)
	[ "waagde", "waag" ],
	[ "humde", "hum" ],
	// Word that gets suffix -e and is neither in an exception list nor ends in t/d (9m-12)
	[ "snelle", "snel" ],
	[ "mooie", "mooi" ],
	/*
	 * Word that gets suffix -e and gets stem modification after suffix deletion
	 * and is neither in an exception list nor ends in t/d (9n-12)
	 */
	[ "schone", "schoon" ],
	[ "hoge", "hoog" ],
	// Adjectives ending in -e in their base form
	[ "luxe", "luxe" ],
	[ "luxer", "luxe" ],
	/*
	 * Word that gets suffix -etje and gets stem modification after suffix deletion
	 * and is neither in an exception list nor ends in t/d (9go-12)
	 */
	[ "balletje", "bal" ],
	/*
	 * Word that gets suffix -e and gets stem modification after suffix deletion
	 * and is neither in an exception list nor ends in t/d (9mo-12)
	 */
	[ "zwakke", "zwak" ],
	// Change -iël to -ieel after suffix -er/-ers/-ere deletion and the stem is neither in an exception list nor ends in t/d (9cp-12)
	[ "partiëlere", "partieel" ],
	[ "initiëlere", "initieel" ],
	// Change -iël to -ieel after suffix -e deletion and the stem is neither in an exception list nor ends in t/d (9mp-12)
	[ "initiële", "initieel" ],
	[ "essentiële", "essentieel" ],
	/*
	 * Word that gets suffix -en and undergoes stem-ending devoicing after suffix deletion
	 * and is in an verb exception list (9cq-11)
	 */
	[ "bedelven", "bedelf" ],
	[ "vriezen", "vries" ],
	[ "ontvriezen", "ontvries" ],
	/*
	 * Word that gets suffix -en and gets stem modification after suffix deletion
	 * and is in verb exception list (9dq-11)
	 */
	[ "geblazen", "blaas" ],
	[ "afgeblazen", "afblaas" ],
	/*
	 * Word that gets suffix -en and undergoes stem-ending devoicing after suffix deletion
	 * and is neither in an exception list nor ends in t/d (9cq-12)
	 */
	[ "luizen", "luis" ],
	/*
	 * Word that gets suffix -en and gets stem modification after suffix deletion
	 * and is neither in an exception list nor ends in t/d (9dq-12)
	 */
	[ "reven", "reef" ],
	/*
	 * Word that gets suffix -end and undergoes stem-ending devoicing after suffix deletion
	 * and is in verb exception list (9iq-11)
	 */
	[ "drinkend", "drink" ],
	[ "afdrinkend", "afdrink" ],
	[ "delvend", "delf" ],
	/*
	 * Word that gets suffix -ende and gets stem modification after suffix deletion
	 * and is in an verb exception list (9jq-11)
	 */
	[ "blazende", "blaas" ],
	/*
	 * Word that gets suffix -end/-ende and undergoes stem-ending devoicing after suffix deletion
	 * and is neither in an exception list nor ends in t/d (9iq-12)
	 */
	[ "luizend", "luis" ],
	[ "grievende", "grief" ],
	/*
	 * Word that gets suffix -end/-ende and gets stem modification after suffix deletion
	 * and is neither in an exception list nor ends in t/d (9jq-12)
	 */
	[ "snevende", "sneef" ],
	[ "dovend", "doof" ],
	/*
 	 * Word that gets suffix -e and undergoes stem-ending devoicing after suffix deletion
	 * and is neither in an exception list nor ends in t/d (9mq-12)
 	*/
	[ "vieze", "vies" ],
	// Word that gets suffix -e and gets stem modification after suffix deletion and is neither in an exception list nor ends in t/d (9nq-12)
	[ "daze", "daas" ],
	// Word with plural diminutive suffix and the stem is neither in any exception list nor ends in t/d (9fg-12)
	[ "toetertjes", "toeter" ],
	// Word with plural diminutive suffix and the stem is neither in any exception list nor ends in t/d (9fh-12)
	[ "kettinkjes", "ketting" ],
	// Word with plural diminutive suffix and the stem is in noun exception list (9fg-10)
	[ "poppetjes", "pop" ],
	// Word with plural diminutive suffix and the stem ends in -t (9fg-15)
	[ "momentjes", "moment" ],
	[ "piraatjes", "piraat" ],
	[ "hondjes", "hond" ],
	// Noun that looks like a participle
	[ "gebied", "gebied" ],
	[ "gebieden", "gebied" ],
	[ "gezondheidsrecht", "gezondheidsrecht" ],
	[ "gezondheidsrechten", "gezondheidsrecht" ],
	/*
	 * Word with plural diminutive suffix -etjes whith is preceded by -e-, the -e- will be further stemmed
	 * and the final stem does not end in t/d (9fgn-12).
	 */
	[ "chimpanseetjes", "chimpans" ],
	/*
	 * Word with diminutive suffix -etje which is preceded by -e-, the -e- will be further stemmed
	 * and the final stem does not end in t/d (9gn-12).
	 */
	[ "chimpanseetje", "chimpans" ],
	// Word with diminutive suffix that ends in -etje
	[ "typetje", "typ" ],
	// Words in -eau that get -s in plural
	[ "niveaus", "niveau" ],
	[ "niveau", "niveau" ],
	// Words in -é that get -s in plural and -tje/-tjes in diminutive forms
	[ "maté", "maté" ],
	[ "matés", "maté" ],
	[ "souffleetje", "soufflé" ],
	[ "plisseetje", "plissé" ],
	// Words in -ou that get -s in plural
	[ "bijou", "bijou" ],
	[ "bijous", "bijou" ],
	// Plurals in -es where only -s should be stemmed
	[ "ordonnanties", "ordonnantie" ],
	// Other specs:
	// Return the unique stem from noun exception list with multiple stems
	[ "loot", "lot" ],
	[ "bigget", "big" ],
	[ "krab", "krab" ],
	// Return the unique stem from verb exception list
	[ "doorliep", "doorloop" ],
	[ "begin", "begin" ],
	[ "berg", "berg" ],
	[ "zeek", "zeik" ],
	// Return the unique stem from word that end in -t/-d
	[ "roeit", "roei" ],
	[ "effect", "effect" ],
	[ "katten", "kat" ],
	[ "ontbieden", "ontbied" ],
	[ "potloden", "potlood" ],
	[ "beenharde", "beenhard" ],
	[ "mode", "mood" ],
	[ "compote", "compoot" ],
	[ "taarten", "taart" ],
	// Vowel doubling checks:
	// Is on ending match sub-list of no vowel doubling list
	[ "hagelslagen", "hagelslag" ],
	// Is on exact match sub-list of no vowel doubling list
	[ "flexibeler", "flexibel" ],
	// Is on verb match sub-list of no vowel doubling list
	[ "ademen", "adem" ],
	[ "uitademen", "uitadem" ],
	[ "verademen", "veradem" ],

	// Words that should not be stemmed (not matched in any stemming steps):
	[ "verantwoordelijk", "verantwoordelijk" ],
	[ "aangenaam", "aangenaam" ],
	[ "gelukkig", "gelukkig" ],
	[ "aardbei", "aardbei" ],
	// A noun ending in -e which gets diminutive suffix -tje/-tjes.
	[ "aspergetje", "asperg" ],
	[ "aspergetjes", "asperg" ],
	// A word ending in -e
	[ "asperge", "asperg" ],
	/*
	 * A noun with diminutive suffix -tje in which undergoes vowel doubling before adding the suffix -tje/-tjes
	 * and the stem is in the exception list with two stems (9-11)
	 */
	[ "dynamootje", "dynamo" ],
	[ "dynamootjes", "dynamo" ],
	[ "dramaatje", "drama" ],
	[ "cameraatje", "camera" ],
	[ "studentjes", "student" ],
	// Words that are in the list of doNotStemTOrD in which the t/d is part of the stem and should not be stemmed.
	[ "abonnement", "abonnement" ],
	[ "communicatiedienst", "communicatiedienst" ],
	[ "botermarkt", "botermarkt" ],
	[ "rijafstand", "rijafstand" ],
	// Nouns ending in -e and are in the list of exception with two stems
	[ "etiologieën", "etiologie" ],
	[ "etiologietjes", "etiologie" ],
	[ "verjaardagscadeautje", "verjaardagscadeau" ],
	// Nouns ending in -e that get suffix -s, -es will be stemmed and apply stem modification after suffix deletion
	[ "gazelles", "gazel" ],
	[ "hoeves", "hoef" ],
	[ "finales", "finaal" ],
	// Adjectives ending in -er which get adjective suffixes and is in exception list removeSuffixesFromFullForms
	[ "bittere", "bitter" ],
	[ "lekkers", "lekker" ],
	[ "lekkerdere", "lekker" ],
	[ "lekkere", "lekker" ],
	// Adjectives ending in -st which get adjective suffixes and is in exception list removeSuffixesFromFullForms
	[ "beheerstste", "beheerst" ],
	[ "geruste", "gerust" ],
	// Adjectives ending in -s which get superlative suffix -t/-te and is in exception list
	[ "precieste", "precies" ],
	[ "preciest", "precies" ],
	[ "trotste", "trots" ],
	// Plural nouns ending in -ors which should have -or stemmed
	[ "alligators", "alligator" ],
	[ "tenors", "tenor" ],
	// A word that can be both a noun and a verb, which gets stemmed as a noun (to 'bad', not 'bid')
	[ "baden", "bad" ],
];

describe( "Test for determining unique stem for Dutch words", () => {
	it( "stems Dutch words", () => {
		wordsToStem.forEach( wordToStem => expect( determineStem( wordToStem[ 0 ], morphologyDataNL ) ).toBe( wordToStem[ 1 ] ) );
	} );
} );
