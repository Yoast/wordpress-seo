import Paragraph from "../../../src/parse/structure/Paragraph";

describe( "A test for the Paragraph object", function() {
	it( "should correctly construct a paragraph object", function() {
		expect( new Paragraph() ).toEqual( {
			name: "p",
			attributes: {},
			childNodes: [],
			isImplicit: false,
		} );
	} );

	it( "should correctly construct an implicit paragraph object", function() {
		expect( Paragraph.createImplicit() ).toEqual( {
			name: "p",
			attributes: {},
			childNodes: [],
			isImplicit: true,
		} );
	} );
} );
