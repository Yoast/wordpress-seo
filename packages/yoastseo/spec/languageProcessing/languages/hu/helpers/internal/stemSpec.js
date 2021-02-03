import stem from "../../../../../../src/languageProcessing/languages/hu/helpers/internal/stem";
import getMorphologyData from "../../../../../specHelpers/getMorphologyData";

const morphologyDataHU = getMorphologyData( "hu" ).hu;

const wordsToStem = [
	// A word with a digraph
	[ "ölyü", "ölyü" ],
	// Input a word with one of the following suffixes: al, el
	[ "kenőccsel", "kenőcs" ],
	[ "abrosszal", "abrosz" ],
	[ "tejjel", "tej" ],
	/*
	* Input a word with one of the following suffixes: ban   ben   ba   be   ra   re   nak   nek   val   vel   tól   tõl ról   rõl   ból   bõl   hoz
	* hez   höz   nál   nél   ig   at   et   ot   öt   ért   képp   képpen   kor  vá   vé   onként   enként   anként   ként   en   on   an   ön   n
	* t
	*/
	[ "adományozásban", "adományozás" ],
	[ "adásvételben", "adásvétel" ],
	[ "adatcsomagokba", "adatcsomag" ],
	[ "adásba", "adás" ],
	[ "alaphelyzetbe", "alaphelyzet" ],
	[ "alapokra", "alap" ],
	[ "alkotóelemekre", "alkotóelem" ],
	[ "ballagnak", "ballag" ],
	[ "barátnőinek", "barátnő" ],
	[ "battyuval", "battyu" ],
	[ "bortól", "bor" ],
	[ "bothoz", "bot" ],
	[ "brókercégnél", "brókercég" ],
	[ "buszig", "busz" ],
	[ "jövőért", "jövő" ],
	[ "kellőképpen", "kellő" ],
	[ "kilogrammonként", "kilogram" ],
	[ "konzolon", "konzol" ],
	[ "konzolt", "konzol" ],
	[ "játékbarlangot", "játékbarlang" ],
	[ "alaszkában", "alasz" ],
	// Input a word with one of the following suffixes: án   ánként én
	[ "apránként", "apr" ],
	[ "bekezdésén", "bekezdés" ],
	[ "amelyekről", "amely" ],
	// Input a word with one of the following suffixes: astul   estül   stul   stül ul ül
	[ "kamatostul", "kamat" ],
	[ "lefelé", "lefel" ],
	// Input a word with one of the following suffixes: oké   öké   aké   eké   ké   éi   é
	[ "másoké", "más" ],
	[ "appleteké", "applet" ],
	[ "magyarázatként", "magyarázat" ],
	[ "megszegné", "megszegn" ],
	[ "annáéké", "annáe" ],
	// Input a word with one of the following suffixes: ünk   unk   nk   juk   jük   uk   ük   em   om   am   m   od
	// Ed ad   öd   d   ja   je   a   e o
	[ "megszüntethetünk", "megszüntethet" ],
	[ "megvetettünk", "megvetett" ],
	// Input a word with one of the following suffixes: ánk ájuk ám ád á énk éjük ém éd é
	[ "munkájuk", "munka" ],
	[ "akarnád", "akarna" ],
	[ "barátosném", "barátosne" ],
	[ "képzelné", "képzeln" ],
	[ "közzé", "köz" ],
	// Input a word with one of the following suffixes: jaim   jeim   aim   eim   im   jaid   jeid   aid   eid id   jai
	// Jei   ai   ei   i   jaink   jeink   eink   aink   ink   jaitok   jeitek   aitok   eitek   itek   jeik jaik   aik
	// Eik   ik
	[ "mindennapjaim", "mindennap" ],
	[ "nagyszüleim", "nagyszül" ],
	[ "napjai", "nap" ],
	[ "percei", "perc" ],
	// Input a word with one of the following suffixes: áim   áid   ái   áink   áitok   áik éim   éid     éi   éink   éitek   éik
	[ "atyáitok", "atya" ],
	[ "királynéi", "királyn" ],
	// Input a word with one of the following suffixes: ák ék
	[ "adalék", "adale" ],
	[ "adaptálják", "adaptálja" ],
	//
	// Input a word with one of the following suffixes: ök ok ek ak k

	// Words that currently are not stemmed correctly
	// [ "fazekastul", "fazek" ],
	// Input a word with one of the following suffixes:   ástul éstül
	[ "mindenéstül", "minden" ],
	[ "mindenástül", "minden" ],
	// [ "gyerekestül", "gyereke" ],
	// Words that currently are not stemmed at all
	// [ "kompenzációként,", "kompenzáció" ],
	// Input a word with one of the following suffixes: á   é
	// [ "költséghatékonnyá", "költséghatékony" ],
	// A word shorter than 3 characters
	[ "bá", "bá" ],
];

describe( "Test for stemming Hungarian words", () => {
	it( "stems Hungarian words", () => {
		wordsToStem.forEach( wordToStem => expect( stem( wordToStem[ 0 ], morphologyDataHU ) ).toBe( wordToStem[ 1 ] ) );
	} );
} );
