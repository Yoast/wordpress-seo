import FormattingElement from "../../../../src/parsedPaper/structure/tree/FormattingElement";

describe( "FormattingElement", () => {
	describe( "constructor", () => {
		const sourceCodeLocation = {
			startTag: {
				startOffset: 0,
				endOffset: 4,
			},
			endTag: {
				startOffset: 12,
				endOffset: 17,
			},
			startOffset: 0,
			endOffset: 17,
		};

		it( "creates a new FormattingElement object", () => {
			const formattingElement = new FormattingElement( "strong", sourceCodeLocation, { id: "some-id" } );

			expect( formattingElement.type ).toEqual( "strong" );
			expect( formattingElement.sourceCodeLocation ).toEqual( sourceCodeLocation );
			expect( formattingElement.attributes ).toEqual( { id: "some-id" } );
		} );

		it( "creates a new FormattingElement object, without attributes", () => {
			const formattingElement = new FormattingElement( "strong", sourceCodeLocation );

			expect( formattingElement.type ).toEqual( "strong" );
			expect( formattingElement.sourceCodeLocation ).toEqual( sourceCodeLocation );
			expect( formattingElement.attributes ).toEqual( null );
		} );
	} );
} );
