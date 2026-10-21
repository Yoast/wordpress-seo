import nonDescriptiveAltText from "../../../src/languageProcessing/researches/nonDescriptiveAltText";
import Researcher from "../../../src/languageProcessing/languages/en/Researcher";
import DefaultResearcher from "../../../src/languageProcessing/languages/_default/Researcher";
import Paper from "../../../src/values/Paper";
import buildTree from "../../specHelpers/parse/buildTree";

const buildSrc = ( index ) => `https://example.com/image-${ index }.jpg`;

/**
 * Builds a Paper with the given images in its text and parses it, so the images end up in the tree.
 *
 * @param {string[]} altTexts The alt text of each image to put in the text.
 *
 * @returns {Paper} The parsed paper.
 */
const buildPaperWithImages = ( altTexts ) => {
	const text = altTexts.map( ( alt, index ) => `<img src='${ buildSrc( index ) }' alt='${ alt }' />` ).join( "" );
	const paper = new Paper( text );
	buildTree( paper, new Researcher( paper ) );

	return paper;
};

/**
 * Runs the research with an English researcher, so the English phrases apply.
 *
 * @param {Paper} paper The paper to run the research on.
 *
 * @returns {{count: number, flagged: Array<string|number>}} The research result.
 */
const research = ( paper ) => nonDescriptiveAltText( paper, new Researcher( paper ) );

/**
 * Runs the research on a single provided image with the given source and alt text.
 *
 * @param {string}     src             The image source.
 * @param {string}     alt             The alt text.
 * @param {Function}   [ResearcherType] The researcher class to use.
 *
 * @returns {{count: number, flagged: Array<string|number>}} The research result.
 */
const researchProvidedImage = ( src, alt, ResearcherType = Researcher ) => {
	const paper = new Paper( "", { providedImages: [ { src, alt } ] } );

	return nonDescriptiveAltText( paper, new ResearcherType( paper ) );
};

describe( "a research that counts the images whose alt text is non-descriptive", () => {
	it( "counts no images when the paper has no images", () => {
		expect( research( buildPaperWithImages( [] ) ) ).toEqual( { count: 0, flagged: [] } );
	} );

	it( "does not count an image without alt text", () => {
		const paper = new Paper( "<img src='https://example.com/image.jpg' /><img src='https://example.com/image.jpg' alt='' />" );
		buildTree( paper, new Researcher( paper ) );

		expect( research( paper ) ).toEqual( { count: 0, flagged: [] } );
	} );

	it( "counts an alt text with surrounding whitespace, because `getAltAttribute` strips it", () => {
		expect( research( buildPaperWithImages( [ "  Product image  " ] ) ) ).toEqual( { count: 1, flagged: [ buildSrc( 0 ) ] } );
	} );

	it( "counts an alt text with whitespace inside it, because the whitespace is collapsed", () => {
		expect( research( buildPaperWithImages( [ "Product    image" ] ) ) ).toEqual( { count: 1, flagged: [ buildSrc( 0 ) ] } );
	} );

	it( "counts only the images whose alt text is non-descriptive", () => {
		const paper = buildPaperWithImages( [ "Product image", "A red bike on a beach", "IMG_1234" ] );

		expect( research( paper ) ).toEqual( { count: 2, flagged: [ buildSrc( 0 ), buildSrc( 2 ) ] } );
	} );

	it( "counts the paper's provided images instead of the text when the producer opts in", () => {
		const paper = new Paper( "<img src='https://example.com/in-text.jpg' alt='Image' />", {
			providedImages: [
				{ src: "https://example.com/featured.jpg", alt: "Product photo" },
				{ src: "https://example.com/gallery.jpg", alt: "A red mug on a desk" },
			],
		} );

		expect( research( paper ) ).toEqual( { count: 1, flagged: [ "https://example.com/featured.jpg" ] } );
	} );

	it( "reports the producer's id when it sends one, so a consumer can match the image to its own data", () => {
		const paper = new Paper( "", {
			providedImages: [
				{ id: 8, src: "https://example.com/featured.jpg", alt: "Untitled" },
				{ id: 12, src: "https://example.com/gallery.jpg", alt: "A red mug on a desk" },
			],
		} );

		expect( research( paper ) ).toEqual( { count: 1, flagged: [ 8 ] } );
	} );

	it( "lists one identifier for images in the text that share a src, while still counting both", () => {
		const paper = new Paper( "<img src='a.jpg' alt='Image 1' /><img src='a.jpg' alt='Image 2' />" );
		buildTree( paper, new Researcher( paper ) );

		expect( research( paper ) ).toEqual( { count: 2, flagged: [ "a.jpg" ] } );
	} );

	it( "counts an image that carries neither an id nor a src, but cannot flag it", () => {
		const paper = new Paper( "", { providedImages: [ { alt: "Placeholder" } ] } );

		expect( research( paper ) ).toEqual( { count: 1, flagged: [] } );
	} );

	it( "counts nothing when the producer opts in with an empty list of provided images", () => {
		const paper = new Paper( "<img src='https://example.com/in-text.jpg' alt='Image' />", { providedImages: [] } );

		expect( research( paper ) ).toEqual( { count: 0, flagged: [] } );
	} );
} );

