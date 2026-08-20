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

describe( "Counts the paper's provided images when the producer provides them", function() {
	it( "counts the paper's provided images and ignores the images in the text", function() {
		const paper = new Paper( "string <img src='http://plaatje' alt='' />", {
			providedImages: [
				{ id: 1, src: "https://example.com/featured.jpg", alt: "A featured image" },
				{ id: 2, src: "https://example.com/gallery.jpg", alt: "" },
			],
		} );
		const researcher = new EnglishResearcher( paper );
		buildTree( paper, researcher );

		const imageCount = imageCountFunction( paper );

		expect( imageCount ).toBe( 2 );
	} );

	it( "returns imagecount 0 when the producer opted in with an empty providedImages array, even when the text has images", function() {
		const paper = new Paper( "string <img src='http://plaatje' alt='' />", { providedImages: [] } );
		const researcher = new EnglishResearcher( paper );
		buildTree( paper, researcher );

		const imageCount = imageCountFunction( paper );

		expect( imageCount ).toBe( 0 );
	} );
} );
