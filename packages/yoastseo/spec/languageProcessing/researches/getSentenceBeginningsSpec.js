import getSentenceBeginnings from "../../../src/languageProcessing/researches/getSentenceBeginnings";

import Paper from "../../../src/values/Paper.js";
import EnglishResearcher from "../../../src/languageProcessing/languages/en/Researcher";
import FrenchResearcher from "../../../src/languageProcessing/languages/fr/Researcher";
import SpanishResearcher from "../../../src/languageProcessing/languages/es/Researcher";
import GreekResearcher from "../../../src/languageProcessing/languages/el/Researcher";
import JapaneseResearcher from "../../../src/languageProcessing/languages/ja/Researcher";

// eslint-disable-next-line max-statements
describe( "gets the sentence beginnings and the count of consecutive duplicates.", function() {
	let mockPaper = new Paper( "How are you? Bye!" );
	let researcher = new EnglishResearcher( mockPaper );

	it( "returns an object with sentence beginnings and counts for two sentences in English starting " +
		"with different words.", function() {
		expect( getSentenceBeginnings( mockPaper, researcher )[ 0 ].word ).toBe( "how" );
		expect( getSentenceBeginnings( mockPaper, researcher )[ 0 ].count ).toBe( 1 );
		expect( getSentenceBeginnings( mockPaper, researcher )[ 1 ].word ).toBe( "bye" );
		expect( getSentenceBeginnings( mockPaper, researcher )[ 1 ].count ).toBe( 1 );
	} );

	it( "returns an object with sentence beginnings and counts for two sentences in English starting with the same word.", function() {
		mockPaper = new Paper( "Hey, hey! Hey." );
		researcher = new EnglishResearcher( mockPaper );
		expect( getSentenceBeginnings( mockPaper, researcher )[ 0 ].word ).toBe( "hey" );
		expect( getSentenceBeginnings( mockPaper, researcher )[ 0 ].count ).toBe( 2 );
	} );

	it( "returns an object with sentence beginnings and counts for four sentences in English, " +
		"the first two starting with the same word. The fourth is starting with the same word as the first two. " +
		"The count for this word should be reset.", function() {
		mockPaper = new Paper( "Hey, hey! Hey. Bye. Hey." );
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
		mockPaper = new Paper( "The boy, hey! The boy. The boy." );
		researcher = new EnglishResearcher( mockPaper );
		expect( getSentenceBeginnings( mockPaper, researcher )[ 0 ].word ).toBe( "the boy" );
		expect( getSentenceBeginnings( mockPaper, researcher )[ 0 ].count ).toBe( 3 );
	} );

	it( "returns an object with sentence beginnings and counts for three sentences in English all starting " +
		"with one of the exception words. The second word of all sentences is also in the list " +
		"of exception words, which should not matter.", function() {
		mockPaper = new Paper( "One, two, three. One, two, three. One, two, three." );
		researcher = new EnglishResearcher( mockPaper );
		expect( getSentenceBeginnings( mockPaper, researcher )[ 0 ].word ).toBe( "one two" );
		expect( getSentenceBeginnings( mockPaper, researcher )[ 0 ].count ).toBe( 3 );
	} );

	it( "returns only an exclusion word, if that is the only word in a sentence (English)", function() {
		mockPaper = new Paper( "A" );
		researcher = new EnglishResearcher( mockPaper );
		expect( getSentenceBeginnings( mockPaper, researcher )[ 0 ].word ).toBe( "a" );
		expect( getSentenceBeginnings( mockPaper, researcher )[ 0 ].count ).toBe( 1 );
	} );

	it( "returns an object with sentence beginnings and counts for sentences that start with a character with a diacritic.", function() {
		mockPaper = new Paper( "À Paris, certaines prisons sont restées célèbres. À Paris, certaines prisons " +
		"sont restées célèbres. À Paris, certaines prisons sont restées célèbres.", { locale: "fr_FR" } );
		researcher = new FrenchResearcher( mockPaper );
		expect( getSentenceBeginnings( mockPaper, researcher )[ 0 ].word ).toBe( "à" );
		expect( getSentenceBeginnings( mockPaper, researcher )[ 0 ].count ).toBe( 3 );
	} );

	it( "returns an object with English sentence beginnings in lists", function() {
		mockPaper = new Paper( "<ul><li>item 1</li><li>item 2</li><li>item 3</li><li>item 4</li></ul>" );
		researcher = new EnglishResearcher( mockPaper );
		expect( getSentenceBeginnings( mockPaper, researcher )[ 0 ].word ).toBe( "item" );
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

		expect( getSentenceBeginnings( mockPaper, researcher )[ 0 ].word ).toBe( "sentence" );
		expect( getSentenceBeginnings( mockPaper, researcher )[ 0 ].count ).toBe( 3 );
	} );

	it( "returns an object with English sentence beginnings in different capitalizations", function() {
		mockPaper = new Paper( "Sentence 1. SENTENCE 2. Sentence 3." );
		researcher = new EnglishResearcher( mockPaper );

		expect( getSentenceBeginnings( mockPaper, researcher )[ 0 ].word ).toBe( "sentence" );
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

	it( "returns an object with three sentences starting with the same word when those words are " +
		"preceded by different special characters in each sentence.", function() {
		mockPaper = new Paper( "¡Hola! ¡Hola? (¡Hola!)" );
		researcher = new SpanishResearcher( mockPaper );

		expect( getSentenceBeginnings( mockPaper, researcher )[ 0 ].word ).toBe( "hola" );
		expect( getSentenceBeginnings( mockPaper, researcher )[ 0 ].count ).toBe( 3 );
	} );

	it( "returns an object with sentence beginnings and counts for two sentences " +
		"when the sentences start with the same special character, but with different words.", function() {
		mockPaper = new Paper( "(First sentence). (Second sentence)." );
		researcher = new EnglishResearcher( mockPaper );

		expect( getSentenceBeginnings( mockPaper, researcher )[ 0 ].word ).toBe( "first" );
		expect( getSentenceBeginnings( mockPaper, researcher )[ 0 ].count ).toBe( 1 );
		expect( getSentenceBeginnings( mockPaper, researcher )[ 1 ].word ).toBe( "second" );
		expect( getSentenceBeginnings( mockPaper, researcher )[ 1 ].count ).toBe( 1 );
	} );

	it( "returns an object with sentence beginnings and counts for three sentences all starting with the same words" +
		" that are listed in first word exception list for a language that also has a list of second word exceptions", () => {
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

	it( "returns an object with sentence beginnings and counts for four sentences in a language with a custom" +
		"getWords helper (Japanese) all starting with one of the exception words.", function() {
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

