import isPassiveSentencePart from "../../../../../src/languageProcessing/languages/hu/helpers/isPassiveSentencePart";

describe( "determines whether sentence part is passive", function() {
	it( "returns true if the sentence is passive", function() {
		const sentencePart =  "Ki van plakátolva a képe";
		const sentencePartAuxiliaries = [ "van" ];
		expect( isPassiveSentencePart( sentencePart, sentencePartAuxiliaries ).toBeTruthy );
	} );
	it( "returns false is the sentence is not passive", function() {
		const sentencePart =  "Teát iszom.";
		const sentencePartAuxiliaries = [ "" ];
		expect( isPassiveSentencePart( sentencePart, sentencePartAuxiliaries ).toBeFalsy );
	} );
} );
