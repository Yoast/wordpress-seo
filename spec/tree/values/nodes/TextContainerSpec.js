import TextContainer from "../../../../src/tree/values/nodes/TextContainer";
import FormattingElement from "../../../../src/tree/values/FormattingElement";

describe( "TextContainer", () => {
	describe( "constructor", () => {
		it( "can make a new TextContainer", () => {
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
} );
