import TextContainer from "../../../../src/tree/values/nodes/TextContainer";
import FormattingElement from "../../../../src/tree/values/FormattingElement";
import Paragraph from "../../../../src/tree/values/nodes/Paragraph";

describe( "Text tree node", () => {
	it( "can make a new Paragraph tree node with paragraph opening tags", () => {
		const phrasingElements = [
			new FormattingElement( "a", 25, 29 ),
		];
		const text = "This is some text with a link.";
		const textElement = new TextContainer( text, phrasingElements );

		const openingTag = "<p>";
		const closingTag = "</p>";

		const paragraphElement = new Paragraph( textElement, openingTag, closingTag );

		expect( paragraphElement.textContainer ).toEqual( textElement );
		expect( paragraphElement.startHtml ).toEqual( "<p>" );
		expect( paragraphElement.endHtml ).toEqual( "</p>" );
	} );

	it( "can make a new Text tree node", () => {
		const phrasingElements = [
			new FormattingElement( "a", 25, 29 ),
		];
		const text = "This is some text with a link.";
		const textElement = new TextContainer( text, phrasingElements );

		const paragraphElement = new Paragraph( textElement );

		expect( paragraphElement.textContainer ).toEqual( textElement );
		expect( paragraphElement.startHtml ).toEqual( "<p>" );
		expect( paragraphElement.endHtml ).toEqual( "</p>" );
	} );
} );
