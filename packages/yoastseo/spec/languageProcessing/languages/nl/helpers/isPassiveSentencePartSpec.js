import isPassiveSentencePart from "../../../../../src/languageProcessing/languages/nl/helpers/isPassiveSentencePart";

describe( "determines whether sentence part is passive", function() {
	it( "returns true if the sentence is passive", function() {
		const sentencePart =  "De kat werd geadopteerd";
		const sentencePartAuxiliaries = [ "werd" ];
		expect( isPassiveSentencePart( sentencePart, sentencePartAuxiliaries ).toBeTruthy );
	} );
	it( "returns false is the sentence is not passive", function() {
		const sentencePart =  "De vrouw heeft de kat geadopteerd.";
		const sentencePartAuxiliaries = [];
		expect( isPassiveSentencePart( sentencePart, sentencePartAuxiliaries ).toBeFalsy );
	} );
} );
