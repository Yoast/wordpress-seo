import getIndicesWithRegex from "../../../../../src/languageProcessing/helpers/passiveVoice/periphrastic/getIndicesWithRegex";

describe( "Matches words from a list in sentence parts and returns them and their indices", function() {
	it( "returns the match and the index of the match ", function() {
		const sentencePart =  "It is a hands-free, voice-controlled device.";
		const regex = /([:,]|('ll)|('ve))(?=[ \n\r\t'"+\-»«‹›<>])/ig;
		expect( getIndicesWithRegex( sentencePart, regex ) ).toEqual( [ { index: 18, match: "," } ] );
	} );
} );
