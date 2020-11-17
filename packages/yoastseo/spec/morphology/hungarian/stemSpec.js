import stem from "../../../src/morphology/hungarian/stem";
import getMorphologyData from "../../specHelpers/getMorphologyData";
const morphologyDataHU = getMorphologyData( "hu" ).hu;
const wordsToStem = [
	// Input a word with one of the following suffixes: al, el
	[ "abrosszal", "abrosz" ],
	/*
	* Input a word with one of the following suffixes: ban   ben   ba   be   ra   re   nak   nek   val   vel   tól   tõl
	* ról   rõl   ból   bõl   hoz   hez   höz   nál   nél   ig   at   et   ot   öt   ért   képp   képpen   kor   ul   ül
	* vá   vé   onként   enként   anként   ként   en   on   an   ön   n   t
	*/
	[ "adományozásban", "adományozás" ],
	[ "adásvételben", "adásvétel" ],
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
	[ "játékbarlangot", "játékbarlang" ],
	[ "jövőért", "jövő" ],
	[ "kellőképpen", "kellő" ],
	[ "kilogrammonként", "kilogram" ],
	[ "kompenzációként,", "kompenzáció" ],
	[ "konzolon", "konzol" ],
	[ "konzolt", "konzol" ],
	// Input a word with one of the following suffixes: án   ánként én
	[ "apránként", "apr" ],
	[ "bekezdésén", "bekezdés" ],
	// Input a word with one of the following suffixes: astul   estül   stul   stül
	[ "kamatostul", "kamatost" ],
	// Input a word with one of the following suffixes:   ástul éstül
	// Input a word with one of the following suffixes: á   é
	[ "költséghatékonnyá", "költséghatékony" ],
	[ "lefelé", "lefel" ],
	// Input a word with one of the following suffixes: oké   öké   aké   eké   ké   éi   é
	[ "másoké", "más" ],
	[ "appleteké", "applet" ],
	[ "magyarázatként", "magyarázat" ],
	[ "megszegné", "megszegn" ],
	// Input a word with one of the following suffixes: ünk   unk   nk   juk   jük   uk   ük   em   om   am   m   od
	// Ed ad   öd   d   ja   je   a   e o
	[ "megszüntethetünk", "megszüntethet" ],
	[ "megvetettünk", "megvetett" ],
	// Input a word with one of the following suffixes: ánk ájuk ám ád á énk éjük ém éd é
	[ "munkájuk", "munka" ],
	[ "akarnád", "akarna" ],
	[ "barátosném", "barátosne" ],
	[ "képzelné", "képzeln" ],
	// Input a word with one of the following suffixes: jaim   jeim   aim   eim   im   jaid   jeid   aid   eid id   jai
	// Jei   ai   ei   i   jaink   jeink   eink   aink   ink   jaitok   jeitek   aitok   eitek   itek   jeik jaik   aik
	// Eik   ik
	[ "mindennapjaim", "mindennap" ],
	[ "nagyszüleim", "nagyszül" ],
	[ "napjai", "nap" ],
	[ "percei", "perc" ],
	// Input a word with one of the following suffixes: áim   áid   ái   áink   áitok   áik éim   éid     éi   éink   éitek   éik
	// Input a word with one of the following suffixes: ák ék
	// Input a word with one of the following suffixes: ök ok ek ak k
];

describe( "Test for stemming Hungarian words", () => {
	it( "stems Hungarian words", () => {
		wordsToStem.forEach( wordToStem => expect( stem( wordToStem[ 0 ], morphologyDataHU ) ).toBe( wordToStem[ 1 ] ) );
	} );
} );


