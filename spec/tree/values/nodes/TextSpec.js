import Text from "../../../../src/tree/values/nodes/Text";
import PhrasingContent from "../../../../src/tree/values/PhrasingContent";

describe( "Text tree node", () => {
	it( "can make a new Text tree node", () => {
		const phrasingElements = [
			new PhrasingContent( "a", 25, 29 ),
		];
		const text = "This is some text with a link.";
		const textElement = new Text( text, phrasingElements );

		expect( textElement.phrasingElements ).toEqual( textElement.phrasingElements );
		expect( textElement.text ).toEqual( text );
	} );

	it( "can generate an HTML-string from the text and accompanying phrasing content.", () => {
		const phrasingElements = [
			new PhrasingContent( "a", 25, 29, {
				href: "https://example.com",
			} ),
			new PhrasingContent( "strong", 0, 4 ),
		];
		const text = "This is some text with a link.";
		const textElement = new Text( text, phrasingElements );

		expect( textElement.toHtml() ).toEqual(
			"<strong>This</strong> is some text with a <a href=\"https://example.com\">link</a>."
		);
	} );
} );
