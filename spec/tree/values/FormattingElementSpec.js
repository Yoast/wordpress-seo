import FormattingElement from "../../../src/tree/values/FormattingElement";

describe( "FormattingElement", () => {
	describe( "constructor", () => {
		it( "creates a new FormattingElement object", () => {
			const formattingElement = new FormattingElement( "strong", { id: "some-id" } );
			formattingElement.startIndex = 5;
			formattingElement.endIndex = 30;

			expect( formattingElement.type ).toEqual( "strong" );
			expect( formattingElement.startIndex ).toEqual( 5 );
			expect( formattingElement.endIndex ).toEqual( 30 );
			expect( formattingElement.attributes ).toEqual( { id: "some-id" } );
		} );

		it( "creates a new FormattingElement object, without attributes", () => {
			const formattingElement = new FormattingElement( "strong" );
			formattingElement.startIndex = 5;
			formattingElement.endIndex = 30;

			expect( formattingElement.type ).toEqual( "strong" );
			expect( formattingElement.startIndex ).toEqual( 5 );
			expect( formattingElement.endIndex ).toEqual( 30 );
			expect( formattingElement.attributes ).toEqual( null );
		} );
	} );
} );
