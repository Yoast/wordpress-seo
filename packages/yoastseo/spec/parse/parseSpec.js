import parse from "../../src/parse/parse";

describe( "The parse function", () => {
	it( "parses a basic HTML text", () => {
		const html = "<div><p class='yoast'>Hello, world!</p></div>";

		expect( parse( html ) ).toEqual( {
			name: "#document-fragment",
			attributes: {},
			childNodes: [ {
				name: "div",
				attributes: {},
				childNodes: [ {
					name: "p",
					isImplicit: false,
					attributes: {
						"class": "yoast",
					},
					childNodes: [ {
						name: "#text",
						value: "Hello, world!",
					} ],
				} ],
			} ],
		} );
	} );

	it( "parses a HTML text with implicit paragraphs", () => {
		const html = "<div>Hello <span>World!</span></div>";

		expect( parse( html ) ).toEqual( {
			name: "#document-fragment",
			attributes: {},
			childNodes: [ {
				name: "div",
				attributes: {},
				childNodes: [ {
					name: "p",
					isImplicit: true,
					attributes: {},
					childNodes: [
						{
							name: "#text",
							value: "Hello ",
						},
						{
							name: "span",
							attributes: {},
							childNodes: [ {
								name: "#text",
								value: "World!",
							} ],
						},
					],
				} ],
			} ],
		} );
	} );

	it( "parses another HTML text with implicit paragraphs", () => {
		const html = "<div>Hello <p>World!</p></div>";

		expect( parse( html ) ).toEqual( {
			name: "#document-fragment",
			attributes: {},
			childNodes: [
				{
					name: "div",
					attributes: {},
					childNodes: [
						{
							name: "p",
							isImplicit: true,
							attributes: {},
							childNodes: [
								{
									name: "#text",
									value: "Hello ",
								},
							],
						},

						{
							name: "p",
							isImplicit: false,
							attributes: {},
							childNodes: [
								{
									name: "#text",
									value: "World!",
								},
							],
						},
					],
				},
			],
		} );
	} );
} );
