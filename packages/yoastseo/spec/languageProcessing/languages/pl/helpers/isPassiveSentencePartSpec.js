import isPassiveSentencePart from "../../../../../src/languageProcessing/languages/pl/helpers/isPassiveSentencePart";

describe( "determines whether sentence part is passive", function() {
	it( "returns true if the sentence is passive", function() {
		const sentencePart = "Koty są kochane.";
		const sentencePartAuxiliaries = [ "są" ];
		expect( isPassiveSentencePart( sentencePart, sentencePartAuxiliaries ).toBeTruthy );
	} );
	it( "returns false is the sentence is not passive", function() {
		const sentencePart = "Dziewczyna bardzo kocha swojego kota.";
		const sentencePartAuxiliaries = [];
		expect( isPassiveSentencePart( sentencePart, sentencePartAuxiliaries ).toBeFalsy );
	} );
} );
