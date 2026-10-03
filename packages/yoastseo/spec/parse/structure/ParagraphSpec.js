import Paragraph from "../../../src/parse/structure/Paragraph";

describe( "A test for the Paragraph object", function() {
	it( "should correctly construct a Paragraph object", function() {
		expect( new Paragraph() ).toEqual( {
			name: "p",
			attributes: {},
			childNodes: [],
			isImplicit: false,
		} );
	} );

	it( "should correctly construct an implicit Paragraph object", function() {
		expect( Paragraph.createImplicit() ).toEqual( {
			name: "p",
			attributes: {},
			childNodes: [],
			isImplicit: true,
		} );
	} );

	it( "should correctly construct an overarching Paragraph object", function() {
		expect( new Paragraph( {}, [], {}, false, true ) ).toEqual( {
			name: "p-overarching",
			attributes: {},
			childNodes: [],
			isImplicit: false,
		} );
	} );
} );
