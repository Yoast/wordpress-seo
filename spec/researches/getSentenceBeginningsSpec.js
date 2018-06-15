import changePaperFactory from "../specHelpers/paperChanger";

let Paper = require( "../../js/values/Paper.js" );
let Researcher = require( "../../js/researcher" );

describe( "gets the sentence beginnings and the count of consecutive duplicates.", function() {
	const researcher = new Researcher( new Paper() );
	const changePaper = changePaperFactory( researcher );

	const getSentenceBeginnings = researcher.getResearch.bind( researcher, "getSentenceBeginnings" );

	it( "returns an object with sentence beginnings and counts for two sentences in English starting with different words.", function() {
		changePaper( { text: "How are you? Bye!", locale: "en_US" } );
		expect( getSentenceBeginnings()[ 0 ].word ).toBe( "how" );
		expect( getSentenceBeginnings()[ 0 ].count ).toBe( 1 );
		expect( getSentenceBeginnings()[ 1 ].word ).toBe( "bye" );
		expect( getSentenceBeginnings()[ 1 ].count ).toBe( 1 );
	} );

	it( "returns an object with sentence beginnings and counts for two sentences in English starting with the same word.", function() {
		changePaper( { text: "Hey, hey! Hey.", locale: "en_US" } );
		expect( getSentenceBeginnings()[ 0 ].word ).toBe( "hey" );
		expect( getSentenceBeginnings()[ 0 ].count ).toBe( 2 );
	} );

	it( "returns an object with sentence beginnings and counts for four sentences in English , the first two starting with the same word. The fourth is starting with the same word as the first two. " +
		"The count for this word should be reset.", function() {
		changePaper( { text: "Hey, hey! Hey. Bye. Hey.", locale: "en_US" } );
		expect( getSentenceBeginnings()[ 0 ].word ).toBe( "hey" );
		expect( getSentenceBeginnings()[ 0 ].count ).toBe( 2 );
		expect( getSentenceBeginnings()[ 1 ].word ).toBe( "bye" );
		expect( getSentenceBeginnings()[ 1 ].count ).toBe( 1 );
		expect( getSentenceBeginnings()[ 2 ].word ).toBe( "hey" );
		expect( getSentenceBeginnings()[ 2 ].count ).toBe( 1 );
	} );

	it( "returns an object with sentence beginnings and counts for three sentences in English all starting with one of the exception words.", function() {
		changePaper( { text: "The boy, hey! The boy. The boy.", locale: "en_US" } );
		expect( getSentenceBeginnings()[ 0 ].word ).toBe( "the boy" );
		expect( getSentenceBeginnings()[ 0 ].count ).toBe( 3 );
	} );

	it( "returns an object with sentence beginnings and counts for three sentences in English all starting with one of the exception words. The second word of all sentences is also in the list " +
		"of exception words, which should not matter.", function() {
		changePaper( { text: "One, two, three. One, two, three. One, two, three.", locale: "en_US" } );
		expect( getSentenceBeginnings()[ 0 ].word ).toBe( "one two" );
		expect( getSentenceBeginnings()[ 0 ].count ).toBe( 3 );
	} );

	it( "returns an object with sentence beginnings and counts based on the default (English) when no locale is included.", function() {
		changePaper( { text: "The boy, hey! The boy. The boy." } );
		expect( getSentenceBeginnings()[ 0 ].word ).toBe( "the boy" );
		expect( getSentenceBeginnings()[ 0 ].count ).toBe( 3 );
	} );

	it( "returns only an exclusion word, if that is the only word in a sentences (English", function() {
		changePaper( { text: "A." } );
		expect( getSentenceBeginnings()[ 0 ].word ).toBe( "a" );
		expect( getSentenceBeginnings()[ 0 ].count ).toBe( 1 );
	} );

	it( "returns an object with sentence beginnings and counts based on the default (English) when a non-existing locale is included.", function() {
		changePaper( { text: "The boy, hey! The boy. The boy.", locale: "xx_yy" } );
		expect( getSentenceBeginnings()[ 0 ].word ).toBe( "the boy" );
		expect( getSentenceBeginnings()[ 0 ].count ).toBe( 3 );
	} );

	it( "returns an object with sentence beginnings and counts for two sentences in French starting with different words.", function() {
		changePaper( { text: "Sur le pont d'Avignon. Liberté, égalité, fraternité. ", locale: "fr_FR" } );
		expect( getSentenceBeginnings()[ 0 ].word ).toBe( "sur" );
		expect( getSentenceBeginnings()[ 0 ].count ).toBe( 1 );
		expect( getSentenceBeginnings()[ 1 ].word ).toBe( "liberté" );
		expect( getSentenceBeginnings()[ 1 ].count ).toBe( 1 );
	} );

	it( "returns an object with sentence beginnings and counts for two sentences in French starting with the same word.", function() {
		changePaper( { text: "Bonjour, tout le monde! Bonjour.", locale: "fr_FR" } );
		expect( getSentenceBeginnings()[ 0 ].word ).toBe( "bonjour" );
		expect( getSentenceBeginnings()[ 0 ].count ).toBe( 2 );
	} );

	it( "returns an object with sentence beginnings and counts for three sentences in French all starting with one of the exception words.", function() {
		changePaper( { text: "La vache qui rit. La vache qui pleure. La vache qui vole.", locale: "fr_FR" } );
		expect( getSentenceBeginnings()[ 0 ].word ).toBe( "la vache" );
		expect( getSentenceBeginnings()[ 0 ].count ).toBe( 3 );
	} );

	it( "returns an object with sentence beginnings and counts for two sentences in German starting with different words.", function() {
		changePaper( { text: "Ich bin wie du. Auf wiedersehen. ", locale: "de_DE" } );
		expect( getSentenceBeginnings()[ 0 ].word ).toBe( "ich" );
		expect( getSentenceBeginnings()[ 0 ].count ).toBe( 1 );
		expect( getSentenceBeginnings()[ 1 ].word ).toBe( "auf" );
		expect( getSentenceBeginnings()[ 1 ].count ).toBe( 1 );
	} );

	it( "returns an object with sentence beginnings and counts for two sentences in German starting with the same word.", function() {
		changePaper( { text: "Hallo, hallo! Hallo.", locale: "de_DE" } );
		expect( getSentenceBeginnings()[ 0 ].word ).toBe( "hallo" );
		expect( getSentenceBeginnings()[ 0 ].count ).toBe( 2 );
	} );

	it( "returns an object with sentence beginnings and counts for three sentences in German all starting with one of the exception words.", function() {
		changePaper( { text: "Eine kleine Nachtmusik. Eine kleine Geige. Eine kleine Wolke.", locale: "de_DE" } );
		expect( getSentenceBeginnings()[ 0 ].word ).toBe( "eine kleine" );
		expect( getSentenceBeginnings()[ 0 ].count ).toBe( 3 );
	} );

	it( "returns an object with sentence beginnings and counts for two sentences in Spanish starting with different words.", function() {
		changePaper( { text: "Vamos a la playa. Muy buenos. ", locale: "es_ES" } );
		expect( getSentenceBeginnings()[ 0 ].word ).toBe( "vamos" );
		expect( getSentenceBeginnings()[ 0 ].count ).toBe( 1 );
		expect( getSentenceBeginnings()[ 1 ].word ).toBe( "muy" );
		expect( getSentenceBeginnings()[ 1 ].count ).toBe( 1 );
	} );

	it( "returns an object with sentence beginnings and counts for two sentences in Spanish starting with the same word.", function() {
		changePaper( { text: "Que si, Que no. Que nunca te decides.", locale: "es_ES" } );
		expect( getSentenceBeginnings()[ 0 ].word ).toBe( "que" );
		expect( getSentenceBeginnings()[ 0 ].count ).toBe( 2 );
	} );

	it( "returns an object with sentence beginnings and counts for three sentences in Spanish all starting with one of the exception words.", function() {
		changePaper( { text: "Aquellas pequeñas cosas. Aquellas pequeñas decisiones. Aquellas pequeñas ideas.", locale: "es_ES" } );
		expect( getSentenceBeginnings()[ 0 ].word ).toBe( "aquellas pequeñas" );
		expect( getSentenceBeginnings()[ 0 ].count ).toBe( 3 );
	} );

	it( "returns an object with sentence beginnings and counts for two sentences in Dutch starting with different words.", function() {
		changePaper( { text: "Hallo wereld. Hoe gaat het? ", locale: "nl_NL" } );
		expect( getSentenceBeginnings()[ 0 ].word ).toBe( "hallo" );
		expect( getSentenceBeginnings()[ 0 ].count ).toBe( 1 );
		expect( getSentenceBeginnings()[ 1 ].word ).toBe( "hoe" );
		expect( getSentenceBeginnings()[ 1 ].count ).toBe( 1 );
	} );

	it( "returns an object with sentence beginnings and counts for two sentences in Dutch starting with the same word.", function() {
		changePaper( { text: "Hallo wereld. Hallo mensheid.", locale: "nl_NL" } );
		expect( getSentenceBeginnings()[ 0 ].word ).toBe( "hallo" );
		expect( getSentenceBeginnings()[ 0 ].count ).toBe( 2 );
	} );

	it( "returns an object with sentence beginnings and counts for three sentences in Dutch all starting with one of the exception words.", function() {
		changePaper( { text: "Het is een nacht die je normaal alleen in films ziet. Het is een nacht die wordt bezongen in het mooiste lied. Het is een nacht waarvan ik dacht dat ik 'm nooit beleven zou", locale: "nl_NL" } );
		expect( getSentenceBeginnings()[ 0 ].word ).toBe( "het is" );
		expect( getSentenceBeginnings()[ 0 ].count ).toBe( 3 );
	} );

	it( "returns an object with sentence beginnings and counts for two sentences in Italian starting with different words.", function() {
		changePaper( { text: "Volare, oh oh. Cantare, oh oh oh oh.", locale: "it_IT" } );
		expect( getSentenceBeginnings()[ 0 ].word ).toBe( "volare" );
		expect( getSentenceBeginnings()[ 0 ].count ).toBe( 1 );
		expect( getSentenceBeginnings()[ 1 ].word ).toBe( "cantare" );
		expect( getSentenceBeginnings()[ 1 ].count ).toBe( 1 );
	} );

	it( "returns an object with sentence beginnings and counts for two sentences in Italian starting with the same word.", function() {
		changePaper( { text: "E che dici di stare lassù. E volavo, volavo felice più in alto del sole ed ancora più su.", locale: "it_IT" } );
		expect( getSentenceBeginnings()[ 0 ].word ).toBe( "e" );
		expect( getSentenceBeginnings()[ 0 ].count ).toBe( 2 );
	} );

	it( "returns an object with sentence beginnings and counts for three sentences in Italian all starting with one of the exception words.", function() {
		changePaper( { text: "Una musica dolce. Una musica brutal. Una musica de cine.", locale: "it_IT" } );
		expect( getSentenceBeginnings()[ 0 ].word ).toBe( "una musica" );
		expect( getSentenceBeginnings()[ 0 ].count ).toBe( 3 );
	} );

	it( "returns an object with sentence beginnings and counts for two sentences in Russian starting with the same word.", function() {
		changePaper( { text: "Здравствуй, мир! Здравствуй, человек!", locale: "ru_RU" } );
		expect( getSentenceBeginnings()[ 0 ].word ).toBe( "здравствуй" );
		expect( getSentenceBeginnings()[ 0 ].count ).toBe( 2 );
	} );

	it( "returns an object with sentence beginnings and counts for three sentences in Russian all starting with one of the exception words.", function() {
		changePaper( {
			text: "Этот человек ее унизил. Этот человек ее уничтожил. Этот человек стал ее проклятием.",
			locale: "ru_RU",
		} );
		expect( getSentenceBeginnings()[ 0 ].word ).toBe( "этот человек" );
		expect( getSentenceBeginnings()[ 0 ].count ).toBe( 3 );
	} );

	it( "returns an object with sentence beginnings and counts for two sentences in Russian starting with different words.", function() {
		changePaper( { text: "Плюсы и минусы. Где в итоге лучше и почему?", locale: "ru_RU" } );
		expect( getSentenceBeginnings()[ 0 ].word ).toBe( "плюсы" );
		expect( getSentenceBeginnings()[ 0 ].count ).toBe( 1 );
		expect( getSentenceBeginnings()[ 1 ].word ).toBe( "где" );
		expect( getSentenceBeginnings()[ 1 ].count ).toBe( 1 );
	} );

	it( "returns an object with English sentence beginnings in lists", function() {
		changePaper( { text: "<ul><li>item 1</li><li>item 2</li><li>item 3</li><li>item 4</li></ul>" } );
		expect( getSentenceBeginnings()[ 0 ].word ).toBe( "item", { locale: "en_US" } );
		expect( getSentenceBeginnings()[ 0 ].count ).toBe( 4 );
	} );

	it( "returns an object with English sentence beginnings in tables", function() {
		changePaper( { text: "<table><td><tr>Sentence 1.</tr><tr>Sentence 2 that is longer.</tr><tr>Sentence 3 is shorter.</tr><tr>Sentence 4.</tr></td></table>" } );
		expect( getSentenceBeginnings()[ 0 ].word ).toBe( "sentence", { locale: "en_US" } );
		expect( getSentenceBeginnings()[ 0 ].count ).toBe( 4 );
	} );

	it( "returns an object with English sentence beginnings with paragraph tags - it should match over paragraphs", function() {
		changePaper( { text: "<p>Sentence 1. Sentence 2.</p><p>Sentence 3.</p>" } );
		expect( getSentenceBeginnings()[ 0 ].word ).toBe( "sentence", { locale: "en_US" } );
		expect( getSentenceBeginnings()[ 0 ].count ).toBe( 3 );
	} );

	it( "returns an object with English sentence beginnings in different capitalizations", function() {
		changePaper( { text: "Sentence 1. SENTENCE 2. Sentence 3." } );
		expect( getSentenceBeginnings()[ 0 ].word ).toBe( "sentence", { locale: "en_US" } );
		expect( getSentenceBeginnings()[ 0 ].count ).toBe( 3 );
	} );

	it( "returns an empty string if only enters or whitespaces in a string", function() {
		changePaper( { text: "   \n</div>", locale: "en_US" } );
		expect( getSentenceBeginnings() ).toEqual( [] );
	} );

	it( "returns an empty array if there is no sentence", function() {
		changePaper( { text: "" } );
		expect( getSentenceBeginnings() ).toEqual( [] );
	} );

	it( "returns an empty array if there is a sentence with only whitespaces", function() {
		changePaper( { text: "&nbsp;", locale: "en_US" } );
		expect( getSentenceBeginnings() ).toEqual( [] );
	} );

	it( "returns an empty array if the sentence is empty after removing HTML tags.", function() {
		changePaper( { text: '<img class="alignnone wp-image-514079 size-full" src="https://yoast-mercury.s3.amazonaws.com/uploads/2015/10/Twitter_analytics_FI.png" alt="" width="1200" height="628" />' } );
		expect( getSentenceBeginnings() ).toEqual( [] );
	} );

	it( "returns matching sentences if there is an 'empty' sentence", function() {
		changePaper( { text: "\"A sentence with multiple terminators!\"). Test one. Test two. Test three." } );
		expect( getSentenceBeginnings() ).toContainEqual( { word: "test", count: 3, sentences: [ "Test one.", "Test two.", "Test three." ] } );
	} );
} );
