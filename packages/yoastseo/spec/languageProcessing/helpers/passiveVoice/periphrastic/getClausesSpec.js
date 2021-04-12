import getClauses from "../../../../../src/languageProcessing/helpers/passiveVoice/periphrastic/getClauses.js";
import arrayToRegex from "../../../../../src/languageProcessing/helpers/regex/createRegexFromArray";
import Clause from "../../../../../src/values/Clause";

const options1 = {
	Clause: Clause,
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
	Clause: Clause,
	auxiliaries: [ "am", "is", "are", "est", "es", "sont" ],
	stopwords: [ "to", "which", "who", "whom", "that" ],
	regexes: {
		auxiliaryRegex: arrayToRegex( [ "am", "is", "are", "est", "es", "sont" ] ),
		stopCharacterRegex: /([:,]|('ll)|('ve))(?=[ \n\r\t'"+\-»«‹›<>])/ig,
	},
};

const options3 = {
	Clause: Clause,
	auxiliaries: [ "am", "is", "are", "est", "es", "sont" ],
	stopwords: [ "to", "which", "who", "whom", "that" ],
	regexes: {
		auxiliaryRegex: arrayToRegex( [ "am", "is", "are", "est", "es", "sont" ] ),
		stopCharacterRegex: /([:,]|('ll)|('ve))(?=[ \n\r\t'"+\-»«‹›<>])/ig,
		followingAuxiliaryExceptionRegex: arrayToRegex( [ "le", "la", "les", "el" ] ),
	},
};

describe( "splits sentences into clauses", function() {
	it( "filters out clauses without auxiliary", function() {
		const sentence = "The English are always throwing parties.";
		expect( getClauses( sentence, options1 )[ 0 ].getClauseText() ).toBe( "are always" );
		expect( getClauses( sentence, options1 )[ 0 ].isPassive() ).toBe( false );
		expect( getClauses( sentence, options1 ).length ).toBe( 1 );
	} );
	it( "returns empty array if no auxiliary present in the sentence", function() {
		const sentence = "A comely lord.";
		expect( getClauses( sentence, options1 ) ).toEqual( [] );
	} );
	it( "doesn't return clauses when an auxiliary is preceded by a reflexive pronoun", function() {
		const sentence = "Ils se sont lavés.";
		expect( getClauses( sentence, options1 ).length ).toBe( 0 );
	} );
	it( "doesn't return clauses when an auxiliary is preceded by an elided reflexive pronoun", function() {
		const sentence = "L’emballement s'est prolongé mardi 9 janvier.";
		expect( getClauses( sentence, options1 ).length ).toBe( 0 );
	} );
	it( "doesn't split on sentence breakers within words", function() {
		// Sentence breaker: 'is' in 'praise'.
		const sentence = "Commented is praise due.";
		expect( getClauses( sentence, options1 )[ 0 ].getClauseText() ).toBe( "is praise due." );
		expect( getClauses( sentence, options1 ).length ).toBe( 1 );
	} );
	it( "splits sentences on stop characters", function() {
		const sentence = "It is a hands-free, voice-controlled device.";
		expect( getClauses( sentence, options1 )[ 0 ].getClauseText() ).toBe( "is a hands-free" );
		expect( getClauses( sentence, options1 ).length ).toBe( 1 );
	} );
	it( "doesn't split sentences on stop characters that are not preceded by a word and also not followed by a space/punctuation mark", function() {
		const sentence = "It is a 1,000,000 dollar house.";
		expect( getClauses( sentence, options1 )[ 0 ].getClauseText() ).toBe( "is a 1,000,000 dollar house." );
		expect( getClauses( sentence, options1 ).length ).toBe( 1 );
	} );
	it( "splits sentences on stop characters when followed by a punctuation mark", function() {
		const sentence = "\"This is it\", he said.";
		expect( getClauses( sentence, options1 )[ 0 ].getClauseText() ).toBe( "is it\"" );
		expect( getClauses( sentence, options1 ).length ).toBe( 1 );
	} );
	it( "doesn't return sentence parts when an auxiliary is followed by a word from the followingAuxiliaryExceptionWords list", function() {
		// Exception word after auxiliary: el.
		let sentence = "Es el capítulo preferido de varios miembros del equipo de producción.";
		expect( getClauses( sentence, options1 ).length ).toBe( 0 );
		// Exception word after auxiliary: le.
		sentence = "C'est le film le plus vu.";
		expect( getClauses( sentence, options1 ).length ).toBe( 0 );
	} );
	it( "returns clauses when there is no directPrecedenceException and followingAuxiliaryExceptionWords lists available", function() {
		const sentence =  "The cat is vaccinated.";
		expect( getClauses( sentence, options2 )[ 0 ].getClauseText() ).toBe( "is vaccinated." );
		expect( getClauses( sentence, options2 ).length ).toBe( 1 );
	} );
	it( "doesn't return clauses when an auxiliary is followed by a word from the followingAuxiliaryExceptionWords list " +
		"and when the directPrecedenceException list is not available.", function() {
		// Exception word after auxiliary: le.
		const sentence = "C'est le film le plus vu.";
		expect( getClauses( sentence, options3 ).length ).toBe( 0 );
	} );
} );
