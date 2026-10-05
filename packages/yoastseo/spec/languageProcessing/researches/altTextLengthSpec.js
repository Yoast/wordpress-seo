import altTextLength from "../../../src/languageProcessing/researches/altTextLength";
import Researcher from "../../../src/languageProcessing/languages/en/Researcher";
import Paper from "../../../src/values/Paper";
import buildTree from "../../specHelpers/parse/buildTree";

/**
 * Builds a Paper with the given images in its text and parses it, so the images end up in the tree.
 *
 * @param {string[]} altTexts The alt text of each image to put in the text.
 *
 * @returns {Paper} The parsed paper.
 */
const src = ( index ) => `https://example.com/image-${ index }.jpg`;

const paperWithImages = ( altTexts ) => {
	const text = altTexts.map( ( alt, index ) => `<img src='https://example.com/image-${ index }.jpg' alt='${ alt }' />` ).join( "" );
	const paper = new Paper( text );
	buildTree( paper, new Researcher( paper ) );

	return paper;
};

/**
 * Repeats "a" to build an alt text of an exact length.
 *
 * @param {number} length The number of characters the alt text should have.
 *
 * @returns {string} The alt text.
 */
const altTextOfLength = ( length ) => "a".repeat( length );

describe( "a research that counts the images whose alt text is too short or too long", () => {
	it( "counts no images when the paper has no images", () => {
		expect( altTextLength( paperWithImages( [] ) ) ).toEqual( { tooShort: 0, tooLong: 0, flagged: [] } );
	} );

	it( "does not count an image without alt text as too short", () => {
		const paper = new Paper( "<img src='https://example.com/image.jpg' /><img src='https://example.com/image.jpg' alt='' />" );
		buildTree( paper, new Researcher( paper ) );

		expect( altTextLength( paper ) ).toEqual( { tooShort: 0, tooLong: 0, flagged: [] } );
	} );

	it( "does not count alt text that is only whitespace, because `getAltAttribute` strips it", () => {
		expect( altTextLength( paperWithImages( [ "   " ] ) ) ).toEqual( { tooShort: 0, tooLong: 0, flagged: [] } );
	} );

	it.each( [
		[ 9, { tooShort: 1, tooLong: 0, flagged: [ src( 0 ) ] } ],
		[ 10, { tooShort: 1, tooLong: 0, flagged: [ src( 0 ) ] } ],
		[ 11, { tooShort: 0, tooLong: 0, flagged: [] } ],
	] )( "counts an alt text of %i characters at the lower boundary", ( length, expected ) => {
		expect( altTextLength( paperWithImages( [ altTextOfLength( length ) ] ) ) ).toEqual( expected );
	} );

	it.each( [
		[ 199, { tooShort: 0, tooLong: 0, flagged: [] } ],
		[ 200, { tooShort: 0, tooLong: 1, flagged: [ src( 0 ) ] } ],
		[ 201, { tooShort: 0, tooLong: 1, flagged: [ src( 0 ) ] } ],
	] )( "counts an alt text of %i characters at the upper boundary", ( length, expected ) => {
		expect( altTextLength( paperWithImages( [ altTextOfLength( length ) ] ) ) ).toEqual( expected );
	} );

	it( "counts too short and too long images on the same page separately", () => {
		const paper = paperWithImages( [ altTextOfLength( 5 ), altTextOfLength( 8 ), altTextOfLength( 250 ), altTextOfLength( 50 ) ] );

		expect( altTextLength( paper ) ).toEqual( {
			tooShort: 2,
			tooLong: 1,
			flagged: [ src( 0 ), src( 1 ), src( 2 ) ],
		} );
	} );

	it( "counts the paper's provided images instead of the text when the producer opts in", () => {
		const paper = new Paper( "<img src='https://example.com/in-text.jpg' alt='short' />", {
			providedImages: [
				{ src: "https://example.com/featured.jpg", alt: altTextOfLength( 4 ) },
				{ src: "https://example.com/gallery.jpg", alt: altTextOfLength( 300 ) },
				{ src: "https://example.com/variation.jpg", alt: altTextOfLength( 100 ) },
			],
		} );

		expect( altTextLength( paper ) ).toEqual( {
			tooShort: 1,
			tooLong: 1,
			flagged: [ "https://example.com/featured.jpg", "https://example.com/gallery.jpg" ],
		} );
	} );

	it( "reports the producer's id when it sends one, so a consumer can match the image to its own data", () => {
		const paper = new Paper( "", {
			providedImages: [
				{ id: 8, src: "https://example.com/featured.jpg", alt: altTextOfLength( 4 ) },
				{ id: 12, src: "https://example.com/gallery.jpg", alt: altTextOfLength( 300 ) },
				{ id: 15, src: "https://example.com/variation.jpg", alt: altTextOfLength( 100 ) },
			],
		} );

		expect( altTextLength( paper ) ).toEqual( { tooShort: 1, tooLong: 1, flagged: [ 8, 12 ] } );
	} );

	it( "lists one identifier for images in the text that share a src, while still counting both", () => {
		const paper = new Paper( "<img src='a.jpg' alt='short' /><img src='a.jpg' alt='tiny' />" );
		buildTree( paper, new Researcher( paper ) );

		expect( altTextLength( paper ) ).toEqual( { tooShort: 2, tooLong: 0, flagged: [ "a.jpg" ] } );
	} );

	it( "counts nothing when the producer opts in with an empty list of provided images", () => {
		const paper = new Paper( "<img src='https://example.com/in-text.jpg' alt='short' />", { providedImages: [] } );

		expect( altTextLength( paper ) ).toEqual( { tooShort: 0, tooLong: 0, flagged: [] } );
	} );
} );
