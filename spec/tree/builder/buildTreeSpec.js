import buildTree from "../../../src/tree/builder/buildTree";

describe.skip( "build tree", () => {
	it( "can build a tree from html", () => {
		const html = "<section>" +
			"<h1 id='header-1'>This is a header</h1>" +
			"<!-- A Comment. -->" +
			"<p>This is a paragraph.</p>" +
			"</section>";

		const tree = buildTree( html );
		console.log( tree );
	} );
} );
