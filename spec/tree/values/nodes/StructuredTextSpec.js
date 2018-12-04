import StructuredText from "../../../../src/tree/values/nodes/StructuredText";

describe( "StructuredText", () => {
	it( "can make a StructuredText node", () => {
		const children = [ "a", 1, true ];
		const startHtml = "<div>";
		const endHtml = "</div>";

		const structuredTextNode = new StructuredText( children, startHtml, endHtml );
		expect( structuredTextNode.children ).toEqual( children );
		expect( structuredTextNode.startHtml ).toEqual( startHtml );
		expect( structuredTextNode.endHtml ).toEqual( endHtml );
	} );
} );
