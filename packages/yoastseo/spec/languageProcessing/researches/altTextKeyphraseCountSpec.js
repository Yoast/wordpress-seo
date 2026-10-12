import altTextKeyphraseCount from "../../../src/languageProcessing/researches/altTextKeyphraseCount";
import Researcher from "../../../src/languageProcessing/languages/en/Researcher";
import JapaneseResearcher from "../../../src/languageProcessing/languages/ja/Researcher";
import Paper from "../../../src/values/Paper";
import buildTree from "../../specHelpers/parse/buildTree";
import getMorphologyData from "../../specHelpers/getMorphologyData";

const morphologyDataEN = getMorphologyData( "en" );

const src = ( index ) => `https://example.com/image-${ index }.jpg`;

/**
 * Builds a Paper with the given images in its text and parses it, so the images end up in the tree.
 *
 * @param {string[]} altTexts   The alt text of each image to put in the text.
 * @param {Object}   attributes The attributes to build the Paper with.
 *
 * @returns {Paper} The parsed paper.
 */
const paperWithImages = ( altTexts, attributes ) => {
	const text = altTexts.map( ( alt, index ) => `<img src='${ src( index ) }' alt='${ alt }' />` ).join( "" );
	const paper = new Paper( text, attributes );
	buildTree( paper, new Researcher( paper ) );

	return paper;
};

/**
 * Runs the research with an English researcher.
 *
 * @param {Paper}   paper            The paper to run the research on.
 * @param {boolean} [withMorphology] Whether to add the English morphology data.
 *
 * @returns {Object} The research result.
 */
const research = ( paper, withMorphology = false ) => {
	const researcher = new Researcher( paper );
	if ( withMorphology ) {
		researcher.addResearchData( "morphology", morphologyDataEN );
	}
	return altTextKeyphraseCount( paper, researcher );
};

