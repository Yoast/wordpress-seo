import sentences from "../../../src/languageProcessing/researches/sentences";
import EnglishResearcher from "../../../src/languageProcessing/languages/en/Researcher";
import Paper from "../../../src/values/Paper";
describe( "Get sentences from text", function() {
	it( "gets sentences from the text", function() {
		const paper = new Paper( "Hello. Goodbye." );
		const researcher = new EnglishResearcher();
		expect( sentences( paper, researcher ) ).toEqual( [ "Hello.", "Goodbye." ] );
	} );
	it( "ignores sentences inside elements we want to exclude from the analysis", function() {
		const paper = new Paper( "Hello. Goodbye. <blockquote>To be or not to be</blockquote>" );
		const researcher = new EnglishResearcher();
		expect( sentences( paper, researcher ) ).toEqual( [ "Hello.", "Goodbye." ] );
	} );

	it( "should get sentences without the shortcodes", function() {
		const paper = new Paper( "Hello. Goodbye. To be [shortcode]or not to be.", { shortcodes: [ "shortcode" ] } );
		const researcher = new EnglishResearcher();
		expect( sentences( paper, researcher ) ).toEqual( [ "Hello.", "Goodbye.", "To be or not to be." ] );
	} );
} );
