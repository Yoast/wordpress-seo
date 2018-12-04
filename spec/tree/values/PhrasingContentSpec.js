import FormattingElement from "../../../src/tree/values/FormattingElement";

describe( "FormattingElement", () => {
	it( "can make a new FormattingElement object", () => {
		const formattingElement = new FormattingElement( "strong", 5, 30, { id: "some-id" } );

		expect( formattingElement.tag ).toEqual( "strong" );
		expect( formattingElement.start ).toEqual( 5 );
		expect( formattingElement.end ).toEqual( 30 );
		expect( formattingElement.attributes ).toEqual( { id: "some-id" } );
	} );

	describe( "to HTML-string", () => {
		it( "can generate an HTML-string", () => {
			const formattingElement = new FormattingElement( "a", 25, 29, {
				href: "https://example.com",
			} );

			expect( formattingElement.toHtml( "some link" ) ).toEqual(
				"<a href=\"https://example.com\">some link</a>"
			);
		} );

		it( "can generate an HTML-string with no attributes", () => {
			const formattingElement = new FormattingElement( "strong", 25, 29 );

			expect( formattingElement.toHtml( "some link" ) ).toEqual(
				"<strong>some link</strong>"
			);
		} );

		it( "can generate an HTML-string with no attributes", () => {
			const formattingElement = new FormattingElement( "strong", 25, 29 );

			expect( formattingElement.toHtml( "some link" ) ).toEqual(
				"<strong>some link</strong>"
			);
		} );

		it( "can generate an HTML-string of a self-closing HTML-element", () => {
			const attributes = {
				src: "https://example.com/image.png",
				alt: "",
			};
			const formattingElement = new FormattingElement( "img", 25, 29, attributes, true );

			expect( formattingElement.toHtml() ).toEqual(
				"<img src=\"https://example.com/image.png\" alt=\"\"/>"
			);
		} );
	} );
} );
