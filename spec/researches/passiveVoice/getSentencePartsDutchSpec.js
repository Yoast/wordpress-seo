const getSentenceParts = require( "../../../js/researches/passiveVoice/periphrastic/getSentencePartsSplitOnStopwords.js" );

describe( "splits Dutch sentences into parts", function() {
	it( "returns a sentence part sentence parts from the auxiliary to the participle", function() {
		// Auxiliary: werd, participle: gebakken.
		const sentence = "De taart werd voor haar verjaardag gebakken.";
		expect( getSentenceParts( sentence, "nl" )[ 0 ].getSentencePartText() ).toBe( "De taart werd voor haar verjaardag gebakken." );
		expect( getSentenceParts( sentence, "nl" ).length ).toBe( 1 );
	} );

	it( "returns all sentence parts from the auxiliary to the stopword and from the stopword to the end of the sentence", function() {
		// Stopword: toen.
		const sentence = "Eerst werd ze advocaat maar toen werd ze ontslagen.";
		expect( getSentenceParts( sentence, "nl" )[ 0 ].getSentencePartText() ).toBe( "Eerst werd ze advocaat maar" );
		expect( getSentenceParts( sentence, "nl" )[ 1 ].getSentencePartText() ).toBe( "toen werd ze ontslagen." );
		expect( getSentenceParts( sentence, "nl" ).length ).toBe( 2 );
	} );

	it( "returns a sentence parts from the auxiliary to the stopword", function() {
		// Auxiliary: werden, stopword: toen.
		var sentence = "Zij werden heel blij toen ik ze een cadeautje had gekocht.";
		expect( getSentenceParts( sentence, "nl" )[ 0 ].getSentencePartText() ).toBe( "Zij werden heel blij" );
		expect( getSentenceParts( sentence, "nl" )[ 1 ].getSentencePartText() ).toBe( "toen ik ze een cadeautje had gekocht." );
		expect( getSentenceParts( sentence, "nl" ).length ).toBe( 2 );
	} );
} );
