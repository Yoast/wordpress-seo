import isPassiveSentencePart from "../../../../../src/languageProcessing/languages/en/helpers/isPassiveSentencePart";

describe( "determines whether sentence part is passive", function() {
	it( "returns true if the sentence is passive", function() {
		const sentencePart =  "The cats are vaccinated.";
		const sentencePartAuxiliaries = [ "are" ];
		expect( isPassiveSentencePart( sentencePart, sentencePartAuxiliaries ).toBeTruthy );
	} );
	it( "returns false is the sentence is not passive", function() {
		const sentencePart =  "The girl loves her cat.";
		const sentencePartAuxiliaries = [ "" ];
		expect( isPassiveSentencePart( sentencePart, sentencePartAuxiliaries ).toBeFalsy );
	} );
} );
