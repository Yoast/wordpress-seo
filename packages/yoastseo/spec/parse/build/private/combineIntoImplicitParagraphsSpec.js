import combineIntoImplicitParagraphs from "../../../../src/parse/build/private/combineIntoImplicitParagraphs";

describe( "The combineIntoImplicitParagraphs function", () => {
	it( "combines phrasing content into paragraphs", () => {
		const nodes = [
			{ name: "p" },
			{ name: "span" },
			{ name: "#text" },
			{ name: "div" },
			{ name: "a" },
		];

		expect( combineIntoImplicitParagraphs( nodes ) ).toEqual( [
			{ name: "p" },
			{
				name: "p",
				attributes: {},
				isImplicit: true,
				childNodes: [
					{ name: "span" },
					{ name: "#text" },
				],
			},
			{ name: "div" },
			{
				name: "p",
				attributes: {},
				isImplicit: true,
				childNodes: [
					{ name: "a" },
				],
			},
		] );
	} );
} );
