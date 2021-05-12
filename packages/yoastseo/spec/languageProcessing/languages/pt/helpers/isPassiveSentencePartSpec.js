import isPassiveSentencePart from "../../../../../src/languageProcessing/languages/pt/helpers/isPassiveSentencePart";

describe( "determines whether sentence part is passive", function() {
	it( "returns true if the sentence is passive", function() {
		const sentencePart =  "Os gatos são amados.";
		const sentencePartAuxiliaries = [ "são" ];
		expect( isPassiveSentencePart( sentencePart, sentencePartAuxiliaries ).toBeTruthy );
	} );
	it( "returns false is the sentence is not passive", function() {
		const sentencePart =  "A garota ama seus gatos.";
		const sentencePartAuxiliaries = [ "" ];
		expect( isPassiveSentencePart( sentencePart, sentencePartAuxiliaries ).toBeFalsy );
	} );
} );
