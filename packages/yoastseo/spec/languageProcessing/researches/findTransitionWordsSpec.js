/* eslint-disable capitalized-comments */
import transitionWordsResearch from "../../../src/languageProcessing/researches/findTransitionWords.js";
import Paper from "../../../src/values/Paper.js";
import EnglishResearcher from "../../../src/languageProcessing/languages/en/Researcher";
import FrenchResearcher from "../../../src/languageProcessing/languages/fr/Researcher";
import JapaneseResearcher from "../../../src/languageProcessing/languages/ja/Researcher";

// eslint-disable-next-line max-statements
describe( "a test for finding transition words from a string", function() {
	let mockPaper, result;

	it( "returns 1 when a transition word is found in the middle of a sentence (English)", function() {
		// Transition word: above all.
		mockPaper = new Paper( "this story is, above all, about a boy", { locale: "en_US" } );
		result = transitionWordsResearch( mockPaper, new EnglishResearcher( mockPaper ) );
		expect( result.totalSentences ).toBe( 1 );
		expect( result.transitionWordSentences ).toBe( 1 );
	} );

	it( "returns 1 when a transition word with capital is found at the beginning of a sentence (English)", function() {
		// Transition word: firstly.
		mockPaper = new Paper( "Firstly, I'd like to say", { locale: "en_US" } );
		result = transitionWordsResearch( mockPaper, new EnglishResearcher( mockPaper ) );
		expect( result.totalSentences ).toBe( 1 );
		expect( result.transitionWordSentences ).toBe( 1 );
	} );

	it( "returns 1 when a transition word combination is found in the middle of a sentence (English)", function() {
		// Transition word: different from.
		mockPaper = new Paper( "that is different from something else", { locale: "en_US" } );
		result = transitionWordsResearch( mockPaper, new EnglishResearcher( mockPaper ) );
		expect( result.totalSentences ).toBe( 1 );
		expect( result.transitionWordSentences ).toBe( 1 );
	} );

	it( "returns 1 when a transition word combination is found at the end of a sentence (English)", function() {
		// Transition word: for example.
		mockPaper = new Paper( "A story, for example", { locale: "en_US" } );
		result = transitionWordsResearch( mockPaper, new EnglishResearcher( mockPaper ) );
		expect( result.totalSentences ).toBe( 1 );
		expect( result.transitionWordSentences ).toBe( 1 );
	} );

	it( "returns 1 when a two-part transition word  is found in a sentence (English)", function() {
		// Transition word: either...or.
		mockPaper = new Paper( "I will either tell you a story, or read you a novel.", { locale: "en_US" } );
		result = transitionWordsResearch( mockPaper, new EnglishResearcher( mockPaper ) );
		expect( result.totalSentences ).toBe( 1 );
		expect( result.transitionWordSentences ).toBe( 1 );
	} );

	it( "returns 1 when a two-part transition word  is found in a sentence, and no transition word in another sentence. (English)", function() {
		// Transition word: either...or.
		mockPaper = new Paper( "I will either tell you a story, or read you a novel. Okay?", { locale: "en_US" } );
		result = transitionWordsResearch( mockPaper, new EnglishResearcher( mockPaper ) );
		expect( result.totalSentences ).toBe( 2 );
		expect( result.transitionWordSentences ).toBe( 1 );
	} );

	it( "returns 2 when a two-part transition word  is found in a sentence, and a transition word in another sentence. (English)", function() {
		// Transition words: either...or, unless.
		mockPaper = new Paper( "I will either tell you a story, or read you a novel. Unless it is about a boy.", { locale: "en_US" } );
		result = transitionWordsResearch( mockPaper, new EnglishResearcher( mockPaper ) );
		expect( result.totalSentences ).toBe( 2 );
		expect( result.transitionWordSentences ).toBe( 2 );
	} );

	it( "returns 2 when a two-part transition word is found in two sentences. (English)", function() {
		// Transition words: either...or, if...then.
		mockPaper = new Paper( "I will either tell you a story, or read you a novel. If you want, then I will.", { locale: "en_US" } );
		result = transitionWordsResearch( mockPaper, new EnglishResearcher( mockPaper ) );
		expect( result.totalSentences ).toBe( 2 );
		expect( result.transitionWordSentences ).toBe( 2 );
	} );

	it( "returns 2 when a two-part transition word is found in two sentences, " +
		"and an additional transition word is found in one of them. (English)", function() {
		// Transition words: either...or, if ...then, as soon as.
		mockPaper = new Paper( "I will either tell you a story about a boy, or read you a novel. " +
			"If you want, then I will start as soon as you're ready.", { locale: "en_US" } );
		result = transitionWordsResearch( mockPaper, new EnglishResearcher( mockPaper ) );
		expect( result.totalSentences ).toBe( 2 );
		expect( result.transitionWordSentences ).toBe( 2 );
	} );

	it( "returns 1 when a transition word abbreviation found in a sentence (English)", function() {
		// Transition word: e.g..
		mockPaper = new Paper( "That is e.g. a story...", { locale: "en_US" } );
		result = transitionWordsResearch( mockPaper, new EnglishResearcher( mockPaper ) );
		expect( result.totalSentences ).toBe( 1 );
		expect( result.transitionWordSentences ).toBe( 1 );
	} );

	it( "returns 1 when 2 transition words are found in the same sentence (English)", function() {
		// Transition words: firstly, for example.
		mockPaper = new Paper( "Firstly, I'd like to tell a story, for example", { locale: "en_US" } );
		result = transitionWordsResearch( mockPaper, new EnglishResearcher( mockPaper ) );
		expect( result.totalSentences ).toBe( 1 );
		expect( result.transitionWordSentences ).toBe( 1 );
	} );

	it( "returns 2 when 2 transition words are found in two sentences (1 transition word each) (English)", function() {
		// Transition words: firstly, for example.
		mockPaper = new Paper( "Firstly, I'd like to tell a story. For example.", { locale: "en_US" } );
		result = transitionWordsResearch( mockPaper, new EnglishResearcher( mockPaper ) );
		expect( result.totalSentences ).toBe( 2 );
		expect( result.transitionWordSentences ).toBe( 2 );
	} );

	it( "returns 2 in the case of a sentence with 1 transition word and a sentence with 2 transition words) (English)", function() {
		// Transition words: firstly, for example, as I have said.
		mockPaper = new Paper( "Firstly, I'd like to tell a story. For example, about you, as I have said.", { locale: "en_US" } );
		result = transitionWordsResearch( mockPaper, new EnglishResearcher( mockPaper ) );
		expect( result.totalSentences ).toBe( 2 );
		expect( result.transitionWordSentences ).toBe( 2 );
	} );

	it( "returns 1 in the case of a sentence with 1 transition word and a sentence without transition words) (English)", function() {
		// Transition word: firstly.
		mockPaper = new Paper( "Firstly, I'd like to tell a story. Haha.", { locale: "en_US" } );
		result = transitionWordsResearch( mockPaper, new EnglishResearcher( mockPaper ) );
		expect( result.totalSentences ).toBe( 2 );
		expect( result.transitionWordSentences ).toBe( 1 );
	} );

	it( "returns 1 when a two-part transition word  is found in a sentence (English)", function() {
		// Transition word: either...or.
		mockPaper = new Paper( "I will either tell you a story, or read you a novel.", { locale: "en_US" } );
		result = transitionWordsResearch( mockPaper, new EnglishResearcher( mockPaper ) );
		expect( result.totalSentences ).toBe( 1 );
		expect( result.transitionWordSentences ).toBe( 1 );
	} );

	it( "returns 0 when no transition words are present in a sentence (English)", function() {
		mockPaper = new Paper( "nothing special", { locale: "en_US" } );
		result = transitionWordsResearch( mockPaper, new EnglishResearcher( mockPaper ) );
		expect( result.totalSentences ).toBe( 1 );
		expect( result.transitionWordSentences ).toBe( 0 );
	} );

	it( "returns 0 when no transition words are present in multiple sentences (English)", function() {
		mockPaper = new Paper( "nothing special. Nothing special Either. Boring!", { locale: "en_US" } );
		result = transitionWordsResearch( mockPaper, new EnglishResearcher( mockPaper ) );
		expect( result.totalSentences ).toBe( 3 );
		expect( result.transitionWordSentences ).toBe( 0 );
	} );

	/*it( "returns 1 when a transition word is found in a sentence (German)", function() {
		// Transition word: zuerst.
		mockPaper = new Paper( "Zuerst werde ich versuchen zu verstehen, warum er so denkt.", { locale: "de_DE" } );
		result = transitionWordsResearch( mockPaper, new GermanResearcher( mockPaper ) );
		expect( result.totalSentences ).toBe( 1 );
		expect( result.transitionWordSentences ).toBe( 1 );
	} );

	it( "returns 1 when a transition abbreviation is found in a sentence (German)", function() {
		// Transition word: z.b.
		mockPaper = new Paper( "Ich werde z.b. versuchen zu verstehen, warum er so denkt.", { locale: "de_DE" } );
		result = transitionWordsResearch( mockPaper, new GermanResearcher( mockPaper ) );
		expect( result.totalSentences ).toBe( 1 );
		expect( result.transitionWordSentences ).toBe( 1 );
	} );

	it( "returns 1 when a two-part transition word is found in a sentence (German)", function() {
		// Transition word: nicht nur...sondern.
		mockPaper = new Paper( "Man soll nicht nur in seinen Liebesbeziehungen, sondern in sämtlichen Lebensbereichen " +
			"um das Glück kämpfen.", { locale: "de_DE" } );
		result = transitionWordsResearch( mockPaper, new GermanResearcher( mockPaper ) );
		expect( result.totalSentences ).toBe( 1 );
		expect( result.transitionWordSentences ).toBe( 1 );
	} );

	it( "returns 0 when no transition words are present in a sentence (German)", function() {
		mockPaper = new Paper( "Eins, zwei, drei.", { locale: "de_DE" } );
		result = transitionWordsResearch( mockPaper, new GermanResearcher( mockPaper ) );
		expect( result.totalSentences ).toBe( 1 );
		expect( result.transitionWordSentences ).toBe( 0 );
	} );
*/
/*	it( "returns 1 when a transition word is found in a sentence (French)", function() {
		// Transition word: deuxièmement.
		mockPaper = new Paper( "Deuxièmement, il convient de reconnaître la complexité des tâches à entreprendre.", { locale: "fr_FR" } );
		result = transitionWordsResearch( mockPaper, new FrenchResearcher( mockPaper ) );
		expect( result.totalSentences ).toBe( 1 );
		expect( result.transitionWordSentences ).toBe( 1 );
	} );

	it( "returns 1 when a two-part transition word is found in a sentence (French)", function() {
		// Transition word: non seulement, mais encore.
		mockPaper = new Paper( "Non seulement on l’estime, mais encore on l’aime.", { locale: "fr_FR" } );
		result = transitionWordsResearch( mockPaper, new FrenchResearcher( mockPaper ) );
		expect( result.totalSentences ).toBe( 1 );
		expect( result.transitionWordSentences ).toBe( 1 );
	} );*/

	it( "returns 1 when a transition word with an apostrophe is found in a sentence (French)", function() {
		// Transition word: quoi qu’il en soit.
		mockPaper = new Paper( "Quoi qu’il en soit, le gouvernement du Mali a perdu sa légitimité.", { locale: "fr_FR" } );
		result = transitionWordsResearch( mockPaper, new FrenchResearcher( mockPaper ) );
		expect( result.totalSentences ).toBe( 1 );
		expect( result.transitionWordSentences ).toBe( 1 );
	} );

	/*it( "returns 0 when no transition words are present in a sentence (French)", function() {
		mockPaper = new Paper( "Une, deux, trois.", { locale: "fr_FR" } );
		result = transitionWordsResearch( mockPaper, new FrenchResearcher( mockPaper ) );
		expect( result.totalSentences ).toBe( 1 );
		expect( result.transitionWordSentences ).toBe( 0 );
	} );

	it( "returns 1 when a transition word is found in a sentence (Dutch)", function() {
		// Transition word: want.
		mockPaper = new Paper( "Want daar brandt nog licht.", { locale: "nl_NL" } );
		result = transitionWordsResearch( mockPaper, new DutchResearcher( mockPaper ) );
		expect( result.totalSentences ).toBe( 1 );
		expect( result.transitionWordSentences ).toBe( 1 );
	} );

	it( "returns 1 when a two-part transition word is found in a sentence (Dutch)", function() {
		// Transition word: zowel, als.
		mockPaper = new Paper( "Zowel 'deze' als 'zin' staat in deze zin.", { locale: "nl_NL" } );
		result = transitionWordsResearch( mockPaper, new DutchResearcher( mockPaper ) );
		expect( result.totalSentences ).toBe( 1 );
		expect( result.transitionWordSentences ).toBe( 1 );
	} );

	it( "returns 0 when no transition words are present in a sentence (Dutch)", function() {
		mockPaper = new Paper( "Een, twee, drie.", { locale: "nl_NL" } );
		result = transitionWordsResearch( mockPaper, new DutchResearcher( mockPaper ) );
		expect( result.totalSentences ).toBe( 1 );
		expect( result.transitionWordSentences ).toBe( 0 );
	} );

	it( "returns 1 when a transition word is found in a sentence (Spanish)", function() {
		// Transition word: por el contrario.
		mockPaper = new Paper( "Por el contrario, desea que se inicien cambios beneficiosos en Europa.", { locale: "es_ES" } );
		result = transitionWordsResearch( mockPaper, new SpanishResearcher( mockPaper ) );
		expect( result.totalSentences ).toBe( 1 );
		expect( result.transitionWordSentences ).toBe( 1 );
	} );

	it( "returns 1 when a two-part transition word is found in a sentence (Spanish)", function() {
		// Transition word: de un lado...de otra parte.
		mockPaper = new Paper( "Se trata además, de una restauración que ha pretendido de un lado ser reversible y que de " +
			"otra parte ha intentado minimizar al máximo el impacto material.", { locale: "es_ES" } );
		result = transitionWordsResearch( mockPaper, new SpanishResearcher( mockPaper ) );
		expect( result.totalSentences ).toBe( 1 );
		expect( result.transitionWordSentences ).toBe( 1 );
	} );

	it( "returns 0 when no transition words are present in a sentence (Spanish)", function() {
		mockPaper = new Paper( "Uno, dos, tres.", { locale: "es_ES" } );
		result = transitionWordsResearch( mockPaper, new SpanishResearcher( mockPaper ) );
		expect( result.totalSentences ).toBe( 1 );
		expect( result.transitionWordSentences ).toBe( 0 );
	} );

	it( "returns 1 when a transition word is found in a sentence (Italian)", function() {
		// Transition word: in conclusione.
		mockPaper = new Paper( "In conclusione, possiamo dire che il risultato è ottimo.", { locale: "it_IT" } );
		result = transitionWordsResearch( mockPaper, new ItalianResearcher( mockPaper ) );
		expect( result.totalSentences ).toBe( 1 );
		expect( result.transitionWordSentences ).toBe( 1 );
	} );

	it( "returns 1 when a two-part transition word is found in a sentence (Italian)", function() {
		// Transition word: no ... ma.
		mockPaper = new Paper( "No, non credo che sia una buona idea ma possiamo sempre verificare caso per caso.", { locale: "it_IT" } );
		result = transitionWordsResearch( mockPaper, new ItalianResearcher( mockPaper ) );
		expect( result.totalSentences ).toBe( 1 );
		expect( result.transitionWordSentences ).toBe( 1 );
	} );

	it( "returns 0 when no transition words are present in a sentence (Italian)", function() {
		mockPaper = new Paper( "Uno, due, tre.", { locale: "it_IT" } );
		result = transitionWordsResearch( mockPaper, new ItalianResearcher( mockPaper ) );
		expect( result.totalSentences ).toBe( 1 );
		expect( result.transitionWordSentences ).toBe( 0 );
	} );

	it( "returns 1 when a transition word is found in a sentence (Portuguese)", function() {
		// Transition word: por exemplo
		mockPaper = new Paper( "Por exemplo, a maioria das lojas está fechada hoje.", { locale: "pt_PT" } );
		result = transitionWordsResearch( mockPaper, new PortugueseResearcher( mockPaper ) );
		expect( result.totalSentences ).toBe( 1 );
		expect( result.transitionWordSentences ).toBe( 1 );
	} );

	it( "returns 1 when a two-part transition word is found in a sentence (Portuguese)", function() {
		// Transition word: ora...ora
		mockPaper = new Paper( "Ora a criança chora, ora a criança ri.", { locale: "pt_PT" } );
		result = transitionWordsResearch( mockPaper, new PortugueseResearcher( mockPaper ) );
		expect( result.totalSentences ).toBe( 1 );
		expect( result.transitionWordSentences ).toBe( 1 );
	} );

	it( "returns 0 when no transition words are present in a sentence (Portuguese)", function() {
		mockPaper = new Paper( "A pintura é bonita.", { locale: "pt_PT" } );
		result = transitionWordsResearch( mockPaper, new PortugueseResearcher( mockPaper ) );
		expect( result.totalSentences ).toBe( 1 );
		expect( result.transitionWordSentences ).toBe( 0 );
	} );

	it( "returns 1 when a transition word is found in a sentence (Russian)", function() {
		// Transition word: к примеру
		mockPaper = new Paper( "Мы, к примеру, всегда сразу идем домой после работы.", { locale: "ru_RU" } );
		result = transitionWordsResearch( mockPaper, new RussianResearcher( mockPaper ) );
		expect( result.totalSentences ).toBe( 1 );
		expect( result.transitionWordSentences ).toBe( 1 );
	} );

	it( "returns 1 when a two-part transition word is found in a sentence (Russian)", function() {
		// Transition word: стоило...как
		mockPaper = new Paper( "Стоило ему прийти, как она ушла.", { locale: "ru_RU" } );
		result = transitionWordsResearch( mockPaper, new RussianResearcher( mockPaper ) );
		expect( result.totalSentences ).toBe( 1 );
		expect( result.transitionWordSentences ).toBe( 1 );
	} );

	it( "returns 0 when no transition words are present in a sentence (Russian)", function() {
		mockPaper = new Paper( "Я не знаю, как пишется это слово.", { locale: "ru_RU" } );
		result = transitionWordsResearch( mockPaper, new RussianResearcher( mockPaper ) );
		expect( result.totalSentences ).toBe( 1 );
		expect( result.transitionWordSentences ).toBe( 0 );
	} );

	it( "returns 1 when a transition word is found in a sentence (Catalan)", function() {
		// Transition word: en primer lloc
		mockPaper = new Paper( "En primer lloc, permetin-me presentar-me.", { locale: "ca_ES" } );
		result = transitionWordsResearch( mockPaper, new CatalanResearcher( mockPaper ) );
		expect( result.totalSentences ).toBe( 1 );
		expect( result.transitionWordSentences ).toBe( 1 );
	} );

	it( "returns 1 when a transition word with an apostrophe is found in a sentence (Catalan)", function() {
		// Transition word: a tall d'exemple.
		mockPaper = new Paper( "A tall d'exemple, pensem en aquest gat.", { locale: "ca_ES" } );
		result = transitionWordsResearch( mockPaper, new CatalanResearcher( mockPaper ) );
		expect( result.totalSentences ).toBe( 1 );
		expect( result.transitionWordSentences ).toBe( 1 );
	} );
*/
	/*it( "returns 1 when a transition word with a punt volat (·) is found in a sentence (Catalan)", function() {
		// Transition word: per il·lustrar.
		mockPaper = new Paper( "Roma proposa un concurs de curtmetratges per il·lustrar com ha de ser la ciutat ideal", { locale: "ca_ES" } );
		result = transitionWordsResearch( mockPaper, new CatalanResearcher( mockPaper ) );
		expect( result.totalSentences ).toBe( 1 );
		expect( result.transitionWordSentences ).toBe( 1 );
	} );

	it( "returns 1 when a two-part transition word is found in a sentence (Catalan)", function() {
		// Transition word: ni...ni
		mockPaper = new Paper( "No era ni un gat ni un gos.", { locale: "ca_ES" } );
		result = transitionWordsResearch( mockPaper, new CatalanResearcher( mockPaper ) );
		expect( result.totalSentences ).toBe( 1 );
		expect( result.transitionWordSentences ).toBe( 1 );
	} );

	it( "returns 0 when no transition words are present in a sentence (Catalan)", function() {
		mockPaper = new Paper( "Anem a la platja.", { locale: "ca_ES" } );
		result = transitionWordsResearch( mockPaper, new CatalanResearcher( mockPaper ) );
		expect( result.totalSentences ).toBe( 1 );
		expect( result.transitionWordSentences ).toBe( 0 );
	} );

	it( "returns 1 when a transition word is found in a sentence (Polish)", function() {
		// Transition word: po pierwsze
		mockPaper = new Paper( "Po pierwsze, nie wszyscy potrafią czytać.", { locale: "pl_PL" } );
		result = transitionWordsResearch( mockPaper, new PolishResearcher( mockPaper ) );
		expect( result.totalSentences ).toBe( 1 );
		expect( result.transitionWordSentences ).toBe( 1 );
	} );

	it( "returns 1 when a two-part transition word is found in a sentence (Polish)", function() {
		// Transition word: im...tym
		mockPaper = new Paper( "Im mniejsze dziecko, tym więcej potrzebuje uwagi.", { locale: "pl_PL" } );
		result = transitionWordsResearch( mockPaper, new PolishResearcher( mockPaper ) );
		expect( result.totalSentences ).toBe( 1 );
		expect( result.transitionWordSentences ).toBe( 1 );
	} );

	it( "returns 0 when no transition words are present in a sentence (Polish)", function() {
		mockPaper = new Paper( "Wszyscy lubią słuchać muzyki.", { locale: "pl_PL" } );
		result = transitionWordsResearch( mockPaper, new PolishResearcher( mockPaper ) );
		expect( result.totalSentences ).toBe( 1 );
		expect( result.transitionWordSentences ).toBe( 0 );
	} );

	it( "returns 1 when a transition word is found in a sentence (Swedish)", function() {
		// Transition word: Å ena sidan
		mockPaper = new Paper( "Å ena sidan gillar jag tårta.", { locale: "sv_SE" } );
		result = transitionWordsResearch( mockPaper, new SwedishResearcher( mockPaper ) );
		expect( result.totalSentences ).toBe( 1 );
		expect( result.transitionWordSentences ).toBe( 1 );
	} );

	it( "returns 1 when a two-part transition word is found in a sentence (Swedish)", function() {
		// Transition word: antingen...eller
		mockPaper = new Paper( "Jag vill ha antingen tårta eller glass", { locale: "sv_SE" } );
		result = transitionWordsResearch( mockPaper, new SwedishResearcher( mockPaper ) );
		expect( result.totalSentences ).toBe( 1 );
		expect( result.transitionWordSentences ).toBe( 1 );
	} );
	it( "returns 0 when no transition words are present in a sentence (Swedish)", function() {
		mockPaper = new Paper( "Föräldrarna behöver inte betala..", { locale: "sv_SE" } );
		result = transitionWordsResearch( mockPaper, new SwedishResearcher( mockPaper ) );
		expect( result.totalSentences ).toBe( 1 );
		expect( result.transitionWordSentences ).toBe( 0 );
	} );

	it( "returns 1 when a transition word is found in a sentence (Hungarian)", function() {
		// Transition word: Mikor
		mockPaper = new Paper( "Mikor kezdődik a film?", { locale: "hu_HU" } );
		result = transitionWordsResearch( mockPaper, new HungarianResearcher( mockPaper ) );
		expect( result.totalSentences ).toBe( 1 );
		expect( result.transitionWordSentences ).toBe( 1 );
	} );
	it( "returns 1 when a transition word is found in a sentence (Hungarian)", function() {
		// Transition word: például
		mockPaper = new Paper( "például növekedési arány és szaporodásbiológia szempontjából.", { locale: "hu_HU" } );
		result = transitionWordsResearch( mockPaper, new HungarianResearcher( mockPaper ) );
		expect( result.totalSentences ).toBe( 1 );
		expect( result.transitionWordSentences ).toBe( 1 );
	} );
	it( "returns 1 when a two-part transition word is found in a sentence (Hungarian)", function() {
		// Transition word: ahogy, akkor
		mockPaper = new Paper( "Csak később, ahogy felnőttem, akkor kezdődött a sok baj.", { locale: "hu_HU" } );
		result = transitionWordsResearch( mockPaper, new HungarianResearcher( mockPaper ) );
		expect( result.totalSentences ).toBe( 1 );
		expect( result.transitionWordSentences ).toBe( 1 );
	} );*/
	/*it( "returns 1 when a three-part transition word is found in a sentence (Hungarian)", function() {
		// Transition word: nemcsak, hanem, is
		mockPaper = new Paper( "Nemcsak a csokoládét szeretem, hanem a süteményt is.", { locale: "hu_HU" } );
		result = transitionWordsResearch( mockPaper, new HungarianResearcher( mockPaper ) );
		expect( result.totalSentences ).toBe( 1 );
		expect( result.transitionWordSentences ).toBe( 1 );
	} );
	it( "returns 1 when a multiple transition word is found in a sentence (Hungarian)", function() {
		// Transition word: azzal a feltétellel, hogy
		mockPaper = new Paper( "Azzal a feltétellel, hogy én forgathatom a kést.", { locale: "hu_HU" } );
		result = transitionWordsResearch( mockPaper, new HungarianResearcher( mockPaper ) );
		expect( result.totalSentences ).toBe( 1 );
		expect( result.transitionWordSentences ).toBe( 1 );
	} );
	it( "returns 0 when no transition words are present in a sentence (Hungarian)", function() {
		mockPaper = new Paper( "Nem beszélek magyarul.", { locale: "hu_HU" } );
		result = transitionWordsResearch( mockPaper, new HungarianResearcher( mockPaper ) );
		expect( result.totalSentences ).toBe( 1 );
		expect( result.transitionWordSentences ).toBe( 0 );
	} );

	it( "returns 1 when a transition word is found in a sentence (Indonesian)", function() {
		// Transition word: dikarenakan.
		mockPaper = new Paper( "Dikarenakan sakit, ia tidak masuk kerja.", { locale: "id_ID" } );
		result = transitionWordsResearch( mockPaper, new IndonesianResearcher( mockPaper ) );
		expect( result.totalSentences ).toBe( 1 );
		expect( result.transitionWordSentences ).toBe( 1 );
	} );

	it( "returns 1 when a two-part transition word is found in a sentence (Indonesian)", function() {
		// Transition word: sedemikian, sampai.
		mockPaper = new Paper( "Ia sedemikian marahnya sampai tidak bisa berkata-kata.", { locale: "id_ID" } );
		result = transitionWordsResearch( mockPaper, new IndonesianResearcher( mockPaper ) );
		expect( result.totalSentences ).toBe( 1 );
		expect( result.transitionWordSentences ).toBe( 1 );
	} );

	it( "returns 0 when no transition words are present in a sentence (Indonesian)", function() {
		mockPaper = new Paper( "Ibu itu membeli beras.", { locale: "id_ID" } );
		result = transitionWordsResearch( mockPaper, new IndonesianResearcher( mockPaper ) );
		expect( result.totalSentences ).toBe( 1 );
		expect( result.transitionWordSentences ).toBe( 0 );
	} );

	it( "returns 1 when a transition word is found in a sentence (Turkish)", function() {
		// Transition word: ama.
		mockPaper = new Paper( "Ama durum bu olmayabilir.", { locale: "tr_TR" } );
		result = transitionWordsResearch( mockPaper, new TurkishResearcher( mockPaper ) );
		expect( result.totalSentences ).toBe( 1 );
		expect( result.transitionWordSentences ).toBe( 1 );
	} );

	it( "returns 1 when a two-part transition word is found in a sentence (Turkish)", function() {
		// Transition word: hem, hem de.
		mockPaper = new Paper( "Hem şapka hem de ceket dolapta.", { locale: "tr_TR" } );
		result = transitionWordsResearch( mockPaper, new TurkishResearcher( mockPaper ) );
		expect( result.totalSentences ).toBe( 1 );
		expect( result.transitionWordSentences ).toBe( 1 );
	} );

	it( "returns 0 when no transition words are present in a sentence (Turkish)", function() {
		mockPaper = new Paper( "Koltuklar her gün mevcuttur.", { locale: "tr_TR" } );
		result = transitionWordsResearch( mockPaper, new TurkishResearcher( mockPaper ) );
		expect( result.totalSentences ).toBe( 1 );
		expect( result.transitionWordSentences ).toBe( 0 );
	} );

	it( "returns 1 when a transition word is found in a sentence (Hebrew)", function() {
		// Transition word: בגלל.
		mockPaper = new Paper( "ביטלנו את הטיול בגלל הגשם.", { locale: "he_IL" } );
		result = transitionWordsResearch( mockPaper, new HebrewResearcher( mockPaper ) );
		expect( result.totalSentences ).toBe( 1 );
		expect( result.transitionWordSentences ).toBe( 1 );
	} );

	it( "returns 1 when a two-part transition word is found in a sentence (Hebrew)", function() {
		// Transition word: או, או.
		mockPaper = new Paper( " או חברותא או מיתותא.", { locale: "he_IL" } );
		result = transitionWordsResearch( mockPaper, new HebrewResearcher( mockPaper ) );
		expect( result.totalSentences ).toBe( 1 );
		expect( result.transitionWordSentences ).toBe( 1 );
	} );

	it( "returns 0 when no transition words are present in a sentence (Hebrew)", function() {
		mockPaper = new Paper( "האם קנתה אורז.", { locale: "he_IL" } );
		result = transitionWordsResearch( mockPaper, new HebrewResearcher( mockPaper ) );
		expect( result.totalSentences ).toBe( 1 );
		expect( result.transitionWordSentences ).toBe( 0 );
	} );

	it( "returns 1 when a (single) transition word is found in a sentence (Arabic)", function() {
		// Transition word: كذلك.
		mockPaper = new Paper( "يمكننا الذهاب إلى الجامعة، ويمكننا كذلك المذاكرة في المكتبة هناك.", { locale: "ar" } );
		result = transitionWordsResearch( mockPaper, new ArabicResearcher( mockPaper ) );
		expect( result.totalSentences ).toBe( 1 );
		expect( result.transitionWordSentences ).toBe( 1 );
	} );

	it( "returns 1 when a (multiple) transition word is found in a sentence (Arabic)", function() {
		// Transition word: إلى الأبد.
		mockPaper = new Paper( "سأحبك إلى الأبد.", { locale: "ar" } );
		result = transitionWordsResearch( mockPaper, new ArabicResearcher( mockPaper ) );
		expect( result.totalSentences ).toBe( 1 );
		expect( result.transitionWordSentences ).toBe( 1 );
	} );

	it( "returns 1 when a two-part transition word is found in a sentence (Arabic)", function() {
		// Transition word: أو ,إما.
		mockPaper = new Paper( "يمكننا الحصول إما على الخبز أو الأرز.", { locale: "ar" } );
		result = transitionWordsResearch( mockPaper, new ArabicResearcher( mockPaper ) );
		expect( result.totalSentences ).toBe( 1 );
		expect( result.transitionWordSentences ).toBe( 1 );
	} );

	it( "returns 0 when no transition words are present in a sentence (Arabic)", function() {
		mockPaper = new Paper( "اشترت الأم الأرز.", { locale: "ar" } );
		result = transitionWordsResearch( mockPaper, new ArabicResearcher( mockPaper ) );
		expect( result.totalSentences ).toBe( 1 );
		expect( result.transitionWordSentences ).toBe( 0 );
	} );

	it( "returns 1 when a (single) transition word is found in a sentence (Japanese)", function() {
		// Transition word: とりわけ
		mockPaper = new Paper( "とりわけ、いくつかの良い例が必要です", { locale: "ja" } );
		result = transitionWordsResearch( mockPaper, new JapaneseResearcher( mockPaper ) );
		expect( result.totalSentences ).toBe( 1 );
		expect( result.transitionWordSentences ).toBe( 1 );
	} );
*/
	it( "returns 1 when a (multiple) transition word is found in a language that uses a custom" +
		" match transition word helper (Japanese)", function() {
		// Transition word: ゆえに (tokenized: [ "ゆえ", "に" ])
		mockPaper = new Paper( "我思う、ゆえに我あり。", { locale: "ja" } );
		result = transitionWordsResearch( mockPaper, new JapaneseResearcher( mockPaper ) );
		expect( result.totalSentences ).toBe( 1 );
		expect( result.transitionWordSentences ).toBe( 1 );
	} );

	it( "returns 0 when no transition words are present in a sentence for a language that uses a" +
		" custom match transition word helper (Japanese)", function() {
		mockPaper = new Paper( "この例文は、書き方のサンプルなので必要に応じて内容を追加削除をしてからお使いください。", { locale: "ja" } );
		result = transitionWordsResearch( mockPaper, new JapaneseResearcher( mockPaper ) );
		expect( result.totalSentences ).toBe( 1 );
		expect( result.transitionWordSentences ).toBe( 0 );
	} );

	it( "works with normalizes quotes", function() {
		// Transition word: what’s more.
		mockPaper = new Paper( "what’s more", {} );
		result = transitionWordsResearch( mockPaper, new EnglishResearcher( mockPaper ) );

		expect( result ).toEqual( {
			totalSentences: 1,
			sentenceResults: [
				{
					sentence: "what’s more",
					transitionWords: [ "what's more" ],
				},
			],
			transitionWordSentences: 1,
		} );
	} );

	it( "works with the no-break space character", function() {
		// Transition word: then.
		mockPaper = new Paper( "and\u00a0then" );
		const expected = {
			totalSentences: 1,
			sentenceResults: [ {
				sentence: "and\u00a0then",
				transitionWords: [ "then" ],
			} ],
			transitionWordSentences: 1,
		};

		result = transitionWordsResearch( mockPaper, new EnglishResearcher( mockPaper ) );

		expect( result ).toEqual( expected );
	} );

	it( "does not recognize 'eggs' as a transition word (don't ask).", function() {
		// Non-transition word: eggs.
		mockPaper = new Paper( "Let's bake some eggs." );
		const expected = {
			totalSentences: 1,
			sentenceResults: [ ],
			transitionWordSentences: 0,
		};

		result = transitionWordsResearch( mockPaper, new EnglishResearcher( mockPaper ) );

		expect( result ).toEqual( expected );
	} );

	it( "does recognize transition words with full stops, like 'e.g.'.", function() {
		// Non-transition word: eggs.
		mockPaper = new Paper( "E.g. potatoes. I.e. apples." );
		const expected = {
			sentenceResults: [ {
				sentence: "E.g. potatoes.",
				transitionWords: [ "e.g." ],
			}, {
				sentence: "I.e. apples.",
				transitionWords: [ "i.e." ],
			} ],
			totalSentences: 2,
			transitionWordSentences: 2,
		};

		result = transitionWordsResearch( mockPaper, new EnglishResearcher( mockPaper ) );

		expect( result ).toEqual( expected );
	} );
} );
