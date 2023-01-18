import parse from "../../src/parse/parse";

describe( "The parse function", () => {
	it( "parses a basic HTML text", () => {
		const html = "<div><p class='yoast'>Hello, world!</p></div>";

		expect( parse( html ) ).toEqual( {
			nodeName: "#document-fragment",
			attrs: {},
			childNodes: [ {
				nodeName: "div",
				attrs: {},
				childNodes: [ {
					nodeName: "p",
					attrs: {
						"class": "yoast",
					},
					childNodes: [ {
						nodeName: "#text",
						value: "Hello, world!",
					} ],
				} ],
			} ],
		} );
	} );
} );
