import adaptAttributes from "../../../../src/parse/build/private/adaptAttributes";

describe( "The adaptAttributes function", () => {
	it( "adapts a list of name-value attribute pairs", () => {
		const attributePairs = [
			{ name: "class", value: "cat" },
			{ name: "href", value: "https://example.org/" },
		];
		expect( adaptAttributes( attributePairs ) ).toEqual( {
			"class": new Set( [ "cat" ] ),
			href: "https://example.org/",
		} );
	} );

	it( "adapts an empty list", () => {
		expect( adaptAttributes( [] ) ).toEqual( {} );
	} );

	it( "adapts `null`", () => {
		expect( adaptAttributes( null ) ).toEqual( {} );
	} );
} );
