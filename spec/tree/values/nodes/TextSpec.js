import TextContainer from "../../../../src/tree/values/nodes/TextContainer";
import FormattingElement from "../../../../src/tree/values/FormattingElement";

describe( "Text tree node", () => {
	it( "can make a new Text tree node", () => {
		const formatting = [
			new FormattingElement( "a", 25, 29 ),
		];
		const text = "This is some text with a link.";
		const textContainer = new TextContainer( text, formatting );

		expect( textContainer.formatting ).toEqual( textContainer.formatting );
		expect( textContainer.text ).toEqual( text );
	} );

	it( "can generate an HTML-string from the text and accompanying formatting.", () => {
		const formatting = [
			new FormattingElement( "a", 25, 29, {
				href: "https://example.com",
			} ),
			new FormattingElement( "strong", 0, 4 ),
		];
		const text = "This is some text with a link.";
		const textContainer = new TextContainer( text, formatting );

		expect( textContainer.toHtml() ).toEqual(
			"<strong>This</strong> is some text with a <a href=\"https://example.com\">link</a>."
		);
	} );
} );
