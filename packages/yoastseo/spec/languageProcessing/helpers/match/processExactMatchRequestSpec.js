import processExactMatchRequest from "../../../../src/languageProcessing/helpers/match/processExactMatchRequest";

describe( "a test for processing exact match request for a keyphrase", function() {
	it( "returns the result for when the keyphrase is not enclosed in double quotes", function() {
		const keyphrase = "keyphrase";
		const doubleQuotes = [ "“", "”", "〝", "〞", "〟", "‟", "„", "\"" ];
		expect( processExactMatchRequest( keyphrase, doubleQuotes ) ).toEqual( {
			exactMatchRequested: false,
			keyphrase: "keyphrase",
		} );
	} );
	it( "returns the result for when the keyphrase is enclosed in double quotes", function() {
		const keyphrase = "“keyphrase”";
		const doubleQuotes = [ "“", "”", "〝", "〞", "〟", "‟", "„", "\"" ];
		expect( processExactMatchRequest( keyphrase, doubleQuotes ) ).toEqual( {
			exactMatchRequested: true,
			keyphrase: "keyphrase",
		} );
	} );
} );
