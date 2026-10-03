import imageCountFunction from "../../../src/languageProcessing/researches/imageCount.js";
import Paper from "../../../src/values/Paper";
import buildTree from "../../specHelpers/parse/buildTree";
import EnglishResearcher from "../../../src/languageProcessing/languages/en/Researcher";

describe( "Counts images in an text", function() {
	it( "returns correct imagecount if img tag is present", function() {
		const paper = new Paper( "string <img src='http://plaatje' alt='' />" );
		const researcher = new EnglishResearcher( paper );
		buildTree( paper, researcher );

		const imageCount = imageCountFunction( paper );

		expect( imageCount ).toBe( 1 );
	} );

	it( "returns imagecount 0 if no img tag is present", function() {
		const paper = new Paper( "string" );
		const researcher = new EnglishResearcher( paper );
		buildTree( paper, researcher );

		const imageCount = imageCountFunction( paper );

		expect( imageCount ).toBe( 0 );
	} );
} );
