import getImagesInScope from "../../../../src/languageProcessing/helpers/image/getImagesInScope";
import Paper from "../../../../src/values/Paper";
import buildTree from "../../../specHelpers/parse/buildTree";
import EnglishResearcher from "../../../../src/languageProcessing/languages/en/Researcher";

const productImages = [
	{ id: 1, src: "https://example.com/featured.jpg", alt: "A featured image" },
	{ id: 2, src: "https://example.com/gallery.jpg", alt: "" },
];

/**
 * Creates a paper with one tree image and the given attributes, and builds its tree.
 *
 * @param {Object} [attributes] The paper attributes.
 *
 * @returns {Paper} The paper.
 */
const buildPaperWithTreeImage = ( attributes = {} ) => {
	const paper = new Paper( "string <img src='http://plaatje' alt='tree image' />", attributes );
	buildTree( paper, new EnglishResearcher( paper ) );
	return paper;
};

describe( "getImagesInScope", function() {
	it( "returns the tree images when the paper carries no productImages attribute", function() {
		const images = getImagesInScope( buildPaperWithTreeImage() );

		expect( images ).toHaveLength( 1 );
		expect( images[ 0 ].attributes.alt ).toBe( "tree image" );
	} );

	it( "returns only the product images, mapped to img pseudo-nodes, when the paper carries them", function() {
		const images = getImagesInScope( buildPaperWithTreeImage( { productImages } ) );

		expect( images ).toEqual( [
			{ name: "img", attributes: { src: "https://example.com/featured.jpg", alt: "A featured image" } },
			{ name: "img", attributes: { src: "https://example.com/gallery.jpg", alt: "" } },
		] );
	} );

	it( "returns an empty array when the producer opted in with an empty productImages array, even when the text has images", function() {
		expect( getImagesInScope( buildPaperWithTreeImage( { productImages: [] } ) ) ).toEqual( [] );
	} );

	it( "defaults missing src and alt to empty strings when mapping product images", function() {
		expect( getImagesInScope( buildPaperWithTreeImage( { productImages: [ { id: 3 } ] } ) ) ).toEqual( [
			{ name: "img", attributes: { src: "", alt: "" } },
		] );
	} );
} );
