import Researcher from "../../../../src/languageProcessing/languages/de/Researcher.js";
import Paper from "../../../../src/values/Paper.js";
import getMorphologyData from "../../../specHelpers/getMorphologyData";
const morphologyDataDE = getMorphologyData( "de" );

describe( "a test for the German Researcher", function() {
	const researcher = new Researcher( new Paper( "" ) );

	it( "returns true if the inherited Abstract Researcher has a specific research", function() {
		expect( researcher.hasResearch( "getParagraphLength" ) ).toBe( true );
	} );

	it( "returns true if the German Researcher has a specific research", function() {
		expect( researcher.hasResearch( "getPassiveVoice" ) ).toBe( true );
	} );

	it( "returns the German function words that are filtered at the beginning and end", function() {
		expect( researcher.getConfig( "functionWords" )().filteredAtBeginningAndEnding ).toEqual(
			[ "das", "dem", "den", "der", "des", "die", "ein", "eine", "einem", "einen", "einer", "eines",
				"a", "à", "ab", "abseits", "abzüglich", "abzueglich", "als", "am", "an", "angelegentlich",
				"angesichts", "anhand", "anlässlich", "anlaesslich", "ans", "anstatt", "anstelle", "auf", "aufs", "aufseiten",
				"aus", "ausgangs", "ausschließlich", "ausschliesslich", "außerhalb", "ausserhalb", "ausweislich",
				"bar", "behufs", "bei", "beidseits", "beiderseits", "beim", "betreffs", "bezüglich", "bezueglich", "binnen", "bis", "contra",
				"dank", "diesseits", "durch", "einbezüglich", "einbezueglich", "eingangs", "eingedenk", "einschließlich", "einschliesslich",
				"entgegen", "entlang", "exklusive", "fern", "fernab", "fuer", "für", "fuers", "fürs", "gegen", "gegenüber",
				"gegenueber", "gelegentlich", "gemäß", "gemaeß", "gen", "getreu", "gleich", "halber", "hinsichtlich", "hinter", "hinterm", "hinters",
				"im", "in", "inklusive", "inmitten", "innerhalb", "innert", "ins", "je", "jenseits", "kontra", "kraft",
				"längs", "laengs", "längsseits", "laengsseits", "laut", "links", "mangels", "minus", "mit", "mithilfe", "mitsamt", "mittels",
				"nach", "nächst", "naechst", "nah", "namens", "neben", "nebst", "nördlich", "noerdlich", "nordöstlich", "nordoestlich",
				"nordwestlich", "oberhalb", "ohne", "östlich", "oestlich", "per", "plus", "pro", "quer", "rechts", "rücksichtlich",
				"ruecksichtlich", "samt", "seitens", "seitlich", "seitwärts", "seitwaerts", "südlich", "suedlich", "südöstlich",
				"suedoestlich", "südwestlich", "suedwestlich", "über", "ueber", "überm", "ueberm", "übern", "uebern", "übers",
				"uebers", "um", "ums", "unbeschadet", "unerachtet", "unfern", "unter", "unterhalb", "unterm", "untern", "unters",
				"unweit", "vermittels", "vermittelst", "vermöge", "vermoege", "via", "vom", "von", "vonseiten", "vor", "vorbehaltlich",
				"wegen", "wider", "zeit", "zu", "zugunsten", "zulieb", "zuliebe", "zum", "zur", "zusätzlich", "zusaetzlich", "zuungunsten",
				"zuwider", "zuzüglich", "zuzueglich", "zwecks", "zwischen", "und", "oder", "umso", "denen", "deren", "derer", "dessen",
				"diese", "diesem", "diesen", "dieser", "dieses", "jene", "jenem", "jenen", "jener", "jenes", "welch", "welcher",
				"welches", "derjenige", "desjenigen", "demjenigen", "denjenigen", "diejenige", "derjenigen", "dasjenige", "diejenigen",
				"sehr", "recht", "überaus", "ueberaus", "ungemein", "weitaus", "einigermaßen", "einigermassen", "ganz",
				"schwer", "tierisch", "ungleich", "ziemlich", "übelst", "uebelst", "stark", "volkommen", "durchaus", "gar",
				"manche", "manch", "viele", "viel", "vieler", "vielen", "vielem", "all", "alle", "aller", "alles",
				"allen", "allem", "allerlei", "solcherlei", "einige", "etliche", "wenige", "weniger", "wenigen", "wenigem", "weniges",
				"wenig", "wenigerer", "wenigeren", "wenigerem", "wenigere", "wenigeres", "wenig", "bisschen", "paar", "kein", "keines",
				"keinem", "keinen", "keine", "mehr", "genug", "mehrere", "mehrerer", "mehreren", "mehrerem", "mehreres", "verschiedene",
				"verschiedener", "verschiedenen", "verschiedenem", "verschiedenes", "verschiedne", "verschiedner", "verschiednen",
				"verschiednem", "verschiednes", "art", "arten", "sorte", "sorten",
			] );
	} );

	it( "returns the German first word exceptions", function() {
		expect( researcher.getConfig( "firstWordExceptions" )() ).toEqual(
			[ "das", "dem", "den", "der", "des", "die", "ein", "eine", "einem", "einen", "einer", "eines",
				"eins", "zwei", "drei", "vier", "fünf", "sechs", "sieben", "acht", "neun", "zehn",
				"denen", "deren", "derer", "dessen", "diese", "diesem", "diesen", "dieser", "dieses", "jene",
				"jenem", "jenen", "jener", "jenes", "welch", "welcher", "welches" ]
		);
	} );

	it( "returns the German transition words", function() {
		expect( researcher.getConfig( "transitionWords" )().allWords ).toEqual(
			[ "aber", "abschließend", "abschliessend", "alldieweil", "allerdings", "also", "anderenteils", "andererseits", "andernteils",
				"anfaenglich", "anfänglich", "anfangs", "angenommen", "anschliessend", "anschließend",	"aufgrund",	"ausgenommen",
				"ausserdem", "außerdem", "beispielsweise", "bevor", "beziehungsweise", "bspw", "bzw", "d.h", "da", "dabei", "dadurch",
				"dafuer", "dafür", "dagegen", "daher", "dahingegen", "danach", "dann", "darauf", "darum", "dass", "davor", "dazu",
				"dementgegen", "dementsprechend", "demgegenüber", "demgegenueber", "demgemaess", "demgemäß", "demzufolge", "denn",
				"dennoch", "dergestalt", "derweil", "desto", "deshalb", "desungeachtet", "deswegen", "doch", "dort", "drittens",
				"ebenfalls", "ebenso", "endlich", "ehe", "einerseits", "einesteils", "entsprechend", "entweder", "erst", "erstens",
				"falls", "ferner", "folgerichtig", "folglich", "fürderhin", "fuerderhin", "genauso", "hierdurch", "hierzu", "hingegen",
				"immerhin", "indem", "indes", "indessen", "infolge",	"infolgedessen", "insofern", "insoweit", "inzwischen", "jedenfalls",
				"jedoch", "kurzum", "m.a.w", "mitnichten", "mitunter", "möglicherweise", "moeglicherweise", "nachdem", "nebenher", "nichtsdestotrotz",
				"nichtsdestoweniger", "ob", "obenrein", "obgleich", "obschon", "obwohl", "obzwar", "ohnehin", "richtigerweise",
				"schliesslich", "schließlich", "seit", "seitdem", "sobald", "sodass", "so dass", "sofern", "sogar", "solang", "solange", "somit",
				"sondern", "sooft", "soviel", "soweit", "sowie", "sowohl", "statt", "stattdessen", "trotz",	"trotzdem", "überdies", "übrigens",
				"ueberdies", "uebrigens", "ungeachtet", "vielmehr", "vorausgesetzt", "vorher", "waehrend", "während", "währenddessen",
				"waehrenddessen", "weder", "wegen", "weil", "weiter", "weiterhin", "wenn", "wenngleich", "wennschon", "wennzwar", "weshalb",
				"widrigenfalls", "wiewohl", "wobei", "wohingegen", "z.b", "zudem", "zuerst", "zufolge", "zuletzt", "zumal", "zuvor", "zwar",
				"zweitens", "abgesehen von", "abgesehen davon", "als dass", "als ob", "als wenn", "anders ausgedrückt", "anders ausgedrueckt",
				"anders formuliert", "anders gefasst", "anders gefragt", "anders gesagt", "anders gesprochen", "anstatt dass", "auch wenn",
				"auf grund", "auf jeden fall", "aus diesem grund", "ausser dass", "außer dass", "ausser wenn", "außer wenn", "besser ausgedrückt",
				"besser ausgedrueckt", "besser formuliert", "besser gesagt", "besser gesprochen", "bloss dass", "bloß dass", "darüber hinaus",
				"das heisst", "das heißt", "des weiteren", "dessen ungeachtet", "ebenso wie", "genauso wie", "geschweige denn", "im fall",
				"im falle", "im folgenden", "im gegensatz dazu", "im gegenteil", "im grunde genommen", "in diesem sinne", "je nachdem", "kurz gesagt",
				"mit anderen worten", "ohne dass", "so dass", "umso mehr als", "umso weniger als", "umso mehr, als", "umso weniger, als",
				"unbeschadet dessen", "und zwar", "ungeachtet dessen", "unter dem strich", "zum beispiel", "zunächts einmal" ]
		);
	} );

	it( "returns the German two part transition word", function() {
		expect( researcher.getConfig( "twoPartTransitionWords" )() ).toEqual(
			[ [ "anstatt", "dass" ], [ "bald", "bald" ], [ "dadurch", "dass" ], [ "dessen ungeachtet", "dass" ],
				[ "entweder", "oder" ], [ "einerseits", "andererseits" ], [ "erst", "wenn" ], [ "je", "desto" ], [ "je", "umso" ],
				[ "umso", "umso" ], [ "mal", "mal" ], [ "nicht nur", "sondern auch" ], [ "ob", "oder" ], [ "ohne", "dass" ], [ "so", "dass" ],
				[ "sowohl", "als auch" ], [ "sowohl", "wie auch" ], [ "teils", "teils" ], [ "unbeschadet dessen", "dass" ], [ "weder", "noch" ],
				[ "wenn", "auch" ], [ "wenn", "schon" ], [ "nicht weil", "sondern" ] ]
		);
	} );

	it( "returns a specified part of the German syllables data", function() {
		expect( researcher.getConfig( "syllables" ).deviations.words.fragments.atBeginning ).toEqual(
			[
				{ word: "anion", syllables: 3 },
				{ word: "facelift", syllables: 2 },
				{ word: "jiu", syllables: 1 },
				{ word: "pace", syllables: 1 },
				{ word: "shake", syllables: 1 },
				{ word: "tea", syllables: 1 },
				{ word: "trade", syllables: 1 },
				{ word: "deal", syllables: 1 },
			],
		);
	} );

	it( "returns the German locale", function() {
		expect( researcher.getConfig( "language" ) ).toEqual( "de" );
	} );

	it( "returns the German passive construction type", function() {
		expect( researcher.getConfig( "isPeriphrastic" ) ).toEqual( true );
	} );

	it( "stems a word using the German stemmer", function() {
		researcher.addResearchData( "morphology", morphologyDataDE );
		expect( researcher.getHelper( "getStemmer" )( researcher )( "Katzen" ) ).toEqual( "Katz" );
	} );

	it( "splits German sentence into parts", function() {
		const sentence =  "Zwischen 1927 und 1933 hatte sie intensiven Kontakt zur Erzabtei Beuron.";
		expect( researcher.getHelper( "getSentenceParts" )( sentence )[ 0 ].getSentencePartText() ).toBe( "Zwischen 1927" );
		expect( researcher.getHelper( "getSentenceParts" )( sentence )[ 1 ].getSentencePartText() ).toBe( "und 1933 hatte sie" +
			" intensiven Kontakt zur Erzabtei Beuron." );
	} );

	it( "checks if a German sentence is passive or not", function() {
		expect( researcher.getHelper( "isPassiveSentencePart" )( "Sie wird geliebt", [ "wird" ] ) ).toEqual( true );
		expect( researcher.getHelper( "isPassiveSentencePart" )( "Sie hat ihren Hund geliebt", [] ) ).toEqual( false );
	} );

	it( "calculates the Flesch reading score using the formula for German", function() {
		const testStatistics = {
			numberOfSentences: 10,
			numberOfWords: 50,
			numberOfSyllables: 100,
			averageWordsPerSentence: 5,
			syllablesPer100Words: 200,
		};
		expect( researcher.getHelper( "fleschReadingScore" )( testStatistics ) ).toBe( 58 );
	} );
} );