describe( "a research that counts the keyphrase and synonyms in the alt text of each image", () => {
	it( "returns no images when there is no keyphrase", () => {
		expect( research( paperWithImages( [ "cat cat cat" ], {} ) ) ).toEqual( { exactMatchRequested: false, images: [] } );
	} );

	it( "returns no images when the paper has no images", () => {
		expect( research( paperWithImages( [], { keyword: "cat" } ) ) ).toEqual( { exactMatchRequested: false, images: [] } );
	} );

	it( "skips images without alt text", () => {
		const paper = new Paper( `<img src='${ src( 0 ) }' /><img src='${ src( 1 ) }' alt='' />`, { keyword: "cat" } );
		buildTree( paper, new Researcher( paper ) );

		expect( research( paper ).images ).toEqual( [] );
	} );

	it.each( [
		[ "a dog on a sofa", 0 ],
		[ "a cat on a sofa", 1 ],
		[ "a cat and a cat on a sofa", 2 ],
		[ "cat, cat and cat", 3 ],
	] )( "counts the keyphrase in the alt text '%s'", ( altText, count ) => {
		expect( research( paperWithImages( [ altText ], { keyword: "cat" } ) ).images ).toEqual( [ { identifier: src( 0 ), count } ] );
	} );

	it( "returns a count for each image with alt text", () => {
		const paper = paperWithImages( [ "a cat", "a cat and a cat", "a dog" ], { keyword: "cat" } );

		expect( research( paper ).images ).toEqual( [
			{ identifier: src( 0 ), count: 1 },
			{ identifier: src( 1 ), count: 2 },
			{ identifier: src( 2 ), count: 0 },
		] );
	} );

	it( "counts a multi-word keyphrase only when all its words occur", () => {
		const paper = paperWithImages( [ "red shoes and red socks with blue shoes" ], { keyword: "red shoes" } );

		// "red" occurs twice and "shoes" twice, so there are two full matches.
		expect( research( paper ).images[ 0 ].count ).toBe( 2 );
	} );

	it( "counts a multi-word keyphrase as the lowest count among its words", () => {
		const paper = paperWithImages( [ "red shoes, red socks, red hats" ], { keyword: "red shoes" } );

		expect( research( paper ).images[ 0 ].count ).toBe( 1 );
	} );

	it( "adds up the keyphrase and the synonyms", () => {
		const paper = paperWithImages( [ "red shoes next to crimson sneakers" ], { keyword: "red shoes", synonyms: "crimson sneakers" } );

		expect( research( paper ).images[ 0 ].count ).toBe( 2 );
	} );

	it( "adds up several synonyms", () => {
		const paper = paperWithImages( [ "a cat, a kitten and a feline" ], { keyword: "cat", synonyms: "kitten, feline" } );

		expect( research( paper ).images[ 0 ].count ).toBe( 3 );
	} );

	it( "does not count words that the keyphrase matched again for a synonym", () => {
		const paper = paperWithImages( [ "red shoes on a shelf" ], { keyword: "red shoes", synonyms: "shoes" } );

		expect( research( paper ).images[ 0 ].count ).toBe( 1 );
	} );

	it( "does not count words that a synonym matched again for the next synonym", () => {
		const paper = paperWithImages( [ "red shoes on a shelf" ], { keyword: "sneakers", synonyms: "red shoes, shoes, red" } );

		expect( research( paper ).images[ 0 ].count ).toBe( 1 );
	} );

	it( "counts word forms when morphology is available", () => {
		const paper = paperWithImages( [ "a cat with two other cats" ], { keyword: "cat" } );

		expect( research( paper, true ).images[ 0 ].count ).toBe( 2 );
	} );

	describe( "with exact matching", () => {
		it( "reports that exact matching is requested", () => {
			const paper = paperWithImages( [ "red shoes" ], { keyword: "\"red shoes\"" } );

			expect( research( paper ).exactMatchRequested ).toBe( true );
		} );

		it( "only counts the exact phrase", () => {
			const paper = paperWithImages( [ "red shoes and shoes that are red" ], { keyword: "\"red shoes\"" } );

			expect( research( paper ).images[ 0 ].count ).toBe( 1 );
		} );

		it( "counts the exact phrase every time it occurs", () => {
			const paper = paperWithImages( [ "red shoes next to red shoes" ], { keyword: "\"red shoes\"" } );

			expect( research( paper ).images[ 0 ].count ).toBe( 2 );
		} );

		it( "does not count other word forms", () => {
			const paper = paperWithImages( [ "a cat with two other cats" ], { keyword: "\"cat\"" } );

			expect( research( paper, true ).images[ 0 ].count ).toBe( 1 );
		} );
	} );

	describe( "with provided images", () => {
		it( "counts the provided images instead of the images in the text, identified by their id", () => {
			const paper = new Paper( `<img src='${ src( 0 ) }' alt='cat cat cat' />`, {
				keyword: "cat",
				providedImages: [
					{ id: 12, src: "https://example.com/product.jpg", alt: "a cat and a cat" },
					{ src: "https://example.com/gallery.jpg", alt: "a cat" },
				],
			} );

			expect( research( paper ).images ).toEqual( [
				{ identifier: 12, count: 2 },
				{ identifier: "https://example.com/gallery.jpg", count: 1 },
			] );
		} );
	} );

	describe( "in Japanese", () => {
		it( "counts the keyphrase with the Japanese word matching", () => {
			const paper = new Paper( "", {
				keyword: "猫",
				locale: "ja",
				providedImages: [ { id: 1, src: "a.jpg", alt: "猫、猫、猫" } ],
			} );

			expect( altTextKeyphraseCount( paper, new JapaneseResearcher( paper ) ).images ).toEqual( [ { identifier: 1, count: 3 } ] );
		} );

		it( "counts the exact phrase with exact matching", () => {
			const paper = new Paper( "", {
				keyword: "「黒猫」",
				locale: "ja",
				providedImages: [ { id: 1, src: "a.jpg", alt: "黒猫と黒猫" } ],
			} );

			expect( altTextKeyphraseCount( paper, new JapaneseResearcher( paper ) ) ).toEqual( {
				exactMatchRequested: true,
				images: [ { identifier: 1, count: 2 } ],
			} );
		} );
	} );
} );
