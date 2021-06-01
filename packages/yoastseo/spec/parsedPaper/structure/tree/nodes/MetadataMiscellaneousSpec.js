import MetadataMiscellaneous from "../../../../../src/parsedPaper/structure/tree/nodes/MetadataMiscellaneous";

describe( "MetadataMiscellaneous tree node", () => {
	describe( "constructor", () => {
		it( "creates a new MetadataMiscellaneous tree node", () => {
			const metadataText = new MetadataMiscellaneous();

			expect( metadataText.type ).toEqual( "MetadataMiscellaneous" );
			expect( metadataText._data ).toEqual( null );
		} );

		it( "creates a new MetadataMiscellaneous tree node with initialization data", () => {
			const metadataText = new MetadataMiscellaneous( "DATA", "my data" );

			expect( metadataText.type ).toEqual( "DATA" );
			expect( metadataText._data ).toEqual( "my data" );
		} );
	} );

	describe( "get and set data", () => {
		it( "sets and then gets data to and from a MetadataMiscellaneous tree node", () => {
			const metadataText = new MetadataMiscellaneous();

			// Use a setter to add data to the MetadataMiscellaneous
			metadataText.data = 6;

			expect( metadataText.type ).toEqual( "MetadataMiscellaneous" );
			expect( metadataText._data ).toEqual( 6 );

			// Use a getter to get data from the MetadataMiscellaneous
			expect( metadataText.data ).toEqual( 6 );
		} );
	} );
} );
