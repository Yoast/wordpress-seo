import Paragraph from "../../../../src/tree/values/nodes/Paragraph";

describe( "Paragraph tree node", () => {
	describe( "constructor", () => {
		test( "can make a new Paragraph tree node", () => {
			const paragraph = new Paragraph( "p" );

			expect( paragraph.type ).toEqual( "Paragraph" );
			expect( paragraph.textContainer ).not.toEqual( null );
			expect( paragraph.textContainer.text ).toEqual( "" );
		} );
	} );
	describe( "get and set text", () => {
		test( "can set text to a Paragraph tree node and get text from it", () => {
			const paragraph = new Paragraph( "p" );
			paragraph.text = "Some text!";

			expect( paragraph.type ).toEqual( "Paragraph" );
			expect( paragraph.textContainer ).not.toEqual( null );
			expect( paragraph.textContainer.text ).toEqual( "Some text!" );

			expect( paragraph.text ).toEqual( "Some text!" );
		} );
	} );
} );
