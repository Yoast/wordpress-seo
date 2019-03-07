import UrlStructure from "../../src/stringProcessing/urlStructure";

describe( "UrlStructure", () => {
	it( "accepts a url structure", () => {
		const expected = "http://example.org/structure/";
		const input = expected;

		const urlStructure = new UrlStructure( input );

		expect( urlStructure.getStructure() ).toBe( expected );
	} );

	describe( "parseUrl", () => {
		it( "parses a URL and builds a data structure from it", () => {
			const expected = [
				{
					type: "static",
					value: "http://example.org/",
				},
				{
					type: "variable",
					value: "%%placeholder%%",
					name: "placeholder",
				},
				{
					type: "static",
					value: "/staticstuff/",
				},
				{
					type: "variable",
					value: "%%another%%",
					name: "another",
				},
			];
			const input = "http://example.org/%%placeholder%%/staticstuff/%%another%%";

			const urlStructure = UrlStructure.fromUrl( input );

			expect( urlStructure.getStructure() ).toEqual( expected );
		} );

		it( "parses an empty URL as an empty data structure", () => {
			const expected = [];
			const input = "";

			const urlStructure = UrlStructure.fromUrl( input );

			expect( urlStructure.getStructure() ).toEqual( expected );
		} );
	} );

	describe( "buildUrl", () => {
		it( "fills a URL structure with the data", () => {
			const expected = "http://example.org/filled/";
			const input = { placeholder: "filled" };
			const urlStructure = UrlStructure.fromUrl( "http://example.org/%%placeholder%%/" );

			const actual = urlStructure.buildUrl( input );

			expect( actual ).toBe( expected );
		} );

		it( "throws an error when data is missing", () => {
			const input = {};
			const urlStructure = UrlStructure.fromUrl( "http://example.org/%%placeholder%%/" );

			expect( urlStructure.buildUrl.bind( urlStructure, input ) ).toThrow();
		} );

		it( "builds an empty structure", () => {
			const input = {};
			const expected = "";
			const urlStructure = UrlStructure.fromUrl( "" );

			expect( urlStructure.buildUrl( input ) ).toBe( expected );
		} );

		it( "ignores special characters", () => {
			const specialCharacters = ",./;'[]\-=<>?:\"{}|_+!@#$%^&*()`~";
			const expected = `http://example.org/${specialCharacters}/`;
			const input = {
				placeholder: specialCharacters,
			};
			const urlStructure = UrlStructure.fromUrl( "http://example.org/%%placeholder%%/" );

			expect( urlStructure.buildUrl( input ) ).toBe( expected );
		} );
	} );
} );
