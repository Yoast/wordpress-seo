let sentenceBeginnings = require(  "../../js/researches/getSentenceBeginnings" );
let Paper = require( "../../js/values/Paper.js" );

describe( "gets the sentence beginnings and the count of consecutive duplicates.", function() {
	it( "returns an object with sentence beginnings and counts for two sentences in English starting with different words.", function() {
		let mockPaper = new Paper( "How are you? Bye!", { locale: 'en_US'} );
		expect( sentenceBeginnings( mockPaper )[0].word ).toBe( "how" );
		expect( sentenceBeginnings( mockPaper )[0].count ).toBe( 1 );
		expect( sentenceBeginnings( mockPaper )[1].word ).toBe( "bye" );
		expect( sentenceBeginnings( mockPaper )[1].count ).toBe( 1 );
	} );

	it( "returns an object with sentence beginnings and counts for two sentences in English starting with the same word.", function() {
		let mockPaper = new Paper( "Hey, hey! Hey.", { locale: 'en_US'} );
		expect( sentenceBeginnings( mockPaper )[0].word ).toBe( "hey" );
		expect( sentenceBeginnings( mockPaper )[0].count ).toBe( 2 );
	} );

	it( "returns an object with sentence beginnings and counts for four sentences in English , the first two starting with the same word. The fourth is starting with the same word as the first two. " +
		"The count for this word should be reset.", function() {
		let mockPaper = new Paper( "Hey, hey! Hey. Bye. Hey.", { locale: 'en_US'} );
		expect( sentenceBeginnings( mockPaper )[0].word ).toBe( "hey" );
		expect( sentenceBeginnings( mockPaper )[0].count ).toBe( 2 );
		expect( sentenceBeginnings( mockPaper )[1].word ).toBe( "bye" );
		expect( sentenceBeginnings( mockPaper )[1].count ).toBe( 1 );
		expect( sentenceBeginnings( mockPaper )[2].word ).toBe( "hey" );
		expect( sentenceBeginnings( mockPaper )[2].count ).toBe( 1 );
	} );

	it( "returns an object with sentence beginnings and counts for three sentences in English all starting with one of the exception words.", function() {
		let mockPaper = new Paper( "The boy, hey! The boy. The boy.", { locale: 'en_US'} );
		expect( sentenceBeginnings( mockPaper )[0].word ).toBe( "the boy" );
		expect( sentenceBeginnings( mockPaper )[0].count ).toBe( 3 );
	} );

	it( "returns an object with sentence beginnings and counts for three sentences in English all starting with one of the exception words. The second word of all sentences is also in the list " +
		"of exception words, which should not matter.", function() {
		let mockPaper = new Paper( "One, two, three. One, two, three. One, two, three.", { locale: 'en_US'} );
		expect( sentenceBeginnings( mockPaper )[0].word ).toBe( "one two" );
		expect( sentenceBeginnings( mockPaper )[0].count ).toBe( 3 );
	} );

	it( "returns an object with sentence beginnings and counts based on the default (English) when no locale is included.", function() {
		let mockPaper = new Paper( "The boy, hey! The boy. The boy." );
		expect( sentenceBeginnings( mockPaper )[0].word ).toBe( "the boy" );
		expect( sentenceBeginnings( mockPaper )[0].count ).toBe( 3 );
	} );

	it( "returns only an exclusion word, if that is the only word in a sentences (English", function() {
		let mockPaper = new Paper( "A." );
		expect( sentenceBeginnings( mockPaper )[0 ].word ).toBe( "a" );
		expect( sentenceBeginnings( mockPaper )[0 ].count ).toBe( 1 );
	} );

	it( "returns an object with sentence beginnings and counts based on the default (English) when a non-existing locale is included.", function() {
		let mockPaper = new Paper( "The boy, hey! The boy. The boy.", { locale: 'xx_yy'} );
		expect( sentenceBeginnings( mockPaper )[0].word ).toBe( "the boy" );
		expect( sentenceBeginnings( mockPaper )[0].count ).toBe( 3 );
	} );

	it( "returns an object with sentence beginnings and counts for two sentences in French starting with different words.", function() {
		let mockPaper = new Paper( "Sur le pont d'Avignon. Liberté, égalité, fraternité. ", { locale: 'fr_FR'} );
		expect( sentenceBeginnings( mockPaper )[0].word ).toBe( "sur" );
		expect( sentenceBeginnings( mockPaper )[0].count ).toBe( 1 );
		expect( sentenceBeginnings( mockPaper )[1].word ).toBe( "liberté" );
		expect( sentenceBeginnings( mockPaper )[1].count ).toBe( 1 );
	} );

	it( "returns an object with sentence beginnings and counts for two sentences in French starting with the same word.", function() {
		let mockPaper = new Paper( "Bonjour, tout le monde! Bonjour.", { locale: 'fr_FR'} );
		expect( sentenceBeginnings( mockPaper )[0].word ).toBe( "bonjour" );
		expect( sentenceBeginnings( mockPaper )[0].count ).toBe( 2 );
	} );

	it( "returns an object with sentence beginnings and counts for three sentences in French all starting with one of the exception words.", function() {
		let mockPaper = new Paper( "La vache qui rit. La vache qui pleure. La vache qui vole.", { locale: 'fr_FR'} );
		expect( sentenceBeginnings( mockPaper )[0].word ).toBe( "la vache" );
		expect( sentenceBeginnings( mockPaper )[0].count ).toBe( 3 );
	} );

	it( "returns an object with sentence beginnings and counts for two sentences in German starting with different words.", function() {
		let mockPaper = new Paper( "Ich bin wie du. Auf wiedersehen. ", { locale: 'de_DE'} );
		expect( sentenceBeginnings( mockPaper )[0].word ).toBe( "ich" );
		expect( sentenceBeginnings( mockPaper )[0].count ).toBe( 1 );
		expect( sentenceBeginnings( mockPaper )[1].word ).toBe( "auf" );
		expect( sentenceBeginnings( mockPaper )[1].count ).toBe( 1 );
	} );

	it( "returns an object with sentence beginnings and counts for two sentences in German starting with the same word.", function() {
		let mockPaper = new Paper( "Hallo, hallo! Hallo.", { locale: 'de_DE'} );
		expect( sentenceBeginnings( mockPaper )[0].word ).toBe( "hallo" );
		expect( sentenceBeginnings( mockPaper )[0].count ).toBe( 2 );
	} );

	it( "returns an object with sentence beginnings and counts for three sentences in German all starting with one of the exception words.", function() {
		let mockPaper = new Paper( "Eine kleine Nachtmusik. Eine kleine Geige. Eine kleine Wolke.", { locale: 'de_DE'} );
		expect( sentenceBeginnings( mockPaper )[0].word ).toBe( "eine kleine" );
		expect( sentenceBeginnings( mockPaper )[0].count ).toBe( 3 );
	} );

	it( "returns an object with sentence beginnings and counts for two sentences in Spanish starting with different words.", function() {
		let mockPaper = new Paper( "Vamos a la playa. Muy buenos. ", { locale: 'es_ES'} );
		expect( sentenceBeginnings( mockPaper )[0].word ).toBe( "vamos" );
		expect( sentenceBeginnings( mockPaper )[0].count ).toBe( 1 );
		expect( sentenceBeginnings( mockPaper )[1].word ).toBe( "muy" );
		expect( sentenceBeginnings( mockPaper )[1].count ).toBe( 1 );
	} );

	it( "returns an object with sentence beginnings and counts for two sentences in Spanish starting with the same word.", function() {
		let mockPaper = new Paper( "Que si, Que no. Que nunca te decides.", { locale: 'es_ES'} );
		expect( sentenceBeginnings( mockPaper )[0].word ).toBe( "que" );
		expect( sentenceBeginnings( mockPaper )[0].count ).toBe( 2 );
	} );

	it( "returns an object with sentence beginnings and counts for three sentences in Spanish all starting with one of the exception words.", function() {
		let mockPaper = new Paper( "Aquellas pequeñas cosas. Aquellas pequeñas decisiones. Aquellas pequeñas ideas.", { locale: 'es_ES'} );
		expect( sentenceBeginnings( mockPaper )[0].word ).toBe( "aquellas pequeñas" );
		expect( sentenceBeginnings( mockPaper )[0].count ).toBe( 3 );
	} );

	it( "returns an object with sentence beginnings and counts for two sentences in Dutch starting with different words.", function() {
		let mockPaper = new Paper( "Hallo wereld. Hoe gaat het? ", { locale: 'nl_NL'} );
		expect( sentenceBeginnings( mockPaper )[0].word ).toBe( "hallo" );
		expect( sentenceBeginnings( mockPaper )[0].count ).toBe( 1 );
		expect( sentenceBeginnings( mockPaper )[1].word ).toBe( "hoe" );
		expect( sentenceBeginnings( mockPaper )[1].count ).toBe( 1 );
	} );

	it( "returns an object with sentence beginnings and counts for two sentences in Dutch starting with the same word.", function() {
		let mockPaper = new Paper( "Hallo wereld. Hallo mensheid.", { locale: 'nl_NL'} );
		expect( sentenceBeginnings( mockPaper )[0].word ).toBe( "hallo" );
		expect( sentenceBeginnings( mockPaper )[0].count ).toBe( 2 );
	} );

	it( "returns an object with sentence beginnings and counts for three sentences in Dutch all starting with one of the exception words.", function() {
		let mockPaper = new Paper( "Het is een nacht die je normaal alleen in films ziet. Het is een nacht die wordt bezongen in het mooiste lied. Het is een nacht waarvan ik dacht dat ik 'm nooit beleven zou", { locale: 'nl_NL'} );
		expect( sentenceBeginnings( mockPaper )[0].word ).toBe( "het is" );
		expect( sentenceBeginnings( mockPaper )[0].count ).toBe( 3 );
	} );

	it( "returns an object with sentence beginnings and counts for two sentences in Italian starting with different words.", function() {
		let mockPaper = new Paper( "Volare, oh oh. Cantare, oh oh oh oh.", { locale: 'it_IT'} );
		expect( sentenceBeginnings( mockPaper )[0].word ).toBe( "volare" );
		expect( sentenceBeginnings( mockPaper )[0].count ).toBe( 1 );
		expect( sentenceBeginnings( mockPaper )[1].word ).toBe( "cantare" );
		expect( sentenceBeginnings( mockPaper )[1].count ).toBe( 1 );
	} );

	it( "returns an object with sentence beginnings and counts for two sentences in Italian starting with the same word.", function() {
		let mockPaper = new Paper( "E che dici di stare lassù. E volavo, volavo felice più in alto del sole ed ancora più su.", { locale: 'it_IT'} );
		expect( sentenceBeginnings( mockPaper )[0].word ).toBe( "e" );
		expect( sentenceBeginnings( mockPaper )[0].count ).toBe( 2 );
	} );

	it( "returns an object with sentence beginnings and counts for three sentences in Italian all starting with one of the exception words.", function() {
		let mockPaper = new Paper( "Una musica dolce. Una musica brutal. Una musica de cine.", { locale: 'it_IT'} );
		expect( sentenceBeginnings( mockPaper )[0].word ).toBe( "una musica" );
		expect( sentenceBeginnings( mockPaper )[0].count ).toBe( 3 );
	} );


	it( "returns an object with English sentence beginnings in lists", function() {
		let mockPaper = new Paper( "<ul><li>item 1</li><li>item 2</li><li>item 3</li><li>item 4</li></ul>" );
		expect( sentenceBeginnings( mockPaper )[ 0 ].word ).toBe( "item", { locale: 'en_US'} );
		expect( sentenceBeginnings( mockPaper )[ 0 ].count ).toBe( 4 );
	});

	it( "returns an object with English sentence beginnings in tables", function() {
		let mockPaper = new Paper( "<table><td><tr>Sentence 1.</tr><tr>Sentence 2 that is longer.</tr><tr>Sentence 3 is shorter.</tr><tr>Sentence 4.</tr></td></table>" );
		expect( sentenceBeginnings( mockPaper )[ 0 ].word ).toBe( "sentence", { locale: 'en_US'} );
		expect( sentenceBeginnings( mockPaper )[ 0 ].count ).toBe( 4 );
	});

	it( "returns an object with English sentence beginnings with paragraph tags - it should match over paragraphs", function() {
		let mockPaper = new Paper( "<p>Sentence 1. Sentence 2.</p><p>Sentence 3.</p>" );
		expect( sentenceBeginnings( mockPaper )[ 0 ].word ).toBe( "sentence", { locale: 'en_US'} );
		expect( sentenceBeginnings( mockPaper )[ 0 ].count ).toBe( 3 );
	});

	it( "returns an object with English sentence beginnings in different capitalizations", function() {
		let mockPaper = new Paper( "Sentence 1. SENTENCE 2. Sentence 3." );
		expect( sentenceBeginnings( mockPaper )[ 0 ].word ).toBe( "sentence", { locale: 'en_US'} );
		expect( sentenceBeginnings( mockPaper )[ 0 ].count ).toBe( 3 );
	});

	it( "returns an empty string if only enters or whitespaces in a string", function() {
		let mockPaper = new Paper( "   \n</div>", { locale: 'en_US'} );
		expect( sentenceBeginnings( mockPaper ) ).toEqual( [] );
	} );

	it( "returns an empty array if there is no sentence", function() {
		let mockPaper = new Paper( "", { locale: 'en_US'} );
		expect( sentenceBeginnings( mockPaper ) ).toEqual( [] );
	} );

	it( "returns an empty array if there is a sentence with only whitespaces", function() {
		let mockPaper = new Paper( "&nbsp;", { locale: 'en_US'} );
		expect( sentenceBeginnings( mockPaper ) ).toEqual( [] );
	} );

	it( "returns an empty array if the sentence is empty after removing HTML tags.", function() {
		let mockPaper = new Paper( '<img class="alignnone wp-image-514079 size-full" src="https://yoast-mercury.s3.amazonaws.com/uploads/2015/10/Twitter_analytics_FI.png" alt="" width="1200" height="628" />' );
		expect( sentenceBeginnings( mockPaper ) ).toEqual( [] );
	} );

	it( "returns matching sentences if there is an 'empty' sentence", function() {
		let mockPaper = new Paper( "\"A sentence with multiple terminators!\"). Test one. Test two. Test three." );
		expect( sentenceBeginnings( mockPaper ) ).toContainEqual( { word: 'test', count: 3, sentences: [ "Test one.", "Test two.", "Test three."] } );
	} );
} );
