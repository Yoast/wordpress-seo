import isPassiveSentencePart from "../../../../../src/languageProcessing/languages/it/helpers/isPassiveSentencePart";

describe( "determines whether sentence part is passive", function() {
	it( "returns true if the sentence is passive", function() {
		const sentencePart =  "I gatti vengono vaccinati.";
		const sentencePartAuxiliaries = [ "vengono" ];
		expect( isPassiveSentencePart( sentencePart, sentencePartAuxiliaries ).toBeTruthy );
	} );
	it( "returns false is the sentence is not passive", function() {
		const sentencePart =  "La ragazza ama il suo gatto.";
		const sentencePartAuxiliaries = [ "" ];
		expect( isPassiveSentencePart( sentencePart, sentencePartAuxiliaries ).toBeFalsy );
	} );
} );
