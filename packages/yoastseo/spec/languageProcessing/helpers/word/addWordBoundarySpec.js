import addWordBoundary from "../../../../src/languageProcessing/helpers/word/addWordboundary";

describe( "a test adding word boundaries to a string", function() {
	const wordBoundary = " \\u00a0\\u2014\\u06d4\\u061f\\u060C\\u061B\\n\\r\\t.,()”“〝〞〟‟„\"+\\-;!¡?¿:/»«‹›";

	it( "adds start and end boundaries", function() {
		expect( addWordBoundary( "keyword" ) ).toEqual(
			"(^|[" + wordBoundary + "<>'‘’‛`])" +
			"keyword($|([" + wordBoundary + "<>])|((['‘’‛`])" +
			"([" + wordBoundary + "<>])))"
		);
	} );
	it( "adds start and end boundaries and an extra boundary", function() {
		expect( addWordBoundary( "keyword", false, "#" ) ).toEqual(
			"(^|[" + wordBoundary + "#<>'‘’‛`])" +
			"keyword($|([" + wordBoundary + "#<>])|((['‘’‛`])" +
			"([" + wordBoundary + "#<>])))"
		);
	} );
	it( "adds start boundaries, and end boundaries with positive lookahead", function() {
		expect( addWordBoundary( "keyword", true, "" ) ).toEqual(
			"(^|[" + wordBoundary + "<>'‘’‛`])" +
			"keyword($|((?=[" + wordBoundary + "<>]))|((['‘’‛`])" +
			"([" + wordBoundary + "<>])))"
		);
	} );
	it( "adds start boundaries with an extra boundary, and end boundaries with positive lookahead and an extra boundary", function() {
		expect( addWordBoundary( "keyword", true, "#" ) ).toEqual(
			"(^|[" + wordBoundary + "#<>'‘’‛`])" +
			"keyword($|((?=[" + wordBoundary + "#<>]))|((['‘’‛`])" +
			"([" + wordBoundary + "#<>])))"
		);
	} );
	it( "uses a word boundary excluding - when the locale is Indonesian", function() {
		const idWordBoundary = " \\u00a0\\n\\r\\t.,()”“〝〞〟‟„\"+;!¡?¿:/»«‹›";
		expect( addWordBoundary( "keyword", false, "", "id_ID" ) ).toEqual(
			"(^|[" + idWordBoundary + "<>'‘’‛`])" +
			"keyword($|([" + idWordBoundary + "<>])|((['‘’‛`])" +
			"([" + idWordBoundary + "<>])))"
		);
	} );
} );
