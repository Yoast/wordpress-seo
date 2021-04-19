import TextContainer from "../../../../src/parsedPaper/structure/tree/TextContainer";

describe( "TextContainer", () => {
	describe( "constructor", () => {
		it( "creates a new TextContainer", () => {
			const textContainer = new TextContainer();

			expect( textContainer instanceof TextContainer ).toEqual( true );
			expect( textContainer.text ).toEqual( "" );
			expect( textContainer.formatting ).toEqual( [] );
		} );
	} );

	describe( "appendText", () => {
		it( "appends text to the text container", () => {
			const text = "Some text.";
			const moreText = " And more text.";
			const textContainer = new TextContainer();

			textContainer.appendText( text );
			expect( textContainer.text ).toEqual( text );
			textContainer.appendText( moreText );
			expect( textContainer.text ).toEqual( text + moreText );
			expect( textContainer.text ).toEqual( "Some text. And more text." );
		} );
	} );

	describe( "getTree", () => {
		it( "creates a linguistic tree", () => {
			const textContainer = new TextContainer();
			const text = "A sentence. Another sentence.";
			textContainer.appendText( text );
			expect( textContainer.getTree() ).toEqual(
				[
					{ endIndex: 10, startIndex: 0, text: "A sentence.", words: [] },
					{ endIndex: 28, startIndex: 12, text: "Another sentence.", words: [] },
				]
			);
		} );
	} );
} );