describe( "the non-descriptive alt text checks for every language", () => {
	it.each( [
		[ "-", "only punctuation" ],
		[ ".", "only punctuation" ],
		[ "...", "only punctuation" ],
		[ "1234", "only a number" ],
		[ "2026-03-14", "only a date" ],
		[ "#1 / 2", "only numbers, punctuation and symbols" ],
		[ "red-shoes.jpg", "a file name" ],
		[ "Red Shoes.JPEG", "a file name with an uppercase extension" ],
		[ "logo.svg", "a file name" ],
		[ "photo.webp", "a file name" ],
		[ "IMG_1234", "a camera file name" ],
		[ "img_20260314_103245", "a phone file name in lowercase" ],
		[ "IMG-1234", "a camera file name with a hyphen" ],
		[ "IMG_1234 (1)", "a copied camera file name" ],
		[ "DSC_0012", "a camera file name" ],
		[ "DSC01234", "a camera file name without a separator" ],
		[ "DSCN0001", "a camera file name" ],
		[ "PXL_20260314_103245123", "a Pixel phone file name" ],
		[ "DJI_0001", "a drone file name" ],
		[ "GOPR0001", "an action camera file name" ],
		[ "MVIMG_20260314_103245", "a motion photo file name" ],
		[ "WhatsApp Image 2026-03-14 at 10.32.45", "a WhatsApp file name" ],
		[ "WhatsApp Bild 2026-03-14 um 10.32.45", "a translated WhatsApp file name" ],
	] )( "counts the alt text \"%s\": %s", ( altText ) => {
		expect( researchProvidedImage( "https://example.com/photo-1.jpg", altText, DefaultResearcher ).count ).toBe( 1 );
	} );

	it.each( [
		[ "red-running-shoes.jpg", "the file name with its extension" ],
		[ "red-running-shoes", "the file name without its extension" ],
		[ "Red-Running-Shoes", "the file name in another case" ],
	] )( "counts the alt text \"%s\" for the image red-running-shoes.jpg: %s", ( altText ) => {
		expect( researchProvidedImage( "https://example.com/uploads/red-running-shoes.jpg?ver=2", altText, DefaultResearcher ).count )
			.toBe( 1 );
	} );

	it.each( [
		[ "red running shoes", "only an exact match with the file name counts" ],
		[ "Red running shoes on a track", "a real description" ],
		[ "IMG_1234 of the harbour", "a camera file name followed by a description" ],
		[ "Top 10 sights", "a description containing a number" ],
		[ "WhatsApp logo", "no number follows" ],
		[ "Screenshot of the checkout page", "a description" ],
	] )( "does not count the alt text \"%s\": %s", ( altText ) => {
		expect( researchProvidedImage( "https://example.com/uploads/red-running-shoes.jpg", altText, DefaultResearcher ).count ).toBe( 0 );
	} );

	it.each( [
		[ "red-bike", "the file name without its size suffix" ],
		[ "Red-Bike", "the file name without its size suffix, in another case" ],
		[ "red-bike-1024x576", "the file name with its size suffix" ],
	] )( "counts the alt text \"%s\" for the resized copy red-bike-1024x576.jpg: %s", ( altText ) => {
		expect( researchProvidedImage( "https://example.com/uploads/red-bike-1024x576.jpg", altText, DefaultResearcher ).count ).toBe( 1 );
	} );

	it.each( [
		[ "red bike", "only an exact match with the file name counts" ],
		[ "red", "only the size suffix is removed, not other parts of the name" ],
		[ "red-bike-1024", "a size suffix needs both a width and a height" ],
	] )( "does not count the alt text \"%s\" for the resized copy red-bike-1024x576.jpg: %s", ( altText ) => {
		expect( researchProvidedImage( "https://example.com/uploads/red-bike-1024x576.jpg", altText, DefaultResearcher ).count ).toBe( 0 );
	} );

	it.each( [
		[ "red-bike_800x600.jpg", "a resized copy with a width and a height" ],
		[ "red-bike_800x.jpg", "a resized copy with a width only" ],
		[ "red-bike_x600.jpg", "a resized copy with a height only" ],
		[ "red-bike-e1700000000000.jpg", "an edited copy" ],
		[ "red-bike-e1700000000000-1024x576.jpg", "a resized copy of an edited image" ],
		[ "red-bike-scaled.jpg", "a scaled copy of a large upload" ],
		[ "red-bike-edited.jpg", "a copy edited in the block editor" ],
		[ "red-bike-edited-2.jpg", "a second copy edited in the block editor" ],
		[ "red-bike-edited-576x1024.jpg", "a resized copy of an image edited in the block editor" ],
		[ "red-bike-edited-2-576x1024.jpg", "a resized copy of a second image edited in the block editor" ],
		[ "red-bike-scaled-edited.jpg", "a scaled copy edited in the block editor" ],
		[ "red-bike-edited-scaled.jpg", "a large upload edited in the block editor, as WordPress names it" ],
	] )( "counts the alt text \"red-bike\" for %s: %s", ( fileName ) => {
		expect( researchProvidedImage( `https://example.com/uploads/${ fileName }?v=2`, "red-bike", DefaultResearcher ).count ).toBe( 1 );
	} );

	it.each( [
		[ "red-bike-e17.jpg", "an edit timestamp has at least ten digits" ],
		[ "red-bike-1024.jpg", "a size has an \"x\"" ],
		[ "red-bike-1024x576-e1700000000000.jpg", "the edit timestamp comes before the size, not after it" ],
		[ "red-bike-upscaled.jpg", "\"scaled\" has to be a separate part of the name" ],
		[ "red-bike-edit.jpg", "only \"edited\" is a suffix" ],
	] )( "does not count the alt text \"red-bike\" for %s: %s", ( fileName ) => {
		expect( researchProvidedImage( `https://example.com/uploads/${ fileName }`, "red-bike", DefaultResearcher ).count ).toBe( 0 );
	} );

	it( "keeps a name that only looks like a size, when nothing is left in front of it", () => {
		expect( researchProvidedImage( "https://example.com/uploads/1024x576.jpg", "1024x576", DefaultResearcher ).count ).toBe( 1 );
	} );

	it( "compares with the decoded file name", () => {
		expect( researchProvidedImage( "https://example.com/rode%20schoenen.jpg", "rode schoenen", DefaultResearcher ).count ).toBe( 1 );
	} );

	it( "does not throw on a file name with a malformed escape sequence", () => {
		expect( researchProvidedImage( "https://example.com/100%.jpg", "100%.jpg", DefaultResearcher ).count ).toBe( 1 );
	} );
} );

