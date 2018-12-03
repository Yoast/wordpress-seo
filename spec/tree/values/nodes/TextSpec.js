import TextContainer from "../../../../src/tree/values/nodes/TextContainer";
import PhrasingContent from "../../../../src/tree/values/PhrasingContent";

describe( "Text tree node", () => {
	it( "can make a new Text tree node", () => {
		const phrasingElements = [
			new PhrasingContent( "a", 25, 29 ),
		];
		const text = "This is some text with a link.";
		const textContainer = new TextContainer( text, phrasingElements );

		expect( textContainer.phrasingElements ).toEqual( textContainer.phrasingElements );
		expect( textContainer.text ).toEqual( text );
	} );

	it( "can generate an HTML-string from the text and accompanying phrasing content.", () => {
		const phrasingElements = [
			new PhrasingContent( "a", 25, 29, {
				href: "https://example.com",
			} ),
			new PhrasingContent( "strong", 0, 4 ),
		];
		const text = "This is some text with a link.";
		const textContainer = new TextContainer( text, phrasingElements );

		expect( textContainer.toHtml() ).toEqual(
			"<strong>This</strong> is some text with a <a href=\"https://example.com\">link</a>."
		);
	} );
} );
