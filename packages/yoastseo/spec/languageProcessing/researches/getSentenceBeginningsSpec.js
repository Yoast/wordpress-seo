import getSentenceBeginnings from "../../../src/languageProcessing/researches/getSentenceBeginnings";

import Paper from "../../../src/values/Paper.js";
import EnglishResearcher from "../../../src/languageProcessing/languages/en/Researcher";
import FrenchResearcher from "../../../src/languageProcessing/languages/fr/Researcher";
import GermanResearcher from "../../../src/languageProcessing/languages/de/Researcher";
import SpanishResearcher from "../../../src/languageProcessing/languages/es/Researcher";
import ItalianResearcher from "../../../src/languageProcessing/languages/it/Researcher";
import PortugueseResearcher from "../../../src/languageProcessing/languages/pt/Researcher";
import PolishResearcher from "../../../src/languageProcessing/languages/pl/Researcher";
import IndonesianResearcher from "../../../src/languageProcessing/languages/id/Researcher";
import SwedishResearcher from "../../../src/languageProcessing/languages/sv/Researcher";
import DutchResearcher from "../../../src/languageProcessing/languages/nl/Researcher";
import RussianResearcher from "../../../src/languageProcessing/languages/ru/Researcher";
import ArabicResearcher from "../../../src/languageProcessing/languages/ar/Researcher";
import GreekResearcher from "../../../src/languageProcessing/languages/el/Researcher";
import JapaneseResearcher from "../../../src/languageProcessing/languages/ja/Researcher";
import { enableFeatures } from "@yoast/feature-flag";

