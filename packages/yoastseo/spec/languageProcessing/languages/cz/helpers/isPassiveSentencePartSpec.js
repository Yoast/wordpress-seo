import isPassiveSentencePart from "../../../../../src/languageProcessing/languages/cz/helpers/isPassiveSentencePart";

describe( "determines whether sentence part is passive", function() {
	it( "returns true if the sentence is passive", function() {
		const sentencePart =  "On byl doporučen k lékaři.";
		const sentencePartAuxiliaries = [ "byl" ];
		expect( isPassiveSentencePart( sentencePart, sentencePartAuxiliaries ).toBeTruthy );
	} );
	it( "returns false is the sentence is not passive", function() {
		const sentencePart =  "Dorazil doktor.";
		const sentencePartAuxiliaries = [ "" ];
		expect( isPassiveSentencePart( sentencePart, sentencePartAuxiliaries ).toBeFalsy );
	} );
} );
