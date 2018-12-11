import buildTree from "../../../src/tree/builder/buildTree";

describe( "build tree", () => {
	it( "can build a tree from html", () => {
		const html = "<section>This? is a section.</section>";

		const tree = buildTree( html );
		console.log( tree );
	} );
} );
