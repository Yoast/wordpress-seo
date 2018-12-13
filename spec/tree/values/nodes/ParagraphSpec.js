import Paragraph from "../../../../src/tree/values/nodes/Paragraph";

describe( "Paragraph tree node", () => {
	describe( "constructor", () => {
		test( "can make a new Paragraph tree node", () => {
			const paragraph = new Paragraph( "p" );

			expect( paragraph.type ).toEqual( "Paragraph" );
			expect( paragraph.startIndex ).toBe( 0 );
			expect( paragraph.endIndex ).toBe( 0 );
			expect( paragraph.textContainer ).not.toEqual( null );
			expect( paragraph.textContainer.text ).toEqual( "" );
		} );
	} );
	describe( "get and set text", () => {
		test( "can set text to a Paragraph tree node and get text from it", () => {
			const paragraph = new Paragraph( "p" );

			// Use a setter to add text to the Paragraph
			paragraph.text = "Some text!";

			expect( paragraph.type ).toEqual( "Paragraph" );
			expect( paragraph.textContainer ).not.toEqual( null );
			expect( paragraph.textContainer.text ).toEqual( "Some text!" );

			// Use a getter to get text from the Paragraph
			expect( paragraph.text ).toEqual( "Some text!" );
		} );
	} );
} );
