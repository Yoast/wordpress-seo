import MetadataText from "../../../../../src/parsedPaper/structure/tree/nodes/MetadataText";

describe( "MetadataText tree node", () => {
	describe( "constructor", () => {
		it( "creates a new MetadataText tree node", () => {
			const metadataText = new MetadataText();

			expect( metadataText.type ).toEqual( "MetadataText" );
			expect( metadataText.textContainer ).not.toEqual( null );
			expect( metadataText.textContainer.text ).toEqual( "" );
		} );

		it( "creates a new MetadataText tree node with initialization data", () => {
			const metadataText = new MetadataText( "TEXT", "my text" );

			expect( metadataText.type ).toEqual( "TEXT" );
			expect( metadataText.textContainer.text ).toEqual( "my text" );
		} );
	} );

	describe( "get and set text", () => {
		it( "sets text to a MetadataText tree node and get text from it", () => {
			const metadataText = new MetadataText();

			// Use a setter to add text to the Paragraph
			metadataText.text = "Some text!";

			expect( metadataText.type ).toEqual( "MetadataText" );
			expect( metadataText.textContainer ).not.toEqual( null );
			expect( metadataText.textContainer.text ).toEqual( "Some text!" );

			// Use a getter to get text from the MetadataText
			expect( metadataText.text ).toEqual( "Some text!" );
		} );
	} );
} );
