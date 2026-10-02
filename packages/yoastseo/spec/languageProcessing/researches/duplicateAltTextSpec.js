import duplicateAltText from "../../../src/languageProcessing/researches/duplicateAltText";
import Researcher from "../../../src/languageProcessing/languages/en/Researcher";
import Paper from "../../../src/values/Paper";
import buildTree from "../../specHelpers/parse/buildTree";

/**
 * Builds a Paper with the given HTML as its text and parses it, so the images end up in the tree.
 *
 * @param {string} text The HTML of the text.
 *
 * @returns {Paper} The parsed paper.
 */
const parsedPaper = ( text ) => {
	const paper = new Paper( text );
	buildTree( paper, new Researcher( paper ) );

	return paper;
};

describe( "a research that counts the images that share their alt text with another image", () => {
	it( "counts nothing when the paper has no images", () => {
		expect( duplicateAltText( parsedPaper( "<p>No images here.</p>" ) ) ).toBe( 0 );
	} );

	it( "counts nothing when every image has a different alt text", () => {
		const paper = parsedPaper( "<img src='https://example.com/a.jpg' alt='A dog' /><img src='https://example.com/b.jpg' alt='A cat' />" );

		expect( duplicateAltText( paper ) ).toBe( 0 );
	} );

	it( "counts two different images with the same alt text", () => {
		const paper = parsedPaper( "<img src='https://example.com/a.jpg' alt='A dog' /><img src='https://example.com/b.jpg' alt='A dog' />" );

		expect( duplicateAltText( paper ) ).toBe( 2 );
	} );

	it( "counts every image in a group, so three images with the same alt text count as 3", () => {
		const paper = parsedPaper(
			"<img src='https://example.com/a.jpg' alt='A dog' />" +
			"<img src='https://example.com/b.jpg' alt='A dog' />" +
			"<img src='https://example.com/c.jpg' alt='A dog' />"
		);

		expect( duplicateAltText( paper ) ).toBe( 3 );
	} );

	it( "adds up the images of separate groups", () => {
		const paper = parsedPaper(
			"<img src='https://example.com/a.jpg' alt='A dog' /><img src='https://example.com/b.jpg' alt='A dog' />" +
			"<img src='https://example.com/c.jpg' alt='A cat' /><img src='https://example.com/d.jpg' alt='A cat' />" +
			"<img src='https://example.com/e.jpg' alt='A bird' />"
		);

		expect( duplicateAltText( paper ) ).toBe( 4 );
	} );

	it( "compares alt texts without case and surrounding whitespace", () => {
		const paper = parsedPaper( "<img src='https://example.com/a.jpg' alt='A dog' /><img src='https://example.com/b.jpg' alt=' a DOG ' />" );

		expect( duplicateAltText( paper ) ).toBe( 2 );
	} );

	it( "does not count images with an empty alt text or without alt text", () => {
		const paper = parsedPaper(
			"<img src='https://example.com/a.jpg' alt='' /><img src='https://example.com/b.jpg' alt='' />" +
			"<img src='https://example.com/c.jpg' /><img src='https://example.com/d.jpg' alt='   ' />"
		);

		expect( duplicateAltText( paper ) ).toBe( 0 );
	} );

	it( "does not count the same image used twice", () => {
		const paper = parsedPaper( "<img src='https://example.com/a.jpg' alt='A dog' /><img src='https://example.com/a.jpg' alt='A dog' />" );

		expect( duplicateAltText( paper ) ).toBe( 0 );
	} );

	it( "counts the same image used twice as one image when another image shares its alt text", () => {
		const paper = parsedPaper(
			"<img src='https://example.com/a.jpg' alt='A dog' />" +
			"<img src='https://example.com/a.jpg' alt='A dog' />" +
			"<img src='https://example.com/b.jpg' alt='A dog' />"
		);

		expect( duplicateAltText( paper ) ).toBe( 2 );
	} );

	it( "counts one image in two sizes as two images, because only the src identifies an image in the text", () => {
		const paper = parsedPaper(
			"<img src='https://example.com/photo.jpg' alt='A dog' class='wp-image-13' />" +
			"<img src='https://example.com/photo-300x225.jpg' alt='A dog' class='alignnone size-medium wp-image-13' />"
		);

		expect( duplicateAltText( paper ) ).toBe( 2 );
	} );

	it( "counts images without a src as different images", () => {
		const paper = parsedPaper( "<img alt='A dog' /><img alt='A dog' />" );

		expect( duplicateAltText( paper ) ).toBe( 2 );
	} );

	it( "uses the attachment id of the provided images, so one attachment with different URLs is counted once", () => {
		const paper = new Paper( "<img src='https://example.com/in-text.jpg' alt='A dog' />", {
			providedImages: [
				{ id: 11, src: "https://example.com/featured.jpg", alt: "A dog" },
				{ id: 11, src: "https://example.com/featured-300x300.jpg", alt: "A dog" },
			],
		} );

		expect( duplicateAltText( paper ) ).toBe( 0 );
	} );

	it( "counts different provided images with the same alt text, and ignores the images in the text", () => {
		const paper = new Paper( "<img src='https://example.com/in-text.jpg' alt='A ball' />", {
			providedImages: [
				{ id: 11, src: "https://example.com/featured.jpg", alt: "A ball" },
				{ id: 12, src: "https://example.com/gallery.jpg", alt: "A ball" },
				{ id: 13, src: "https://example.com/variation.jpg", alt: "A red ball" },
			],
		} );

		expect( duplicateAltText( paper ) ).toBe( 2 );
	} );

	it( "falls back to the src for provided images without an id", () => {
		const paper = new Paper( "", {
			providedImages: [
				{ src: "https://example.com/featured.jpg", alt: "A ball" },
				{ src: "https://example.com/featured.jpg", alt: "A ball" },
				{ src: "https://example.com/gallery.jpg", alt: "A ball" },
			],
		} );

		expect( duplicateAltText( paper ) ).toBe( 2 );
	} );

	it( "counts nothing when the producer opts in with an empty list of provided images", () => {
		const paper = new Paper( "<img src='https://example.com/a.jpg' alt='A dog' /><img src='https://example.com/b.jpg' alt='A dog' />", {
			providedImages: [],
		} );

		expect( duplicateAltText( paper ) ).toBe( 0 );
	} );
} );
