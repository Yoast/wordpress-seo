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

		expect( textContainer.formatting[ 0 ].end ).toEqual( text.length );
		expect( textContainer.formatting[ 0 ].start ).toEqual( text.length );
		expect( console.warn ).toBeCalled();
	} );

	describe( "can generate an HTML-string from the text and accompanying formatting", () => {
		it( "can generate an HTML-string from multiple formatting elements", () => {
			const formatting = [
				new FormattingElement( "strong", 0, 4 ),
				new FormattingElement( "a", 25, 29, {
					href: "https://example.com",
				} ),
			];
			const text = "This is some text with a link.";
			const textContainer = new TextContainer( text, formatting );

			expect( textContainer.toHtml() ).toEqual(
				"<strong>This</strong> is some text with a <a href=\"https://example.com\">link</a>."
			);
		} );

		it( "can generate an HTML-string with no formatting elements", () => {
			const formatting = [];
			const text = "This is some text with a link.";
			const textContainer = new TextContainer( text, formatting );

			expect( textContainer.toHtml() ).toEqual(
				"This is some text with a link."
			);
		} );

		/**
		 * Nested content does not work yet...
		 */
		it.skip( "can generate an HTML-string from multiple nested formatting elements", () => {
			const formatting = [
				new FormattingElement( "strong", 24, 37 ),
				new FormattingElement( "em", 23, 38 ),
			];
			const text = "This is some text with strong emphasis.";
			const textContainer = new TextContainer( text, formatting );

			expect( textContainer.toHtml() ).toEqual(
				"This is some text with <em><strong>strong emphasis</strong></em>."
			);
		} );
	} );
} );
