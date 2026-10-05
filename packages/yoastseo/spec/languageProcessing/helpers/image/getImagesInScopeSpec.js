import getImagesInScope from "../../../../src/languageProcessing/helpers/image/getImagesInScope";
import getAltAttribute from "../../../../src/languageProcessing/helpers/image/getAltAttribute";
import Paper from "../../../../src/values/Paper";
import buildTree from "../../../specHelpers/parse/buildTree";
import EnglishResearcher from "../../../../src/languageProcessing/languages/en/Researcher";

const providedImages = [
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
	it( "returns the tree images when the paper carries no providedImages attribute", function() {
		const images = getImagesInScope( buildPaperWithTreeImage() );

		expect( images ).toHaveLength( 1 );
		expect( images[ 0 ].attributes.alt ).toBe( "tree image" );
	} );

	it( "returns only the provided images, mapped to img pseudo-nodes, when the paper carries them", function() {
		const images = getImagesInScope( buildPaperWithTreeImage( { providedImages } ) );

		expect( images ).toEqual( [
			{ name: "img", id: 1, attributes: { src: "https://example.com/featured.jpg", alt: "A featured image" } },
			{ name: "img", id: 2, attributes: { src: "https://example.com/gallery.jpg", alt: "" } },
		] );
	} );

	it( "keeps the producer's id on the node, so an assessment can report which images it flagged", function() {
		const [ featured ] = getImagesInScope( buildPaperWithTreeImage( { providedImages } ) );

		expect( featured.id ).toBe( 1 );
		// Outside `attributes`: it is the producer's identifier, not an HTML attribute of the image.
		expect( featured.attributes.id ).toBeUndefined();
	} );

	it( "leaves the id undefined when the producer sends none, because it is optional in the contract", function() {
		const [ image ] = getImagesInScope( buildPaperWithTreeImage( { providedImages: [ { src: "a.jpg", alt: "b" } ] } ) );

		expect( image.id ).toBeUndefined();
	} );

	it( "returns an empty array when the producer opted in with an empty providedImages array, even when the text has images", function() {
		expect( getImagesInScope( buildPaperWithTreeImage( { providedImages: [] } ) ) ).toEqual( [] );
	} );

	it( "defaults missing src and alt to empty strings when mapping provided images", function() {
		expect( getImagesInScope( buildPaperWithTreeImage( { providedImages: [ { id: 3 } ] } ) ) ).toEqual( [
			{ name: "img", id: 3, attributes: { src: "", alt: "" } },
		] );
	} );

	it( "returns equivalent nodes from both scopes for the same image, on the fields the image researches consume", function() {
		const src = "https://example.com/parity.jpg";
		const alt = "parity image";

		const treePaper = new Paper( `string <img src='${ src }' alt='${ alt }' />` );
		buildTree( treePaper, new EnglishResearcher( treePaper ) );
		const productPaper = new Paper( "string without images", { providedImages: [ { id: 4, src, alt } ] } );

		const [ treeNode ] = getImagesInScope( treePaper );
		const [ productNode ] = getImagesInScope( productPaper );

		expect( treeNode.name ).toBe( productNode.name );
		expect( treeNode.attributes.src ).toBe( productNode.attributes.src );
		// Assert through the consumer helper, so the parity that matters downstream is what is checked.
		expect( getAltAttribute( treeNode ) ).toBe( getAltAttribute( productNode ) );
	} );
} );
