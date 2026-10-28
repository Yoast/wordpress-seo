import imageAlt from "../../../../src/languageProcessing/helpers/image/getAltAttribute.js";
import { parseFragment } from "parse5";
import adapt from "../../../../src/parse/build/private/adapt";
import Paper from "../../../../src/values/Paper";
import Researcher from "../../../../src/languageProcessing/languages/en/Researcher";
import buildTree from "../../../specHelpers/parse/buildTree";
import getImagesInScope from "../../../../src/languageProcessing/helpers/image/getImagesInScope";

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

describe( "HTML entities in the alt attribute", () => {
	/**
	 * Builds the tree of a paper with one image, so the alt attribute goes through the tree builder.
	 *
	 * @param {string} alt The alt attribute, as it is written in the HTML.
	 *
	 * @returns {Node} The image node from the tree.
	 */
	const imageFromTree = ( alt ) => {
		const paper = new Paper( `<p>A text.</p><img src="https://example.com/bike.jpg" alt="${ alt }" />` );
		buildTree( paper, new Researcher( paper ) );

		return paper.getTree().findAll( node => node.name === "img" )[ 0 ];
	};

	it.each( [
		[ "Red&nbsp;bike", "Red bike" ],
		[ "&quot;Red&quot; bike", "\"Red\" bike" ],
		[ "Red bike &mdash; on a beach", "Red bike — on a beach" ],
		[ "Rock&amp;roll bike", "Rock&roll bike" ],
		[ "Red &QUOT;bike&QUOT;", "Red \"bike\"" ],
		[ "&nbsp;Red bike&nbsp;", "Red bike" ],
		[ "&nbsp;", "" ],
		[ "Red &amp;nbsp; bike", "Red &nbsp; bike" ],
	] )( "turns the entities in the alt attribute %s of an image from the text back into characters", ( alt, expected ) => {
		expect( imageAlt( imageFromTree( alt ) ) ).toBe( expected );
	} );

	it( "keeps \"#nbsp;\" in the alt text of a provided image, where it is real text", () => {
		const paper = new Paper( "", { providedImages: [ { src: "https://example.com/bike.jpg", alt: "Red#nbsp;bike" } ] } );

		expect( getImagesInScope( paper ).map( imageAlt ) ).toEqual( [ "Red#nbsp;bike" ] );
	} );

	it( "still turns &quot; and &#039; into quotes in the alt text of a provided image", () => {
		const paper = new Paper( "", { providedImages: [ { src: "https://example.com/bike.jpg", alt: "&quot;Red&quot; &#039;bike&#039;" } ] } );

		expect( getImagesInScope( paper ).map( imageAlt ) ).toEqual( [ "\"Red\" 'bike'" ] );
	} );
} );
