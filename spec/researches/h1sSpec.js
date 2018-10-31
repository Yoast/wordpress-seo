import h1s from "../../src/researches/h1s.js";
import Paper from "../../src/values/Paper.js";

describe( "Gets all H1s in the text", function() {
	it( "should return empty when there is no H1", function() {
		const mockPaper = new Paper( "some content<h2>content h2</h2>" );
		expect( h1s( mockPaper ) ).toEqual( [] );
	} );

	it( "should return all H1s in the text", function() {
		const mockPaper = new Paper( "<h1>first h1</h1><p>not an h1</p><h1>second h1</h1><h2>not an h1</h2>" );

		expect( h1s( mockPaper ) ).toEqual( [
			{ tag: "h1", content: "first h1", position: 0 },
			{ tag: "h1", content: "second h1", position: 2 },
		] );
	} );
} );
