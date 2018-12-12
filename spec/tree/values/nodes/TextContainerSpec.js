import TextContainer from "../../../../src/tree/values/nodes/TextContainer";
import FormattingElement from "../../../../src/tree/values/FormattingElement";

describe( "TextContainer", () => {
	beforeEach( () => {
		console.warn = jest.fn();
	} );

	it( "can make a new TextContainer", () => {
		const formatting = [
			new FormattingElement( "a", 25, 29 ),
		];
		const text = "This is some text with a link.";
		const textContainer = new TextContainer( text, formatting );

		expect( textContainer.formatting ).toEqual( textContainer.formatting );
		expect( textContainer.text ).toEqual( text );
	} );

	it( "fixes the end and start positions to the length of the text, when it is too large (should also give a warning)", () => {
		const formatting = [
			new FormattingElement( "strong", 25, 29 ),
			new FormattingElement( "strong", 0, 5 ),
		];
		// Text smaller than end position of formatting element.
		const text = "Some text.";
		const textContainer = new TextContainer( text, formatting );

		expect( textContainer.formatting[ 0 ].endIndex ).toEqual( text.length );
		expect( textContainer.formatting[ 0 ].startIndex ).toEqual( text.length );
		expect( console.warn ).toBeCalled();
	} );

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
