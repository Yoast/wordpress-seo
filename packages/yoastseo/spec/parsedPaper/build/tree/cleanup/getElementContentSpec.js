import buildTree from "../../../../../src/parsedPaper/build/tree/html/buildTree";
import getElementContent from "../../../../../src/parsedPaper/build/tree/cleanup/getElementContent";

describe( "getElementContent", () => {
	it( "returns the empty string when an element has no location information", () => {
		const source = "<p>This is a paragraph</p>";
		const element = buildTree( source );
		expect( getElementContent( element, source ) ).toEqual( "" );
	} );
} );
