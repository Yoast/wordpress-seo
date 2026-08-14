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
 * @returns {{paper: Paper, researcher: EnglishResearcher}} The paper and its researcher.
 */
const buildPaperWithTreeImage = ( attributes = {} ) => {
	const paper = new Paper( "string <img src='http://plaatje' alt='tree image' />", attributes );
	const researcher = new EnglishResearcher( paper );
	buildTree( paper, researcher );
	return { paper, researcher };
};

describe( "getImagesInScope", function() {
	it( "returns the tree images when no imageScope config is set", function() {
		const { paper, researcher } = buildPaperWithTreeImage( { productImages } );

		const images = getImagesInScope( paper, researcher );

		expect( images ).toHaveLength( 1 );
		expect( images[ 0 ].attributes.alt ).toBe( "tree image" );
	} );

	it( "returns the tree images when the imageScope config carries an unknown value", function() {
		const { paper, researcher } = buildPaperWithTreeImage( { productImages } );
		researcher.addConfig( "imageScope", "somethingUnknown" );

		const images = getImagesInScope( paper, researcher );

		expect( images ).toHaveLength( 1 );
		expect( images[ 0 ].attributes.alt ).toBe( "tree image" );
	} );

	it( "returns the tree images when no researcher is passed (direct research calls)", function() {
		const { paper } = buildPaperWithTreeImage( { productImages } );

		const images = getImagesInScope( paper );

		expect( images ).toHaveLength( 1 );
		expect( images[ 0 ].attributes.alt ).toBe( "tree image" );
	} );

	it( "returns the tree images when the researcher has no getConfig method", function() {
		const { paper } = buildPaperWithTreeImage( { productImages } );

		const images = getImagesInScope( paper, {} );

		expect( images ).toHaveLength( 1 );
		expect( images[ 0 ].attributes.alt ).toBe( "tree image" );
	} );

	it( "returns only the product images, mapped to img pseudo-nodes, in the productImages scope", function() {
		const { paper, researcher } = buildPaperWithTreeImage( { productImages } );
		researcher.addConfig( "imageScope", "productImages" );

		const images = getImagesInScope( paper, researcher );

		expect( images ).toEqual( [
			{ name: "img", attributes: { src: "https://example.com/featured.jpg", alt: "A featured image" } },
			{ name: "img", attributes: { src: "https://example.com/gallery.jpg", alt: "" } },
		] );
	} );

	it( "returns an empty array in the productImages scope when the paper has no product images", function() {
		const { paper, researcher } = buildPaperWithTreeImage();
		researcher.addConfig( "imageScope", "productImages" );

		expect( getImagesInScope( paper, researcher ) ).toEqual( [] );
	} );

	it( "defaults missing src and alt to empty strings when mapping product images", function() {
		const { paper, researcher } = buildPaperWithTreeImage( { productImages: [ { id: 3 } ] } );
		researcher.addConfig( "imageScope", "productImages" );

		expect( getImagesInScope( paper, researcher ) ).toEqual( [
			{ name: "img", attributes: { src: "", alt: "" } },
		] );
	} );
} );
