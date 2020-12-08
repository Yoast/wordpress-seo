import getSentenceParts from "../../../../../src/languageProcessing/helpers/passiveVoice/periphrastic/getSentenceParts.js";
import arrayToRegex from "../../../../../src/languageProcessing/helpers/regex/createRegexFromArray";
import SentencePart from "../../../../../src/values/SentencePart";

const options1 = {
	SentencePart: SentencePart,
	stopwords: [ "to", "which", "who", "whom", "that" ],
	auxiliaries: [ "am", "is", "are", "est", "es", "sont" ],
	ingExclusions: [ "king", "cling", "ring", "being", "thing", "something", "anything" ],
	regexes: {
		auxiliaryRegex: arrayToRegex( [ "am", "is", "are", "est", "es", "sont" ] ),
		stopCharacterRegex: /([:,]|('ll)|('ve))(?=[ \n\r\t'"+\-»«‹›<>])/ig,
		verbEndingInIngRegex: /\w+ing(?=$|[ \n\r\t.,'()"+\-;!?:/»«‹›<>])/ig,
		followingAuxiliaryExceptionRegex: arrayToRegex( [ "le", "la", "les", "el" ] ),
		directPrecedenceExceptionRegex: arrayToRegex( [ "se", "me", "te", "s'y" ] ),
		elisionAuxiliaryExceptionRegex: arrayToRegex( [ "c'", "s'", "peut-" ], true ),
	},
};

const options2 = {
	SentencePart: SentencePart,
	auxiliaries: [ "am", "is", "are", "est", "es", "sont" ],
	stopwords: [ "to", "which", "who", "whom", "that" ],
	regexes: {
		auxiliaryRegex: arrayToRegex( [ "am", "is", "are", "est", "es", "sont" ] ),
		stopCharacterRegex: /([:,]|('ll)|('ve))(?=[ \n\r\t'"+\-»«‹›<>])/ig,
	},
};

const options3 = {
	SentencePart: SentencePart,
	auxiliaries: [ "am", "is", "are", "est", "es", "sont" ],
	stopwords: [ "to", "which", "who", "whom", "that" ],
	regexes: {
		auxiliaryRegex: arrayToRegex( [ "am", "is", "are", "est", "es", "sont" ] ),
		stopCharacterRegex: /([:,]|('ll)|('ve))(?=[ \n\r\t'"+\-»«‹›<>])/ig,
		followingAuxiliaryExceptionRegex: arrayToRegex( [ "le", "la", "les", "el" ] ),
	},
};

describe( "splits sentences into parts", function() {
	it( "returns the sentence parts that are passive", function() {
		const sentence =  "He is banned from the cafe.";
		expect( getSentenceParts( sentence, options1 )[ 0 ].getSentencePartText() ).toBe( "is banned from the cafe." );
		expect( getSentenceParts( sentence, options1 ).length ).toBe( 1 );
	} );
	it( "filters out sentence parts without auxiliary", function() {
		const sentence = "The English are always throwing parties.";
		expect( getSentenceParts( sentence, options1 )[ 0 ].getSentencePartText() ).toBe( "are always" );
		expect( getSentenceParts( sentence, options1 ).length ).toBe( 1 );
	} );
	it( "returns empty array if no auxiliary present in the sentence", function() {
		const sentence = "A comely lord.";
		expect( getSentenceParts( sentence, options1 ) ).toEqual( [] );
	} );
	it( "doesn't return sentence parts when an auxiliary is followed by a word from the followingAuxiliaryExceptionWords list", function() {
		// Exception word after auxiliary: le.
		const sentence = "C'est le film le plus vu.";
		expect( getSentenceParts( sentence, options1 ).length ).toBe( 0 );
	} );
	it( "doesn't return sentence parts when an auxiliary is preceded by a reflexive pronoun", function() {
		const sentence = "Ils se sont lavés.";
		expect( getSentenceParts( sentence, options1 ).length ).toBe( 0 );
	} );
	it( "doesn't return sentence parts when an auxiliary is preceded by an elided reflexive pronoun", function() {
		const sentence = "L’emballement s'est prolongé mardi 9 janvier.";
		expect( getSentenceParts( sentence, options1 ).length ).toBe( 0 );
	} );
	it( "doesn't split on sentence breakers within words", function() {
		// Sentence breaker: 'is' in 'praise'.
		const sentence = "Commented is praise due.";
		expect( getSentenceParts( sentence, options1 )[ 0 ].getSentencePartText() ).toBe( "is praise due." );
		expect( getSentenceParts( sentence, options1 ).length ).toBe( 1 );
	} );
	it( "splits sentences on stop characters", function() {
		const sentence = "It is a hands-free, voice-controlled device.";
		expect( getSentenceParts( sentence, options1 )[ 0 ].getSentencePartText() ).toBe( "is a hands-free" );
		expect( getSentenceParts( sentence, options1 ).length ).toBe( 1 );
	} );
	it( "doesn't split sentences on stop characters that are not preceded by a word and also not followed by a space/punctuation mark", function() {
		const sentence = "It is a 1,000,000 dollar house.";
		expect( getSentenceParts( sentence, options1 )[ 0 ].getSentencePartText() ).toBe( "is a 1,000,000 dollar house." );
		expect( getSentenceParts( sentence, options1 ).length ).toBe( 1 );
	} );
	it( "splits sentences on stop characters when followed by a punctuation mark", function() {
		const sentence = "\"This is it\", he said.";
		expect( getSentenceParts( sentence, options1 )[ 0 ].getSentencePartText() ).toBe( "is it\"" );
		expect( getSentenceParts( sentence, options1 ).length ).toBe( 1 );
	} );
	it( "doesn't return sentence parts when an auxiliary is followed by a word from the followingAuxiliaryExceptionWords list", function() {
		// Exception word after auxiliary: el.
		const sentence = "Es el capítulo preferido de varios miembros del equipo de producción.";
		expect( getSentenceParts( sentence, options1 ).length ).toBe( 0 );
	} );
	it( "returns the sentence parts that are passive", function() {
		const sentence =  "She is wooed.";
		expect( getSentenceParts( sentence, options2 )[ 0 ].getSentencePartText() ).toBe( "is wooed." );
		expect( getSentenceParts( sentence, options2 ).length ).toBe( 1 );
	} );
	it( "doesn't return sentence parts when an auxiliary is followed by a word from the followingAuxiliaryExceptionWords list", function() {
		// Exception word after auxiliary: le.
		const sentence = "C'est le film le plus vu.";
		expect( getSentenceParts( sentence, options3 ).length ).toBe( 0 );
	} );
} );
