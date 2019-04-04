import Paragraph from "../../../../../src/parsedPaper/structure/tree/nodes/Paragraph";

describe( "Paragraph tree node", () => {
	describe( "constructor", () => {
		it( "creates a new Paragraph tree node", () => {
			const paragraph = new Paragraph( "p" );

			expect( paragraph.type ).toEqual( "Paragraph" );
			expect( paragraph.sourceStartIndex ).toBe( 0 );
			expect( paragraph.sourceEndIndex ).toBe( 0 );
			expect( paragraph.textContainer ).not.toEqual( null );
			expect( paragraph.textContainer.text ).toEqual( "" );
		} );
	} );
	describe( "get and set text", () => {
		it( "sets text to a Paragraph tree node and get text from it", () => {
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
