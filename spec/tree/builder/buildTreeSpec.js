import buildTree from "../../../src/tree/builder/buildTree";
import printTree from "../../../src/tree/utils/printTree";

describe( "build tree", () => {
	it( "can build a tree from html", () => {
		const html = "<section>This? is a section.</section>";

		const tree = buildTree( html );

		console.log( printTree( tree ).join( "\n" ) );
	} );
} );
