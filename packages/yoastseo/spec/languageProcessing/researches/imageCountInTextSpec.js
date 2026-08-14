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

describe( "Counts images in the productImages scope", function() {
	it( "counts the paper's product images and ignores the images in the text", function() {
		const paper = new Paper( "string <img src='http://plaatje' alt='' />", {
			productImages: [
				{ id: 1, src: "https://example.com/featured.jpg", alt: "A featured image" },
				{ id: 2, src: "https://example.com/gallery.jpg", alt: "" },
			],
		} );
		const researcher = new EnglishResearcher( paper );
		researcher.addConfig( "imageScope", "productImages" );
		buildTree( paper, researcher );

		const imageCount = imageCountFunction( paper, researcher );

		expect( imageCount ).toBe( 2 );
	} );

	it( "returns imagecount 0 when the paper has no product images, even when the text has images", function() {
		const paper = new Paper( "string <img src='http://plaatje' alt='' />" );
		const researcher = new EnglishResearcher( paper );
		researcher.addConfig( "imageScope", "productImages" );
		buildTree( paper, researcher );

		const imageCount = imageCountFunction( paper, researcher );

		expect( imageCount ).toBe( 0 );
	} );

	it( "keeps counting the images in the text when a researcher without the imageScope config is passed", function() {
		const paper = new Paper( "string <img src='http://plaatje' alt='' />", {
			productImages: [ { id: 1, src: "https://example.com/featured.jpg", alt: "A featured image" } ],
		} );
		const researcher = new EnglishResearcher( paper );
		buildTree( paper, researcher );

		const imageCount = imageCountFunction( paper, researcher );

		expect( imageCount ).toBe( 1 );
	} );
} );
