import buildTree from "../../../../src/tree/builder";
import getElementContent from "../../../../src/tree/builder/cleanup/getElementContent";

describe( "getElementContent", () => {
	it( "returns the empty string when an element has no location information", () => {
		const source = "<p>This is a paragraph</p>";
		const element = buildTree( source );
		expect( getElementContent( element, source ) ).toEqual( "" );
	} );
} );
