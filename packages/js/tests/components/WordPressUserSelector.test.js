import WordPressUserSelector from "../../src/components/WordPressUserSelector";

describe( "addQueryParams", () => {
	it( "adds a first parameter", () => {
		// Decoded: http://local.wordpress.test?search=test post
		const expected = "http://local.wordpress.test?search=test%20post";

		const actual = WordPressUserSelector.addQueryParams( "http://local.wordpress.test", {
			search: "test post",
		} );

		expect( actual ).toBe( expected );
	} );

	it( "adds an additional parameter", () => {
		// Decoded: http://local.wordpress.test?search=test post&rest_route=/wp/v2/posts
		const expected = "http://local.wordpress.test?search=test%20post&rest_route=%2Fwp%2Fv2%2Fposts";

		const actual = WordPressUserSelector.addQueryParams( "http://local.wordpress.test?rest_route=/wp/v2/posts", {
			search: "test post",
		} );

		expect( actual ).toBe( expected );
	} );
} );
