import TextContainer from "../../../../src/tree/values/nodes/TextContainer";
import FormattingElement from "../../../../src/tree/values/FormattingElement";
import Paragraph from "../../../../src/tree/values/nodes/Paragraph";

describe( "Paragraph tree node", () => {
	describe( "constructor", () => {
		it( "can make a new Paragraph tree node with paragraph opening tags", () => {
			const formattingElements = [
				new FormattingElement( "a", 25, 29 ),
			];
			const text = "This is some text with a link.";
			const textElement = new TextContainer( text, formattingElements );

			const startIndex = 0;
			const endIndex = 30;
			const tag = "p";

			const paragraphElement = new Paragraph( textElement, startIndex, endIndex, tag );

			expect( paragraphElement.textContainer ).toEqual( textElement );
			expect( paragraphElement.startIndex ).toEqual( 0 );
			expect( paragraphElement.endIndex ).toEqual( 30 );
		} );

		it( "can make a new Paragraph tree node", () => {
			const formattingElements = [
				new FormattingElement( "a", 25, 29 ),
			];
			const text = "This is some text with a link.";
			const textElement = new TextContainer( text, formattingElements );

			const startIndex = 0;
			const endIndex = 30;

			const paragraphElement = new Paragraph( textElement, startIndex, endIndex );

			expect( paragraphElement.textContainer ).toEqual( textElement );
			expect( paragraphElement.startIndex ).toEqual( 0 );
			expect( paragraphElement.endIndex ).toEqual( 30 );
			expect( paragraphElement.tag ).toEqual( "" );
		} );
	} );

	describe( "map function", () => {
		it( "returns a changed paragraph when map is called", () => {
			const formattingElements = [
				new FormattingElement( "a", 25, 29 ),
			];
			const text = "This is some text with a link";
			const textElement = new TextContainer( text, formattingElements );

			const startIndex = 0;
			const endIndex = 30;

			const paragraphElement = new Paragraph( textElement, startIndex, endIndex );

			const mappedParagraph = paragraphElement.map( node => {
				if ( node.type === "paragraph" ) {
					node.textContainer.text = node.textContainer.text + "!!!!";
				}
				return node;
			} );

			expect( mappedParagraph.textContainer.text ).toEqual( "This is some text with a link!!!!" );
		} );
	} );

	describe( "filter function", () => {
		it( "returns this paragraph in an array when the predicate returns true", () => {
			const formattingElements = [
				new FormattingElement( "a", 25, 29 ),
			];
			const text = "This is some text with a link";
			const textElement = new TextContainer( text, formattingElements );

			const startIndex = 0;
			const endIndex = 30;

			const paragraphElement = new Paragraph( textElement, startIndex, endIndex );

			const filteredParagraph = paragraphElement.filter( node => {
				// Should return true.
				return node.startIndex === 0;
			} );

			expect( filteredParagraph ).toEqual( [ paragraphElement ] );
		} );

		it( "returns this paragraph in an array when the predicate returns false", () => {
			const formattingElements = [
				new FormattingElement( "a", 25, 29 ),
			];
			const text = "This is some text with a link";
			const textElement = new TextContainer( text, formattingElements );

			const startIndex = 0;
			const endIndex = 30;

			const paragraphElement = new Paragraph( textElement, startIndex, endIndex );

			const filteredParagraph = paragraphElement.filter( node => {
				// Should return false.
				return node.startIndex === 15;
			} );

			expect( filteredParagraph ).toEqual( [ ] );
		} );
	} );
} );
