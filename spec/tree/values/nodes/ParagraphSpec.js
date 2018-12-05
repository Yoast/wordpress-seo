import TextContainer from "../../../../src/tree/values/nodes/TextContainer";
import FormattingElement from "../../../../src/tree/values/FormattingElement";
import Paragraph from "../../../../src/tree/values/nodes/Paragraph";

describe( "Paragraph tree node", () => {
	it( "can make a new Paragraph tree node with paragraph opening tags", () => {
		const formattingElements = [
			new FormattingElement( "a", 25, 29 ),
		];
		const text = "This is some text with a link.";
		const textElement = new TextContainer( text, formattingElements );

		const start = "/n/n";
		const end = "";

		const paragraphElement = new Paragraph( textElement, start, end );

		expect( paragraphElement.textContainer ).toEqual( textElement );
		expect( paragraphElement.start ).toEqual( "/n/n" );
		expect( paragraphElement.end ).toEqual( "" );
	} );

	it( "can make a new Paragraph tree node", () => {
		const formattingElements = [
			new FormattingElement( "a", 25, 29 ),
		];
		const text = "This is some text with a link.";
		const textElement = new TextContainer( text, formattingElements );

		const paragraphElement = new Paragraph( textElement );

		expect( paragraphElement.textContainer ).toEqual( textElement );
		expect( paragraphElement.start ).toEqual( "<p>" );
		expect( paragraphElement.end ).toEqual( "</p>" );
	} );
} );