// eslint-disable-next-line max-statements
describe( "gets the sentence beginnings and the count of consecutive duplicates.", function() {
	let mockPaper = new Paper( "How are you? Bye!", { locale: "en_US" } );
	let researcher = new EnglishResearcher( mockPaper );

	it( "returns an object with sentence beginnings and counts for two sentences in English starting w" +
		"ith different words.", function() {
		expect( getSentenceBeginnings( mockPaper, researcher )[ 0 ].word ).toBe( "how" );
		expect( getSentenceBeginnings( mockPaper, researcher )[ 0 ].count ).toBe( 1 );
		expect( getSentenceBeginnings( mockPaper, researcher )[ 1 ].word ).toBe( "bye" );
		expect( getSentenceBeginnings( mockPaper, researcher )[ 1 ].count ).toBe( 1 );
	} );

	it( "returns an object with sentence beginnings and counts for two sentences in English starting with the same word.", function() {
		mockPaper = new Paper( "Hey, hey! Hey.", { locale: "en_US" } );
		researcher = new EnglishResearcher( mockPaper );
		expect( getSentenceBeginnings( mockPaper, researcher )[ 0 ].word ).toBe( "hey" );
		expect( getSentenceBeginnings( mockPaper, researcher )[ 0 ].count ).toBe( 2 );
	} );

	it( "returns an object with sentence beginnings and counts for four sentences in English, " +
		"the first two starting with the same word. The fourth is starting with the same word as the first two. " +
		"The count for this word should be reset.", function() {
		mockPaper = new Paper( "Hey, hey! Hey. Bye. Hey.", { locale: "en_US" } );
		researcher = new EnglishResearcher( mockPaper );
		expect( getSentenceBeginnings( mockPaper, researcher )[ 0 ].count ).toBe( 2 );
		expect( getSentenceBeginnings( mockPaper, researcher )[ 0 ].word ).toBe( "hey" );
		expect( getSentenceBeginnings( mockPaper, researcher )[ 1 ].word ).toBe( "bye" );
		expect( getSentenceBeginnings( mockPaper, researcher )[ 1 ].count ).toBe( 1 );
		expect( getSentenceBeginnings( mockPaper, researcher )[ 2 ].word ).toBe( "hey" );
		expect( getSentenceBeginnings( mockPaper, researcher )[ 2 ].count ).toBe( 1 );
	} );

	it( "returns an object with sentence beginnings and counts for three sentences in English all starting " +
		"with one of the exception words.", function() {
		mockPaper = new Paper( "The boy, hey! The boy. The boy.", { locale: "en_US" } );
		researcher = new EnglishResearcher( mockPaper );
		expect( getSentenceBeginnings( mockPaper, researcher )[ 0 ].word ).toBe( "the boy" );
		expect( getSentenceBeginnings( mockPaper, researcher )[ 0 ].count ).toBe( 3 );
	} );

	it( "returns an object with sentence beginnings and counts for three sentences in English all starting " +
		"with one of the exception words. The second word of all sentences is also in the list " +
		"of exception words, which should not matter.", function() {
		mockPaper = new Paper( "One, two, three. One, two, three. One, two, three.", { locale: "en_US" } );
		researcher = new EnglishResearcher( mockPaper );
		expect( getSentenceBeginnings( mockPaper, researcher )[ 0 ].word ).toBe( "one two" );
		expect( getSentenceBeginnings( mockPaper, researcher )[ 0 ].count ).toBe( 3 );
	} );

	it( "returns an object with sentence beginnings and counts based on the default (English) when no locale is included.", function() {
		mockPaper = new Paper( "The boy, hey! The boy. The boy." );
		researcher = new EnglishResearcher( mockPaper );
		expect( getSentenceBeginnings( mockPaper, researcher )[ 0 ].word ).toBe( "the boy" );
		expect( getSentenceBeginnings( mockPaper, researcher )[ 0 ].count ).toBe( 3 );
	} );

	it( "returns only an exclusion word, if that is the only word in a sentences (English)", function() {
		mockPaper = new Paper( "A" );
		researcher = new EnglishResearcher( mockPaper );
		expect( getSentenceBeginnings( mockPaper, researcher )[ 0 ].word ).toBe( "a" );
		expect( getSentenceBeginnings( mockPaper, researcher )[ 0 ].count ).toBe( 1 );
	} );

	it( "returns an object with sentence beginnings and counts for two sentences in French starting with different words.", function() {
		mockPaper = new Paper( "Sur le pont d'Avignon. Liberté, égalité, fraternité. ", { locale: "fr_FR" } );
		researcher = new FrenchResearcher( mockPaper );
		expect( getSentenceBeginnings( mockPaper, researcher )[ 0 ].word ).toBe( "sur" );
		expect( getSentenceBeginnings( mockPaper, researcher )[ 0 ].count ).toBe( 1 );
		expect( getSentenceBeginnings( mockPaper, researcher )[ 1 ].word ).toBe( "liberté" );
		expect( getSentenceBeginnings( mockPaper, researcher )[ 1 ].count ).toBe( 1 );
	} );

	it( "returns an object with sentence beginnings and counts for two sentences in French starting with the same word.", function() {
		mockPaper = new Paper( "Bonjour, tout le monde! Bonjour.", { locale: "fr_FR" } );
		researcher = new FrenchResearcher( mockPaper );
		expect( getSentenceBeginnings( mockPaper, researcher )[ 0 ].word ).toBe( "bonjour" );
		expect( getSentenceBeginnings( mockPaper, researcher )[ 0 ].count ).toBe( 2 );
	} );

	it( "returns an object with sentence beginnings and counts for three sentences in French all starting " +
		"with one of the exception words.", function() {
		mockPaper = new Paper( "La vache qui rit. La vache qui pleure. La vache qui vole.", { locale: "fr_FR" } );
		researcher = new FrenchResearcher( mockPaper );
		expect( getSentenceBeginnings( mockPaper, researcher )[ 0 ].word ).toBe( "la vache" );
		expect( getSentenceBeginnings( mockPaper, researcher )[ 0 ].count ).toBe( 3 );
	} );

	it( "returns an object with sentence beginnings and counts for sentences in French that start with a character with a diacritic.", function() {
		mockPaper = new Paper( "À Paris, certaines prisons sont restées célèbres. À Paris, certaines prisons " +
		"sont restées célèbres. À Paris, certaines prisons sont restées célèbres.", { locale: "fr_FR" } );
		researcher = new FrenchResearcher( mockPaper );
		expect( getSentenceBeginnings( mockPaper, researcher )[ 0 ].word ).toBe( "à" );
		expect( getSentenceBeginnings( mockPaper, researcher )[ 0 ].count ).toBe( 3 );
	} );

	it( "returns an object with sentence beginnings and counts for two sentences in German starting with different words.", function() {
		mockPaper = new Paper( "Ich bin wie du. Auf wiedersehen. ", { locale: "de_DE" } );
		researcher = new GermanResearcher( mockPaper );
		expect( getSentenceBeginnings( mockPaper, researcher )[ 0 ].word ).toBe( "ich" );
		expect( getSentenceBeginnings( mockPaper, researcher )[ 0 ].count ).toBe( 1 );
		expect( getSentenceBeginnings( mockPaper, researcher )[ 1 ].word ).toBe( "auf" );
		expect( getSentenceBeginnings( mockPaper, researcher )[ 1 ].count ).toBe( 1 );
	} );

	it( "returns an object with sentence beginnings and counts for two sentences in German starting with the same word.", function() {
		mockPaper = new Paper( "Hallo, hallo! Hallo.", { locale: "de_DE" } );
		researcher = new GermanResearcher( mockPaper );
		expect( getSentenceBeginnings( mockPaper, researcher )[ 0 ].word ).toBe( "hallo" );
		expect( getSentenceBeginnings( mockPaper, researcher )[ 0 ].count ).toBe( 2 );
	} );

	it( "returns an object with sentence beginnings and counts for three sentences in German all starting " +
		"with one of the exception words.", function() {
		mockPaper = new Paper( "Eine kleine Nachtmusik. Eine kleine Geige. Eine kleine Wolke.", { locale: "de_DE" } );
		researcher = new GermanResearcher( mockPaper );
		expect( getSentenceBeginnings( mockPaper, researcher )[ 0 ].word ).toBe( "eine kleine" );
		expect( getSentenceBeginnings( mockPaper, researcher )[ 0 ].count ).toBe( 3 );
	} );

	it( "returns an object with sentence beginnings and counts for sentences in German that start with a character with a diacritic.", function() {
		mockPaper = new Paper( "Österreich ist ein schönes Land. Österreich ist ein schönes Land. Österreich " +
				"ist ein schönes Land.", { locale: "de_DE" } );
		researcher = new GermanResearcher( mockPaper );
		expect( getSentenceBeginnings( mockPaper, researcher )[ 0 ].word ).toBe( "österreich" );
		expect( getSentenceBeginnings( mockPaper, researcher )[ 0 ].count ).toBe( 3 );
	} );

	it( "returns an object with sentence beginnings and counts for two sentences in Spanish starting with different words.", function() {
		mockPaper = new Paper( "Vamos a la playa. Muy buenos. ", { locale: "es_ES" } );
		researcher = new SpanishResearcher( mockPaper );
		expect( getSentenceBeginnings( mockPaper, researcher )[ 0 ].word ).toBe( "vamos" );
		expect( getSentenceBeginnings( mockPaper, researcher )[ 0 ].count ).toBe( 1 );
		expect( getSentenceBeginnings( mockPaper, researcher )[ 1 ].word ).toBe( "muy" );
		expect( getSentenceBeginnings( mockPaper, researcher )[ 1 ].count ).toBe( 1 );
	} );

	it( "returns an object with sentence beginnings and counts for two sentences in Spanish starting with the same word.", function() {
		mockPaper = new Paper( "Que si, Que no. Que nunca te decides.", { locale: "es_ES" } );
		researcher = new SpanishResearcher( mockPaper );
		expect( getSentenceBeginnings( mockPaper, researcher )[ 0 ].word ).toBe( "que" );
		expect( getSentenceBeginnings( mockPaper, researcher )[ 0 ].count ).toBe( 2 );
	} );

	it( "returns an object with sentence beginnings and counts for three sentences in Spanish all starting " +
		"with one of the exception words.", function() {
		mockPaper = new Paper( "Aquellas pequeñas cosas. Aquellas pequeñas decisiones. Aquellas pequeñas ideas.", { locale: "es_ES" } );
		researcher = new SpanishResearcher( mockPaper );
		expect( getSentenceBeginnings( mockPaper, researcher )[ 0 ].word ).toBe( "aquellas pequeñas" );
		expect( getSentenceBeginnings( mockPaper, researcher )[ 0 ].count ).toBe( 3 );
	} );

	it( "returns an object with sentence beginnings and counts for sentences in Spanish that start with a character with a diacritic.", function() {
		mockPaper = new Paper( "África es un gran continente. África es un gran continente. África es un gran continente.", { locale: "es_ES" } );
		researcher = new SpanishResearcher( mockPaper );
		expect( getSentenceBeginnings( mockPaper, researcher )[ 0 ].word ).toBe( "áfrica" );
		expect( getSentenceBeginnings( mockPaper, researcher )[ 0 ].count ).toBe( 3 );
	} );

	it( "returns an object with sentence beginnings and counts for two sentences in Portuguese starting with different words.", function() {
		mockPaper = new Paper( "Quem sou? Para onde vou?", { locale: "pt_PT" } );
		researcher = new PortugueseResearcher( mockPaper );
		expect( getSentenceBeginnings( mockPaper, researcher )[ 0 ].word ).toBe( "quem" );
		expect( getSentenceBeginnings( mockPaper, researcher )[ 0 ].count ).toBe( 1 );
		expect( getSentenceBeginnings( mockPaper, researcher )[ 1 ].word ).toBe( "para" );
		expect( getSentenceBeginnings( mockPaper, researcher )[ 1 ].count ).toBe( 1 );
	} );

	it( "returns an object with sentence beginnings and counts for two sentences in Portuguese starting with the same word.", function() {
		mockPaper = new Paper( "Dora pensa sobre o quanto ela ama sua floresta. Dora ama explorar a floresta, saltando de ramo para ramo " +
			"entre as árvores altas.", { locale: "pt_PT" } );
		researcher = new PortugueseResearcher( mockPaper );
		expect( getSentenceBeginnings( mockPaper, researcher )[ 0 ].word ).toBe( "dora" );
		expect( getSentenceBeginnings( mockPaper, researcher )[ 0 ].count ).toBe( 2 );
	} );

	it( "returns an object with sentence beginnings and counts for three sentences in Portuguese all starting " +
		"with one of the exception words.", function() {
		mockPaper = new Paper( "O mês estava frio. O mês foi difícil. O final disso os fez felizes.", { locale: "pt_PT" } );
		researcher = new PortugueseResearcher( mockPaper );
		expect( getSentenceBeginnings( mockPaper, researcher )[ 0 ].word ).toBe( "o mês" );
		expect( getSentenceBeginnings( mockPaper, researcher )[ 0 ].count ).toBe( 2 );
		expect( getSentenceBeginnings( mockPaper, researcher )[ 1 ].word ).toBe( "o final" );
		expect( getSentenceBeginnings( mockPaper, researcher )[ 1 ].count ).toBe( 1 );
	} );

	it( "returns an object with sentence beginnings and counts for sentences in Portuguese that start " +
		"with a character with a diacritic.", function() {
		mockPaper = new Paper( "Não viajo faz muito tempo. Não vi montanhas em anos. Não vi o mar desde que eu era pequeno.", { locale: "es_ES" } );
		researcher = new PortugueseResearcher( mockPaper );
		expect( getSentenceBeginnings( mockPaper, researcher )[ 0 ].word ).toBe( "não" );
		expect( getSentenceBeginnings( mockPaper, researcher )[ 0 ].count ).toBe( 3 );
	} );

	it( "returns an object with sentence beginnings and counts for two sentences in Dutch starting with different words.", function() {
		mockPaper = new Paper( "Hallo wereld. Hoe gaat het? ", { locale: "nl_NL" } );
		researcher = new DutchResearcher( mockPaper );
		expect( getSentenceBeginnings( mockPaper, researcher )[ 0 ].word ).toBe( "hallo" );
		expect( getSentenceBeginnings( mockPaper, researcher )[ 0 ].count ).toBe( 1 );
		expect( getSentenceBeginnings( mockPaper, researcher )[ 1 ].word ).toBe( "hoe" );
		expect( getSentenceBeginnings( mockPaper, researcher )[ 1 ].count ).toBe( 1 );
	} );

	it( "returns an object with sentence beginnings and counts for two sentences in Dutch starting with the same word.", function() {
		mockPaper = new Paper( "Hallo wereld. Hallo mensheid.", { locale: "nl_NL" } );
		researcher = new DutchResearcher( mockPaper );
		expect( getSentenceBeginnings( mockPaper, researcher )[ 0 ].word ).toBe( "hallo" );
		expect( getSentenceBeginnings( mockPaper, researcher )[ 0 ].count ).toBe( 2 );
	} );

	it( "returns an object with sentence beginnings and counts for three sentences in Dutch all starting " +
		"with one of the exception words.", function() {
		mockPaper = new Paper( "Het is een nacht die je normaal alleen in films ziet. Het is een nacht die wordt bezongen in het mooiste lied. " +
			"Het is een nacht waarvan ik dacht dat ik 'm nooit beleven zou", { locale: "nl_NL" } );
		researcher = new DutchResearcher( mockPaper );
		expect( getSentenceBeginnings( mockPaper, researcher )[ 0 ].word ).toBe( "het is" );
		expect( getSentenceBeginnings( mockPaper, researcher )[ 0 ].count ).toBe( 3 );
	} );

	it( "returns an object with sentence beginnings and counts for two sentences in Italian starting with different words.", function() {
		mockPaper = new Paper( "Volare, oh oh. Cantare, oh oh oh oh.", { locale: "it_IT" } );
		researcher = new ItalianResearcher( mockPaper );
		expect( getSentenceBeginnings( mockPaper, researcher )[ 0 ].word ).toBe( "volare" );
		expect( getSentenceBeginnings( mockPaper, researcher )[ 0 ].count ).toBe( 1 );
		expect( getSentenceBeginnings( mockPaper, researcher )[ 1 ].word ).toBe( "cantare" );
		expect( getSentenceBeginnings( mockPaper, researcher )[ 1 ].count ).toBe( 1 );
	} );

	it( "returns an object with sentence beginnings and counts for two sentences in Italian starting with " +
		"the same word.", function() {
		mockPaper = new Paper( "E che dici di stare lassù. E volavo, volavo felice più in alto del sole ed ancora più su.", { locale: "it_IT" } );
		researcher = new ItalianResearcher( mockPaper );
		expect( getSentenceBeginnings( mockPaper, researcher )[ 0 ].word ).toBe( "e" );
		expect( getSentenceBeginnings( mockPaper, researcher )[ 0 ].count ).toBe( 2 );
	} );

	it( "returns an object with sentence beginnings and counts for three sentences in Italian all starting " +
		"with one of the exception words.", function() {
		mockPaper = new Paper( "Una musica dolce. Una musica brutal. Una musica de cine.", { locale: "it_IT" } );
		researcher = new ItalianResearcher( mockPaper );
		expect( getSentenceBeginnings( mockPaper, researcher )[ 0 ].word ).toBe( "una musica" );
		expect( getSentenceBeginnings( mockPaper, researcher )[ 0 ].count ).toBe( 3 );
	} );

	it( "returns an object with sentence beginnings and counts for two sentences in Italian that start " +
		"with a character with a diacritic.", function() {
		mockPaper = new Paper( "È freddo. È freddo.", { locale: "it_IT" } );
		researcher = new ItalianResearcher( mockPaper );
		expect( getSentenceBeginnings( mockPaper, researcher )[ 0 ].word ).toBe( "è" );
		expect( getSentenceBeginnings( mockPaper, researcher )[ 0 ].count ).toBe( 2 );
	} );

	it( "returns an object with sentence beginnings and counts for two sentences in Russian starting with the same word.", function() {
		mockPaper = new Paper( "Здравствуй, мир! Здравствуй, человек!", { locale: "ru_RU" } );
		researcher = new RussianResearcher( mockPaper );
		expect( getSentenceBeginnings( mockPaper, researcher )[ 0 ].word ).toBe( "здравствуй" );
		expect( getSentenceBeginnings( mockPaper, researcher )[ 0 ].count ).toBe( 2 );
	} );

	it( "returns an object with sentence beginnings and counts for three sentences in Russian all starting " +
		"with one of the exception words.", function() {
		mockPaper = new Paper( "Этот человек ее унизил. Этот человек ее уничтожил. Этот человек стал ее проклятием.",
			{ locale: "ru_RU" } );
		researcher = new RussianResearcher( mockPaper );
		expect( getSentenceBeginnings( mockPaper, researcher )[ 0 ].word ).toBe( "этот человек" );
		expect( getSentenceBeginnings( mockPaper, researcher )[ 0 ].count ).toBe( 3 );
	} );

	it( "returns an object with sentence beginnings and counts for two sentences in Russian starting with different words.", function() {
		mockPaper = new Paper( "Плюсы и минусы. Где в итоге лучше и почему?", { locale: "ru_RU" } );
		researcher = new RussianResearcher( mockPaper );
		expect( getSentenceBeginnings( mockPaper, researcher )[ 0 ].word ).toBe( "плюсы" );
		expect( getSentenceBeginnings( mockPaper, researcher )[ 0 ].count ).toBe( 1 );
		expect( getSentenceBeginnings( mockPaper, researcher )[ 1 ].word ).toBe( "где" );
		expect( getSentenceBeginnings( mockPaper, researcher )[ 1 ].count ).toBe( 1 );
	} );

	it( "returns an object with sentence beginnings and counts for two sentences in Polish starting with different words.", function() {
		mockPaper = new Paper( "Najpierw zjem jabłko. Potem zjem gruszkę. ", { locale: "pl_PL" } );
		researcher = new PolishResearcher( mockPaper );

		expect( getSentenceBeginnings( mockPaper, researcher )[ 0 ].word ).toBe( "najpierw" );
		expect( getSentenceBeginnings( mockPaper, researcher )[ 0 ].count ).toBe( 1 );
		expect( getSentenceBeginnings( mockPaper, researcher )[ 1 ].word ).toBe( "potem" );
		expect( getSentenceBeginnings( mockPaper, researcher )[ 1 ].count ).toBe( 1 );
	} );

	it( "returns an object with sentence beginnings and counts for two sentences in Polish starting with the same word.", function() {
		mockPaper = new Paper( "Zawsze cię widzę. Zawsze cię słyszę.", { locale: "pl_PL" } );
		researcher = new PolishResearcher( mockPaper );

		expect( getSentenceBeginnings( mockPaper, researcher )[ 0 ].word ).toBe( "zawsze" );
		expect( getSentenceBeginnings( mockPaper, researcher )[ 0 ].count ).toBe( 2 );
	} );

	it( "returns an object with sentence beginnings and counts for three sentences in Polish all starting " +
		"with one of the exception words.", function() {
		mockPaper = new Paper( "To dziecko jest ładne. To dziecko jest brzydkie. To dziecko jest małe.", { locale: "pl_PL" } );
		researcher = new PolishResearcher( mockPaper );

		expect( getSentenceBeginnings( mockPaper, researcher )[ 0 ].word ).toBe( "to dziecko" );
		expect( getSentenceBeginnings( mockPaper, researcher )[ 0 ].count ).toBe( 3 );
	} );

	it( "returns an object with sentence beginnings and counts for three sentences in Polish that start " +
		"with a character with a diacritic.", function() {
		mockPaper = new Paper( "Żona mojego brata jest miła. Żona mojej siostry jest piękna. Żona moja jest najlepsza.", { locale: "pl_PL" } );
		researcher = new PolishResearcher( mockPaper );

		expect( getSentenceBeginnings( mockPaper, researcher )[ 0 ].word ).toBe( "żona" );
		expect( getSentenceBeginnings( mockPaper, researcher )[ 0 ].count ).toBe( 3 );
	} );

	it( "returns an object with sentence beginnings and counts for two sentences in Swedish starting with different words.", function() {
		mockPaper = new Paper( "Är du osäker, testa en kort fristående kurs hellre än ett program. Passar ämnet dig kan du hoppa " +
			"på ett program och tillgodoräkna dig kursen.", { locale: "sv_SE" } );
		researcher = new SwedishResearcher( mockPaper );

		expect( getSentenceBeginnings( mockPaper, researcher )[ 0 ].word ).toBe( "är" );
		expect( getSentenceBeginnings( mockPaper, researcher )[ 0 ].count ).toBe( 1 );
		expect( getSentenceBeginnings( mockPaper, researcher )[ 1 ].word ).toBe( "passar" );
		expect( getSentenceBeginnings( mockPaper, researcher )[ 1 ].count ).toBe( 1 );
	} );

	it( "returns an object with sentence beginnings and counts for two sentences in Swedish starting with the same word.", function() {
		mockPaper = new Paper( "Du är lång. Du är kort.", { locale: "sv_SE" } );
		researcher = new SwedishResearcher( mockPaper );

		expect( getSentenceBeginnings( mockPaper, researcher )[ 0 ].word ).toBe( "du" );
		expect( getSentenceBeginnings( mockPaper, researcher )[ 0 ].count ).toBe( 2 );
	} );

	it( "returns an object with sentence beginnings and counts for three sentences in Swedish all starting " +
		"with one of the exception words.", function() {
		mockPaper = new Paper( "Detta barn är litet. Detta barn är stort. Detta barn är lyckligt.", { locale: "sv_SE" } );
		researcher = new SwedishResearcher( mockPaper );

		expect( getSentenceBeginnings( mockPaper, researcher )[ 0 ].word ).toBe( "detta barn" );
		expect( getSentenceBeginnings( mockPaper, researcher )[ 0 ].count ).toBe( 3 );
	} );

	it( "returns an object with sentence beginnings and counts for two sentences in Indonesian starting with different words.", function() {
		mockPaper = new Paper( "Halo dunia!. Apa kabarmu? ", { locale: "id_ID" } );
		researcher = new IndonesianResearcher( mockPaper );

		expect( getSentenceBeginnings( mockPaper, researcher )[ 0 ].word ).toBe( "halo" );
		expect( getSentenceBeginnings( mockPaper, researcher )[ 0 ].count ).toBe( 1 );
		expect( getSentenceBeginnings( mockPaper, researcher )[ 1 ].word ).toBe( "apa" );
		expect( getSentenceBeginnings( mockPaper, researcher )[ 1 ].count ).toBe( 1 );
	} );

	it( "returns an object with sentence beginnings and counts for two sentences in Indonesian starting with the same word.", function() {
		mockPaper = new Paper( "Bukunya murah. Bukunya mahal.", { locale: "id_ID" } );
		researcher = new IndonesianResearcher( mockPaper );

		expect( getSentenceBeginnings( mockPaper, researcher )[ 0 ].word ).toBe( "bukunya" );
		expect( getSentenceBeginnings( mockPaper, researcher )[ 0 ].count ).toBe( 2 );
	} );

	it( "returns an object with sentence beginnings and counts for three sentences in Indonesian all starting " +
		"with one of the exception words.", function() {
		mockPaper = new Paper( "Seorang pemimpin seharusnya bijaksana. Seorang pemimpin seharusnya memberi contoh yang baik. " +
			"Seorang pemimpin seharusnya memikirkan rakyatnya", { locale: "id_ID" } );
		researcher = new IndonesianResearcher( mockPaper );

		expect( getSentenceBeginnings( mockPaper, researcher )[ 0 ].word ).toBe( "seorang pemimpin" );
		expect( getSentenceBeginnings( mockPaper, researcher )[ 0 ].count ).toBe( 3 );
	} );

	it( "returns an object with English sentence beginnings in lists", function() {
		mockPaper = new Paper( "<ul><li>item 1</li><li>item 2</li><li>item 3</li><li>item 4</li></ul>" );
		researcher = new EnglishResearcher( mockPaper );
		expect( getSentenceBeginnings( mockPaper, researcher )[ 0 ].word ).toBe( "item", { locale: "en_US" } );
		expect( getSentenceBeginnings( mockPaper, researcher )[ 0 ].count ).toBe( 4 );
	} );

	it( "does not count consecutive sentences in tables", function() {
		mockPaper = new Paper( "<figure class='wp-block-table'><table><tbody><tr><td>Cats and dogs.</td><td>Cats are cute.</td></tr><tr><td>Cats" +
			" are awesome.</td><td>Cats are nice.</td></tr></tbody></table><figcaption>Cats are great.</figcaption></figure>" );
		researcher = new EnglishResearcher( mockPaper );

		expect( getSentenceBeginnings( mockPaper, researcher ) ).toEqual( [] );
	} );

	it( "returns an object with English sentence beginnings with paragraph tags - it should match over paragraphs", function() {
		mockPaper = new Paper( "<p>Sentence 1. Sentence 2.</p><p>Sentence 3.</p>" );
		researcher = new EnglishResearcher( mockPaper );

		expect( getSentenceBeginnings( mockPaper, researcher )[ 0 ].word ).toBe( "sentence", { locale: "en_US" } );
		expect( getSentenceBeginnings( mockPaper, researcher )[ 0 ].count ).toBe( 3 );
	} );

	it( "returns an object with English sentence beginnings in different capitalizations", function() {
		mockPaper = new Paper( "Sentence 1. SENTENCE 2. Sentence 3." );
		researcher = new EnglishResearcher( mockPaper );

		expect( getSentenceBeginnings( mockPaper, researcher )[ 0 ].word ).toBe( "sentence", { locale: "en_US" } );
		expect( getSentenceBeginnings( mockPaper, researcher )[ 0 ].count ).toBe( 3 );
	} );

	it( "returns an empty string if only enters or whitespaces in a string", function() {
		mockPaper = new Paper( "   \n</div>", { locale: "en_US" } );
		researcher = new EnglishResearcher( mockPaper );

		expect( getSentenceBeginnings( mockPaper, researcher ) ).toEqual( [] );
	} );

	it( "returns an empty array if there is no sentence", function() {
		mockPaper = new Paper( "" );
		researcher = new EnglishResearcher( mockPaper );

		expect( getSentenceBeginnings( mockPaper, researcher ) ).toEqual( [] );
	} );

	it( "returns an empty array if there is a sentence with only whitespaces", function() {
		mockPaper = new Paper( "&nbsp;", { locale: "en_US" } );
		researcher = new EnglishResearcher( mockPaper );

		expect( getSentenceBeginnings( mockPaper, researcher ) ).toEqual( [] );
	} );

	it( "returns an empty array if the sentence is empty after removing HTML tags.", function() {
		mockPaper = new Paper( '<img class="alignnone wp-image-514079 size-full" src="https://yoast-mercury.s3.amazonaws.com' +
				'/uploads/2015/10/Twitter_analytics_FI.png" alt="" width="1200" height="628" />' );
		researcher = new EnglishResearcher( mockPaper );

		expect( getSentenceBeginnings( mockPaper, researcher ) ).toEqual( [] );
	} );

	it( "returns matching sentences if there is an 'empty' sentence", function() {
		mockPaper = new Paper( "\"A sentence with multiple terminators!\"). Test one. Test two. Test three." );
		researcher = new EnglishResearcher( mockPaper );

		expect( getSentenceBeginnings( mockPaper, researcher ) ).toContainEqual(
			{ word: "test", count: 3, sentences: [ "Test one.", "Test two.", "Test three." ] } );
	} );

	it( "returns an object with three Spanish sentences starting with the same word when those words are " +
		"preceded by different special characters in each sentence.", function() {
		mockPaper = new Paper( "¡Hola! ¡Hola? (¡Hola!)" );
		researcher = new SpanishResearcher( mockPaper );

		expect( getSentenceBeginnings( mockPaper, researcher )[ 0 ].word ).toBe( "hola", { locale: "es_ES" } );
		expect( getSentenceBeginnings( mockPaper, researcher )[ 0 ].count ).toBe( 3 );
	} );

	it( "returns an object with sentence beginnings and counts for two sentences in English, " +
		"when the sentences start with the same special character, but with different words.", function() {
		mockPaper = new Paper( "(First sentence). (Second sentence).", { locale: "en_US" } );
		researcher = new EnglishResearcher( mockPaper );

		expect( getSentenceBeginnings( mockPaper, researcher )[ 0 ].word ).toBe( "first" );
		expect( getSentenceBeginnings( mockPaper, researcher )[ 0 ].count ).toBe( 1 );
		expect( getSentenceBeginnings( mockPaper, researcher )[ 1 ].word ).toBe( "second" );
		expect( getSentenceBeginnings( mockPaper, researcher )[ 1 ].count ).toBe( 1 );
	} );

	it( "returns an object with sentence beginnings and counts for three sentences in Arabic all starting " +
		"with one of the exception words.", function() {
		mockPaper = new Paper( "هؤلاء الأولاد غائبون. هؤلاء الأولاد هم طلاب. هؤلاء الأولاد في المنزل.", { locale: "ar_AR" } );
		researcher = new ArabicResearcher( mockPaper );

		expect( getSentenceBeginnings( mockPaper, researcher )[ 0 ].word ).toBe( "هؤلاء الأولاد" );
		expect( getSentenceBeginnings( mockPaper, researcher )[ 0 ].count ).toBe( 3 );
	} );

	it( "returns an object with sentence beginnings and counts for two sentences in Arabic starting with different words.", function() {
		mockPaper = new Paper( "العشاء جاهز. ارجو أن تنضم الينا.", { locale: "ar_AR" } );
		researcher = new ArabicResearcher( mockPaper );

		expect( getSentenceBeginnings( mockPaper, researcher )[ 0 ].count ).toBe( 1 );
		expect( getSentenceBeginnings( mockPaper, researcher )[ 1 ].word ).toBe( "ارجو" );
		expect( getSentenceBeginnings( mockPaper, researcher )[ 1 ].count ).toBe( 1 );
		expect( getSentenceBeginnings( mockPaper, researcher )[ 0 ].word ).toBe( "العشاء" );
	} );

	it( "returns an object with sentence beginnings and counts for two sentences in Arabic starting with the same word.", function() {
		mockPaper = new Paper( "مرحبا بالزائرين. مرحبا بالعالم.", { locale: "ar_AR" } );
		researcher = new ArabicResearcher( mockPaper );

		expect( getSentenceBeginnings( mockPaper, researcher )[ 0 ].word ).toBe( "مرحبا" );
		expect( getSentenceBeginnings( mockPaper, researcher )[ 0 ].count ).toBe( 2 );
	} );
} );

