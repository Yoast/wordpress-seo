import getLongCenterAlignedText from "../../../src/languageProcessing/researches/getLongCenterAlignedText.js";
import Paper from "../../../src/values/Paper.js";

describe( "a test for getting blocks of too long center aligned text", function() {
	it( "returns the text and type of block if a too long paragraph with center aligned text is found", function() {
		const mockPaper = new Paper( "<p class=\"has-text-align-center\">This is a paragraph with a bit more than fifty characters." +
			"</p><p class=\"has-text-align-center\">This is a short text.</p>" );
		expect( getLongCenterAlignedText( mockPaper ) ).toEqual( [
			{ text: "This is a paragraph with a bit more than fifty characters.", typeOfBlock: "paragraph" },
		] );
	} );
	it( "returns one object for each too long paragraph", function() {
		const mockPaper = new Paper( "<p class=\"has-text-align-center\">This is a paragraph with a bit more than fifty characters." +
			"</p><p class=\"has-text-align-center\">This is another paragraph with a bit more than fifty characters.</p>" );
		expect( getLongCenterAlignedText( mockPaper ) ).toEqual( [
			{ text: "This is a paragraph with a bit more than fifty characters.", typeOfBlock: "paragraph" },
			{ text: "This is another paragraph with a bit more than fifty characters.", typeOfBlock: "paragraph" },
		] );
	} );
	it( "returns the text and type of block if a too long heading with center aligned text is found", function() {
		const mockPaper = new Paper( "<h2 class=\"has-text-align-center\">This is a heading with a bit more than fifty characters." +
			"</h2><h2 class=\"has-text-align-center\">This is a short heading.</h2>" );
		expect( getLongCenterAlignedText( mockPaper ) ).toEqual( [
			{ text: "This is a heading with a bit more than fifty characters.", typeOfBlock: "heading" },
		] );
	} );
	it( "returns one object for each too long heading", function() {
		const mockPaper = new Paper( "<h3 class=\"has-text-align-center\">This is a heading with a bit more than fifty characters." +
			"</h3><h4 class=\"has-text-align-center\">This is another heading with a bit more than fifty characters.</h4>" );
		expect( getLongCenterAlignedText( mockPaper ) ).toEqual( [
			{ text: "This is a heading with a bit more than fifty characters.", typeOfBlock: "heading" },
			{ text: "This is another heading with a bit more than fifty characters.", typeOfBlock: "heading" },
		] );
	} );
	it( "returns the objects for both headings and paragraphs when both contain too long center aligned text", function() {
		const mockPaper = new Paper( "<h5 class=\"has-text-align-center\">This is a heading with a bit more than fifty characters." +
			"</h5><p class=\"has-text-align-center\">This is a paragraph with a bit more than fifty characters.</p>" );
		expect( getLongCenterAlignedText( mockPaper ) ).toEqual( [
			{ text: "This is a paragraph with a bit more than fifty characters.", typeOfBlock: "paragraph" },
			{ text: "This is a heading with a bit more than fifty characters.", typeOfBlock: "heading" },
		] );
	} );
	it( "does not include html tags in the character count", function() {
		const mockPaper = new Paper( "<p class=\"has-text-align-center\">This text is too long if you count html tags.</p>" );
		expect( getLongCenterAlignedText( mockPaper ) ).toEqual( [] );
	} );
	it( "returns an empty array if no long blocks of center aligned text are found", function() {
		const mockPaper = new Paper( "<p>Lorem ipsum</p><h3>heading</h3>" );
		expect( getLongCenterAlignedText( mockPaper ) ).toEqual( [] );
	} );
	it( "returns an empty array if a block with short center aligned text is found", function() {
		const mockPaper = new Paper( "<p class=\"has-text-align-center\">Lorem ipsum</p><h4 class=\"has-text-align-center\">Lorem ipsum</h4>" );
		expect( getLongCenterAlignedText( mockPaper ) ).toEqual( [] );
	} );
	it( "returns an empty array if the element with center alignment is not a paragraph or a heading", function() {
		const mockPaper = new Paper( "<ul class=\"has-text-align-center\"><li>List item</li></ul>" );
		expect( getLongCenterAlignedText( mockPaper ) ).toEqual( [] );
	} );
} );
