import FormattingElement from "../../../src/tree/values/FormattingElement";

describe( "FormattingElement", () => {
	beforeEach( () => {
		console.warn = jest.fn();
	} );
	it( "can make a new FormattingElement object", () => {
		const formattingElement = new FormattingElement( "strong", 5, 30, { id: "some-id" } );

		expect( formattingElement.tag ).toEqual( "strong" );
		expect( formattingElement.start ).toEqual( 5 );
		expect( formattingElement.end ).toEqual( 30 );
		expect( formattingElement.attributes ).toEqual( { id: "some-id" } );
	} );

	it( "sets start position to zero when it is smaller, also gives a warning", () => {
		const formattingElement = new FormattingElement( "strong", -4, 20 );

		expect( formattingElement.start ).toEqual( 0 );
		expect( console.warn ).toBeCalled();
	} );

	it( "swaps start and end when end is smaller than start, also gives a warning", () => {
		const start = 20;
		const end = 4;
		const formattingElement = new FormattingElement( "strong", start, end );

		expect( formattingElement.start ).toEqual( end );
		expect( formattingElement.end ).toEqual( start );
		expect( console.warn ).toBeCalled();
	} );

	describe( "get attribute string", () => {
		it( "returns an empty string when having no attributes", () => {
			const formattingElement = new FormattingElement( "strong", 5, 30 );
			expect( formattingElement._getAttributeHtmlString() ).toEqual( "" );
		} );
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

		it( "can generate an HTML-string with an empty attributes object", () => {
			const attributes = { };
			const formattingElement = new FormattingElement( "b", 25, 29, attributes );

			expect( formattingElement.toHtml( "bold" ) ).toEqual(
				"<b>bold</b>"
			);
		} );

		it( "can generate an HTML-string with empty content", () => {
			const formattingElement = new FormattingElement( "b", 25, 29 );

			expect( formattingElement.toHtml() ).toEqual(
				"<b></b>"
			);
		} );
	} );
} );
