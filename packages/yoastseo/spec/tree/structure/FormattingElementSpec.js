import FormattingElement from "../../../src/parsedPaper/structure/tree/FormattingElement";

describe( "FormattingElement", () => {
	describe( "constructor", () => {
		it( "creates a new FormattingElement object", () => {
			const formattingElement = new FormattingElement( "strong", { id: "some-id" } );
			formattingElement.sourceStartIndex = 5;
			formattingElement.sourceEndIndex = 30;

			expect( formattingElement.type ).toEqual( "strong" );
			expect( formattingElement.sourceStartIndex ).toEqual( 5 );
			expect( formattingElement.sourceEndIndex ).toEqual( 30 );
			expect( formattingElement.attributes ).toEqual( { id: "some-id" } );
		} );

		it( "creates a new FormattingElement object, without attributes", () => {
			const formattingElement = new FormattingElement( "strong" );
			formattingElement.sourceStartIndex = 5;
			formattingElement.sourceEndIndex = 30;

			expect( formattingElement.type ).toEqual( "strong" );
			expect( formattingElement.sourceStartIndex ).toEqual( 5 );
			expect( formattingElement.sourceEndIndex ).toEqual( 30 );
			expect( formattingElement.attributes ).toEqual( null );
		} );
	} );
} );
