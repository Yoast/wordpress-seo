import PhrasingContent from "../../../src/tree/values/PhrasingContent";

describe( "PhrasingContent", () => {
	it( "can make a new PhrasingContent object", () => {
		const phrasingElement = new PhrasingContent( "strong", 5, 30, { id: "some-id" } );

		expect( phrasingElement.tag ).toEqual( "strong" );
		expect( phrasingElement.start ).toEqual( 5 );
		expect( phrasingElement.end ).toEqual( 30 );
		expect( phrasingElement.attributes ).toEqual( { id: "some-id" } );
	} );

	describe( "to HTML-string", () => {
		it( "can generate an HTML-string", () => {
			const phrasingElement = new PhrasingContent( "a", 25, 29, {
				href: "https://example.com",
			} );

			expect( phrasingElement.toHtml( "some link" ) ).toEqual(
				"<a href='https://example.com'>some link</a>"
			);
		} );

		it( "can generate an HTML-string with no attributes", () => {
			const phrasingElement = new PhrasingContent( "strong", 25, 29 );

			expect( phrasingElement.toHtml( "some link" ) ).toEqual(
				"<strong>some link</strong>"
			);
		} );
	} );
} );
