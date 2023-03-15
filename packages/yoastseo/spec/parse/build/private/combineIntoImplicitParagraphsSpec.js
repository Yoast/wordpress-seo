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
	it( "correctly handles an InterElementWhitespace", () => {
		const nodes = [
			{ name: "p" },
			{ name: "span" },
			{ name: "#text" },
			{ name: "#text", value: "  " },
			{ name: "#text" },
			{ name: "div" },
			{ name: "a" },
		];

		const implicitParagraphs = combineIntoImplicitParagraphs( nodes );

		const expected =  [
			{ name: "p" },
			{
				name: "p",
				attributes: {},
				childNodes: [ { name: "span" }, { name: "#text" } ],
				isImplicit: true,
			},
			// The InterElementWhitespace
			{ name: "#text", value: "  " },
			{
				name: "p",
				attributes: {},
				childNodes: [ { name: "#text" } ],
				isImplicit: true,
			},
			{ name: "div" },
			{
				name: "p",
				attributes: {},
				childNodes: [ { name: "a" } ],
				isImplicit: true,
			},
		];

		expect( implicitParagraphs ).toEqual( expected );
	} );

	it( "correctly handles an element with children", () => {
		const nodes = [
			{ name: "p" },
			{ name: "span" },
			{ name: "#text" },
			{ name: "div", childNodes: [
				{ name: "p" },
				{ name: "span" },
				{ name: "#text" },
				{ name: "a" },
			] },
		];

		const implicitParagraphs = combineIntoImplicitParagraphs( nodes );

		const expected = [
			{ name: "p" },
			{
				name: "p",
				attributes: {},
				childNodes: [ { name: "span" }, { name: "#text" } ],
				isImplicit: true,
			},
			{
				name: "div",
				childNodes: [ { name: "p" }, { name: "span" }, { name: "#text" }, { name: "a" } ],
			},
		];

		expect( implicitParagraphs ).toEqual( expected );
	} );
} );
