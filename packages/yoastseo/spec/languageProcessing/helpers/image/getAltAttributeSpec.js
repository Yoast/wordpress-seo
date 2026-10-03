import imageAlt from "../../../../src/languageProcessing/helpers/image/getAltAttribute.js";
import { parseFragment } from "parse5";
import adapt from "../../../../src/parse/build/private/adapt";

describe( "Checks for an alt attribute in an image", function() {
	it( "returns the contents of the alt attribute", function() {
		const tree = adapt( parseFragment( "<img src='img.com' alt='a test' />", { sourceCodeLocationInfo: true } ) );
		const imageNode = tree.findAll( node => node.name === "img" )[ 0 ];

		expect( imageAlt( imageNode ) ).toBe( "a test" );

		const secondTree = adapt( parseFragment( "<img src='img.com' alt='ä test' />", { sourceCodeLocationInfo: true } ) );
		const secondImageNode = secondTree.findAll( node => node.name === "img" )[ 0 ];

		expect( imageAlt( secondImageNode ) ).toBe( "ä test" );
	} );
	it( "returns empty string if there is no alt tag", function() {
		const tree = adapt( parseFragment( "<img src='img.com'>", { sourceCodeLocationInfo: true } ) );
		const imageNode = tree.findAll( node => node.name === "img" )[ 0 ];

		expect( imageAlt( imageNode ) ).toBe( "" );
	} );
} );
