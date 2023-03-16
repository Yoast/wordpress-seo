import adapt from "../../../../src/parse/build/private/adapt";
import { parseFragment } from "parse5";
import Node from "../../../../src/parse/structure/Node";
import  Paragraph from  "../../../../src/parse/structure/Paragraph";
import Text from "../../../../src/parse/structure/Text";
import Heading from "../../../../src/parse/structure/Heading";

describe( "The adapt function",
	() => {
		it( "adapts a basic div element", () => {
			const html = "<div><p class='yoast'>Hello, world!</p></div>";
			const tree = parseFragment( html );

			const adaptedTree = adapt( tree );

			const expected = { attributes: {}, childNodes: [ { attributes: {}, childNodes: [ { attributes: { "class": new Set( [ "yoast" ] ) }, childNodes: [ { name: "#text", value: "Hello, world!" } ], isImplicit: false, name: "p" } ], name: "div" } ], name: "#document-fragment" };

			expect( adaptedTree ).toEqual( expected );
		} );

		it( "adapts a heading element", () => {
			const html = "<h1>Hello World!</h1>";
			const tree = parseFragment( html );

			const adaptedTree = adapt( tree );

			const expected = new Node( "#document-fragment", {}, [
				new Heading( 1, {}, [
					new Text( "Hello World!" ),
				] ),
			] );
			expect( adaptedTree ).toEqual( expected );
		} );

		it( "should correctly adapt a node with no childnodes.", () => {
			const tree = { nodeName: "div" };
			const adaptedTree = adapt( tree );

			const expected = { attributes: {}, childNodes: [], name: "div" };
			expect( adaptedTree ).toEqual( expected );
		} );
	}
);
