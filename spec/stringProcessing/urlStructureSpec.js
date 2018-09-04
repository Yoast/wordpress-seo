import UrlStructure from '../../src/stringProcessing/urlStructure';

describe( "UrlStructure", () => {
	it( "accepts a url structure", () => {
		let expected = "http://example.org/structure/";
		let input = expected;

		let urlStructure = new UrlStructure( input );

		expect( urlStructure.getStructure() ).toBe( expected );
	} );

	describe( "parseUrl", () => {
		it( "parses a URL and builds a data structure from it", () => {
			let expected = [
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
			let input = "http://example.org/%%placeholder%%/staticstuff/%%another%%";

			let urlStructure = UrlStructure.fromUrl( input );

			expect( urlStructure.getStructure() ).toEqual( expected );
		} );

		it( "parses an empty URL as an empty data structure", () => {
			let expected = [];
			let input = "";

			let urlStructure = UrlStructure.fromUrl( input );

			expect( urlStructure.getStructure() ).toEqual( expected );
		} );
	} );

	describe( "buildUrl", () => {
		it( "fills a URL structure with the data", () => {
			let expected = "http://example.org/filled/";
			let input = { placeholder: "filled" };
			let urlStructure = UrlStructure.fromUrl( "http://example.org/%%placeholder%%/" );

			let actual = urlStructure.buildUrl( input );

			expect( actual ).toBe( expected );
		} );

		it( "throws an error when data is missing", () => {
			let input = {};
			let urlStructure = UrlStructure.fromUrl( "http://example.org/%%placeholder%%/" );

			expect( urlStructure.buildUrl.bind( urlStructure, input ) ).toThrow();
		} );

		it( "builds an empty structure", () => {
			let input = {};
			let expected = "";
			let urlStructure = UrlStructure.fromUrl( "" );

			expect( urlStructure.buildUrl( input ) ).toBe( expected );
		} );

		it( "ignores special characters", () => {
			let specialCharacters = ",./;'[]\-=<>?:\"{}|_+!@#$%^&*()`~";
			let expected = `http://example.org/${specialCharacters}/`;
			let input = {
				placeholder: specialCharacters,
			};
			let urlStructure = UrlStructure.fromUrl( "http://example.org/%%placeholder%%/" );

			expect( urlStructure.buildUrl( input ) ).toBe( expected );
		} );
	} );
} );
