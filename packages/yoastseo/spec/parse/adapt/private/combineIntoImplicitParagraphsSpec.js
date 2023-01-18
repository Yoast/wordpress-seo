import combineIntoImplicitParagraphs from "../../../../src/parse/build/private/combineIntoImplicitParagraphs";

describe( "The combineIntoImplicitParagraphs function", () => {
	it( "combines phrasing content into paragraphs", () => {
		const nodes = [
			{ nodeName: "p" },
			{ nodeName: "span" },
			{ nodeName: "#text" },
			{ nodeName: "div" },
			{ nodeName: "a" },
		];

		expect( combineIntoImplicitParagraphs( nodes ) ).toEqual( [
			{ nodeName: "p" },
			{
				nodeName: "p",
				attrs: {},
				isImplicit: true,
				childNodes: [
					{ nodeName: "span" },
					{ nodeName: "#text" },
				],
			},
			{ nodeName: "div" },
			{
				nodeName: "p",
				attrs: {},
				isImplicit: true,
				childNodes: [
					{ nodeName: "a" },
				],
			},
		] );
	} );
} );
