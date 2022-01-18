import processExactMatchRequest from "../../../../src/languageProcessing/helpers/match/processExactMatchRequest";

describe( "a test for processing exact match request for a keyphrase", function() {
	it( "returns the result for when the keyphrase is not enclosed in double quotes", function() {
		const keyphrase = "keyphrase";
		expect( processExactMatchRequest( keyphrase ) ).toEqual( {
			exactMatchRequested: false,
			keyphrase: "keyphrase",
		} );
	} );
	it( "returns the result for when the keyphrase is enclosed in double quotes", function() {
		const keyphrase = "“keyphrase”";
		expect( processExactMatchRequest( keyphrase ) ).toEqual( {
			exactMatchRequested: true,
			keyphrase: "keyphrase",
		} );
	} );
	it( "returns the result for when the keyphrase is enclosed in Japanese double quotes", function() {
		const keyphrase = "「小さい花の刺繍」";
		expect( processExactMatchRequest( keyphrase ) ).toEqual( {
			exactMatchRequested: true,
			keyphrase: "小さい花の刺繍",
		} );
	} );
	it( "returns the result for when the Japanese keyphrase is enclosed in latin double quotes", function() {
		const keyphrase = "\"小さい花の刺繍\"";
		expect( processExactMatchRequest( keyphrase ) ).toEqual( {
			exactMatchRequested: true,
			keyphrase: "小さい花の刺繍",
		} );
	} );
	it( "doesn't break when the keyphrase is empty", function() {
		const keyphrase = "";
		expect( processExactMatchRequest( keyphrase ) ).toEqual( {
			exactMatchRequested: false,
			keyphrase: "",
		} );
	} );
} );