describe( "gets the sentence beginnings data for Greek", () => {
	let mockPaper;
	let researcher;
	it( "returns an object with sentence beginnings and counts for three sentences all starting with the same words", () => {
		mockPaper = new Paper( "Οι γάτες είναι χαριτωμένες. Οι γάτες είναι γλυκές. Οι γάτες είναι αξιολάτρευτες.", { locale: "el" } );
		researcher = new GreekResearcher( mockPaper );

		expect( getSentenceBeginnings( mockPaper, researcher )[ 0 ].word ).toBe( "οι" );
		expect( getSentenceBeginnings( mockPaper, researcher )[ 0 ].count ).toBe( 3 );
	} );
	it( "returns an object with sentence beginnings and counts for three sentences all starting with the same words" +
		" that are listed in first word exception list", () => {
		mockPaper = new Paper( " Ένα από τα πιο σημαντικά προβλήματα στην εποχή μας είναι η υπερθέρμανση του πλανήτη." +
			" Ένα πρωινό, όπως πήγαινα στην δουλειά, βλέπω ένα μικρό γατάκι κάτω από ένα αυτοκίνητο." +
			" Ένα παιδί έχει ανάγκη την οικογένεια του.", { locale: "el" } );
		researcher = new GreekResearcher( mockPaper );

		expect( getSentenceBeginnings( mockPaper, researcher )[ 0 ].word ).toBe( "ένα από" );
		expect( getSentenceBeginnings( mockPaper, researcher )[ 1 ].word ).toBe( "ένα πρωινό" );
		expect( getSentenceBeginnings( mockPaper, researcher )[ 2 ].word ).toBe( "ένα παιδί" );
	} );
	it( "returns an object with sentence beginnings and counts for three sentences all starting with the same words" +
		" that are listed in first word exception list and followed by a word that is also in second word exception list", () => {
		mockPaper = new Paper( "Αυτός ο μπαμπάς είναι φοβερός. Αυτός ο παππούς είναι καλός. Αυτός ο άνδρας είναι όμορφος.", { locale: "el" } );
		researcher = new GreekResearcher( mockPaper );

		expect( getSentenceBeginnings( mockPaper, researcher )[ 0 ].word ).toBe( "αυτός ο μπαμπάς" );
		expect( getSentenceBeginnings( mockPaper, researcher )[ 1 ].word ).toBe( "αυτός ο παππούς" );
		expect( getSentenceBeginnings( mockPaper, researcher )[ 2 ].word ).toBe( "αυτός ο άνδρας" );
	} );
} );

