import isPassiveSentence from "../../../../../src/languageProcessing/languages/ru/helpers/isPassiveSentence";

describe( "determines whether sentence part is passive", function() {
	it( "returns true if the sentence is passive", function() {
		const sentencePart =  "Кошек удочерила добрая женщина.";
		expect( isPassiveSentence( sentencePart ).toBeTruthy );
	} );
	it( "returns false is the sentence is not passive", function() {
		const sentencePart = "Девушка любит своих кошек.";
		expect( isPassiveSentence( sentencePart ).toBeFalsy );
	} );
} );
