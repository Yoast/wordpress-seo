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
const paperWithImages = ( altTexts ) => {
	const text = altTexts.map( ( alt ) => `<img src='https://example.com/image.jpg' alt='${ alt }' />` ).join( "" );
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
		expect( altTextLength( paperWithImages( [] ) ) ).toEqual( { tooShort: 0, tooLong: 0 } );
	} );

	it( "does not count an image without alt text as too short", () => {
		const paper = new Paper( "<img src='https://example.com/image.jpg' /><img src='https://example.com/image.jpg' alt='' />" );
		buildTree( paper, new Researcher( paper ) );

		expect( altTextLength( paper ) ).toEqual( { tooShort: 0, tooLong: 0 } );
	} );

	it( "does not count alt text that is only whitespace, because `getAltAttribute` strips it", () => {
		expect( altTextLength( paperWithImages( [ "   " ] ) ) ).toEqual( { tooShort: 0, tooLong: 0 } );
	} );

	it.each( [
		[ 9, { tooShort: 1, tooLong: 0 } ],
		[ 10, { tooShort: 1, tooLong: 0 } ],
		[ 11, { tooShort: 0, tooLong: 0 } ],
	] )( "counts an alt text of %i characters at the lower boundary", ( length, expected ) => {
		expect( altTextLength( paperWithImages( [ altTextOfLength( length ) ] ) ) ).toEqual( expected );
	} );

	it.each( [
		[ 199, { tooShort: 0, tooLong: 0 } ],
		[ 200, { tooShort: 0, tooLong: 1 } ],
		[ 201, { tooShort: 0, tooLong: 1 } ],
	] )( "counts an alt text of %i characters at the upper boundary", ( length, expected ) => {
		expect( altTextLength( paperWithImages( [ altTextOfLength( length ) ] ) ) ).toEqual( expected );
	} );

	it( "counts too short and too long images on the same page separately", () => {
		const paper = paperWithImages( [ altTextOfLength( 5 ), altTextOfLength( 8 ), altTextOfLength( 250 ), altTextOfLength( 50 ) ] );

		expect( altTextLength( paper ) ).toEqual( { tooShort: 2, tooLong: 1 } );
	} );

	it( "counts the paper's provided images instead of the text when the producer opts in", () => {
		const paper = new Paper( "<img src='https://example.com/in-text.jpg' alt='short' />", {
			providedImages: [
				{ src: "https://example.com/featured.jpg", alt: altTextOfLength( 4 ) },
				{ src: "https://example.com/gallery.jpg", alt: altTextOfLength( 300 ) },
				{ src: "https://example.com/variation.jpg", alt: altTextOfLength( 100 ) },
			],
		} );

		expect( altTextLength( paper ) ).toEqual( { tooShort: 1, tooLong: 1 } );
	} );

	it( "counts nothing when the producer opts in with an empty list of provided images", () => {
		const paper = new Paper( "<img src='https://example.com/in-text.jpg' alt='short' />", { providedImages: [] } );

		expect( altTextLength( paper ) ).toEqual( { tooShort: 0, tooLong: 0 } );
	} );
} );