describe( "tests the sentence beginnings data for Japanese", () => {
	enableFeatures( [ "JAPANESE_SUPPORT" ] );

	let mockPaper;
	let researcher;
	it( "returns an object with sentence beginnings and counts for two sentences in Japanese starting with different words.", function() {
		// https://tatoeba.org/en/sentences/show/425148
		// https://tatoeba.org/en/sentences/show/9431906
		mockPaper = new Paper( "私たちはよくチェスをします。チェスは難しい。", { locale: "ja_JP" } );
		researcher = new JapaneseResearcher( mockPaper );

		expect( getSentenceBeginnings( mockPaper, researcher )[ 0 ].word ).toBe( "私" );
		expect( getSentenceBeginnings( mockPaper, researcher )[ 0 ].count ).toBe( 1 );
		expect( getSentenceBeginnings( mockPaper, researcher )[ 1 ].word ).toBe( "チェス" );
		expect( getSentenceBeginnings( mockPaper, researcher )[ 1 ].count ).toBe( 1 );
	} );

	it( "returns an object with sentence beginnings and counts for two sentences in Japanese starting with the same word.", function() {
		// https://tatoeba.org/en/sentences/show/810883
		// https://tatoeba.org/en/sentences/show/2337881
		mockPaper = new Paper( "寿司が好きです。寿司はおいしいです。", { locale: "ja_JP" } );
		researcher = new JapaneseResearcher( mockPaper );

		expect( getSentenceBeginnings( mockPaper, researcher )[ 0 ].word ).toBe( "寿司" );
		expect( getSentenceBeginnings( mockPaper, researcher )[ 0 ].count ).toBe( 2 );
	} );

	it( "returns an object with sentence beginnings and counts for four sentences in Japanese all starting " +
		"with one of the exception words.", function() {
		// https://tatoeba.org/en/sentences/show/441382
		// https://tatoeba.org/en/sentences/show/982233
		// https://tatoeba.org/en/sentences/show/5289451
		// https://tatoeba.org/en/sentences/show/59419
		mockPaper = new Paper( "この犬は白いです。その猫は茶色です。その猫は幸せです。この犬、大きいよ。", { locale: "ja_JP" } );
		researcher = new JapaneseResearcher( mockPaper );

		expect( getSentenceBeginnings( mockPaper, researcher )[ 0 ].word ).toBe( "この 犬" );
		expect( getSentenceBeginnings( mockPaper, researcher )[ 0 ].count ).toBe( 1 );
		expect( getSentenceBeginnings( mockPaper, researcher )[ 1 ].word ).toBe( "その 猫" );
		expect( getSentenceBeginnings( mockPaper, researcher )[ 1 ].count ).toBe( 2 );
		expect( getSentenceBeginnings( mockPaper, researcher )[ 2 ].word ).toBe( "この 犬" );
		expect( getSentenceBeginnings( mockPaper, researcher )[ 2 ].count ).toBe( 1 );
	} );
} );