describe( "the non-descriptive alt text phrases for English", () => {
	it.each( [
		[ "Image" ],
		[ "image 1" ],
		[ "image1" ],
		[ "Image (1)" ],
		[ "Image(2)" ],
		[ "Image 1." ],
		[ "An image" ],
		[ "The picture" ],
		[ "Product image" ],
		[ "Product photo" ],
		[ "Gallery image 3" ],
		[ "The main image" ],
		[ "A featured image" ],
		[ "Hero image" ],
		[ "Background image" ],
		[ "Header image" ],
		[ "pic" ],
		[ "img" ],
		[ "Screenshot" ],
		[ "Untitled" ],
		[ "Untitled 2" ],
		[ "untitled-1" ],
		[ "Untitled design" ],
		[ "Unnamed (3)" ],
		[ "File" ],
		[ "File name" ],
		[ "Download 5" ],
		[ "Screenshot 2026-03-14 at 10.32.45" ],
		[ "Screen Shot 2026-03-14 at 10.32.45 AM" ],
		[ "Screenshot_20260314_103245" ],
		[ "None" ],
		[ "N/A" ],
		[ "na" ],
		[ "null" ],
		[ "undefined" ],
		[ "TODO" ],
		[ "Alt" ],
		[ "Alt text" ],
		[ "Add alt text" ],
		[ "Alternative text" ],
		[ "Description" ],
		[ "Image description" ],
		[ "Picture description" ],
		[ "Insert description here" ],
		[ "Placeholder" ],
		[ "Default" ],
		[ "Product" ],
		[ "The product" ],
		[ "Gallery" ],
		[ "The gallery" ],
		[ "Header" ],
		[ "The header" ],
		[ "Background" ],
		[ "A background" ],
		[ "No image" ],
		[ "No image available" ],
		[ "Image not found" ],
		[ "Coming soon" ],
		[ "Thumbnail" ],
		[ "Banner" ],
		[ "Avatar" ],
		[ "Profile picture" ],
		[ "Slide" ],
		[ "Divider" ],
		[ "Line" ],
		[ "Shape" ],
		[ "Logo" ],
		[ "Company logo" ],
		[ "Site logo" ],
		[ "Brand logo" ],
		[ "Our logo" ],
	] )( "counts the alt text \"%s\"", ( altText ) => {
		expect( research( buildPaperWithImages( [ altText ] ) ) ).toEqual( { count: 1, flagged: [ buildSrc( 0 ) ] } );
	} );

	it.each( [
		[ "Product image of a red bike on a beach", "the phrase is followed by a description" ],
		[ "An image of a dog", "the phrase is followed by a description" ],
		[ "Imagery", "a different word that starts with a phrase" ],
		[ "Hero of the match", "the phrase is followed by a description" ],
		[ "Yoast logo", "the logo is named" ],
		[ "Screenshot of the checkout page", "a screenshot name without a number" ],
		[ "Screenshot 2026-03-14 of the checkout page", "a screenshot name followed by more than five letters" ],
		[ "The image the image", "the phrase is repeated" ],
		[ "Main", "\"main\" only counts with a noun after it" ],
		[ "Featured", "\"featured\" only counts with a noun after it" ],
		[ "Hero", "\"hero\" only counts with a noun after it" ],
		[ "The hero", "\"hero\" only counts with a noun after it" ],
		[ "The file", "an article only goes before an image noun or a word that is non-descriptive on its own" ],
	] )( "does not count the alt text \"%s\": %s", ( altText ) => {
		expect( research( buildPaperWithImages( [ altText ] ) ) ).toEqual( { count: 0, flagged: [] } );
	} );
} );

describe( "the research for a language without a phrase list", () => {
	it( "does not count a phrase from another language", () => {
		expect( researchProvidedImage( "https://example.com/photo.jpg", "Product image", DefaultResearcher ) ).toEqual( { count: 0, flagged: [] } );
	} );

	it( "still runs the checks for every language", () => {
		expect( researchProvidedImage( "https://example.com/photo.jpg", "IMG_1234", DefaultResearcher ) )
			.toEqual( { count: 1, flagged: [ "https://example.com/photo.jpg" ] } );
	} );
} );
