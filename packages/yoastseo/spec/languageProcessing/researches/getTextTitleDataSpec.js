import getTextTitleData from "../../../src/languageProcessing/researches/getTextTitleData";
import Paper from "../../../src/values/Paper";

describe( "a test to get text title data from the paper", () => {
	it( "should return true when the paper has a text title", () => {
		const mockPaper = new Paper( "A text about a beautiful cat.", { textTitle: "A good title befitting a beautiful cat" } );

		expect( getTextTitleData( mockPaper ) ).toEqual( true );
	} );
	it( "should return false when the paper doesn't have a text title", () => {
		const mockPaper = new Paper( "A text about a beautiful cat.", { textTitle: "" } );

		expect( getTextTitleData( mockPaper ) ).toEqual( false );
	} );
	it( "should still return false when the text title contains only spaces", () => {
		let mockPaper = new Paper( "A text about a beautiful cat.", { textTitle: "   " } );
		expect( getTextTitleData( mockPaper ) ).toEqual( false );

		mockPaper = new Paper( "A text about a beautiful cat.", { textTitle: "&nbsp;   " } );
		expect( getTextTitleData( mockPaper ) ).toEqual( false );
	} );
} );
