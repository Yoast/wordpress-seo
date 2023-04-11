import getImagesInTree from "../../../../src/languageProcessing/helpers/image/getImagesInTree";
import Paper from "../../../../src/values/Paper";
import Researcher from "../../../../src/languageProcessing/languages/en/Researcher";
import buildTree from "../../../specHelpers/parse/buildTree";
import getMorphologyData from "../../../specHelpers/getMorphologyData";

describe( "Checks the text for images", function() {
	it( "returns an array with images from a text", function() {
		const mockPaper = new Paper( "<p>Here is a text with images.</p> <img src='img.com' alt='imagine1' />" +
			" <img src='img2.com' alt='image2' />" );

		const researcher = new Researcher( mockPaper );
		researcher.addResearchData( "morphology", getMorphologyData( "en" ) );
		buildTree( mockPaper, researcher );

		const images = getImagesInTree( mockPaper );

		expect( images.length ).toEqual( 2 );

		expect( images[ 0 ].name ).toEqual( "img" );
		expect( images[ 0 ].attributes.alt ).toEqual( "imagine1" );
		expect( images[ 0 ].attributes.src ).toEqual( "img.com" );

		expect( images[ 1 ].name ).toEqual( "img" );
		expect( images[ 1 ].attributes.alt ).toEqual( "image2" );
		expect( images[ 1 ].attributes.src ).toEqual( "img2.com" );
	} );
	it( "also detects images with a closing tag", function() {
		const mockPaper = new Paper( "<p>Here is a text with images.</p> <img src='img.com' alt='imagine1'>" +
			" <img src='img2.com' alt='image2'></img>" );

		const researcher = new Researcher( mockPaper );
		researcher.addResearchData( "morphology", getMorphologyData( "en" ) );
		buildTree( mockPaper, researcher );

		const images = getImagesInTree( mockPaper );

		expect( images.length ).toEqual( 2 );

		expect( images.length ).toEqual( 2 );

		expect( images[ 0 ].name ).toEqual( "img" );
		expect( images[ 0 ].attributes.alt ).toEqual( "imagine1" );
		expect( images[ 0 ].attributes.src ).toEqual( "img.com" );

		expect( images[ 1 ].name ).toEqual( "img" );
		expect( images[ 1 ].attributes.alt ).toEqual( "image2" );
		expect( images[ 1 ].attributes.src ).toEqual( "img2.com" );
	} );
	it( "returns empty array if there are no images in the text", function() {
		const mockPaper = new Paper( "<p>Here is a text with no images.</p>" );
		expect( getImagesInTree( mockPaper ) ).toEqual( [ ] );
	} );
} );
