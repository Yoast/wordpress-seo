import isPassiveSentencePart from "../../../../../src/languageProcessing/languages/fr/helpers/isPassiveSentencePart";

describe( "determines whether sentence part is passive", function() {
	it( "returns true if the sentence is passive", function() {
		const sentencePart =  "Le chat a été amené chez le vétérinaire.";
		const sentencePartAuxiliaries = [ "été" ];
		expect( isPassiveSentencePart( sentencePart, sentencePartAuxiliaries ).toBeTruthy );
	} );
	it( "returns false is the sentence is not passive", function() {
		const sentencePart =  "La fille a amené le chat chez le vétérinaire.";
		const sentencePartAuxiliaries = [];
		expect( isPassiveSentencePart( sentencePart, sentencePartAuxiliaries ).toBeFalsy );
	} );
} );
