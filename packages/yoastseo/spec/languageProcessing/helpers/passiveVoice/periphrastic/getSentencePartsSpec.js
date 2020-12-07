import getSentenceParts from "../../../../../src/languageProcessing/helpers/passiveVoice/periphrastic/getSentenceParts.js";
import arrayToRegex from "../../../../../src/languageProcessing/helpers/regex/createRegexFromArray";
import SentencePart from "../../../../../src/values/SentencePart";
const options = {
	SentencePart: SentencePart,
	stopwords: [ "to", "which", "who", "whom", "that" ],
	auxiliaries: [ "am", "is", "are" ],
	ingExclusions: [ "king", "cling", "ring", "being", "thing", "something", "anything" ],
	regexes: {
		auxiliaryRegex: arrayToRegex( [ "am", "is", "are" ] ),
		stopCharacterRegex: /([:,]|('ll)|('ve))(?=[ \n\r\t'"+\-»«‹›<>])/ig,
		verbEndingInIngRegex: /\w+ing(?=$|[ \n\r\t.,'()"+\-;!?:/»«‹›<>])/ig,
	},
};


describe( "splits sentences into parts", function() {
	it( "returns all sentence parts", function() {
		const sentence =  "They are earned and expected.";
		expect( getSentenceParts( sentence, options )._sentencePartText ).toEqual( [ "are earned and expected." ] );
		expect( getSentenceParts( sentence, options ).length ).toBe( 1 );
	} );
	it( "splits sentences that begin with a stopword into sentence parts", function() {
		const sentence =  "und 1933 hatte sie intensiven Kontakt zur Erzabtei Beuron werden.";
		expect( getSentenceParts( sentence, options ) ).toEqual( [ "und 1933 hatte sie intensiven Kontakt zur Erzabtei Beuron." ] );
	} );
} );
