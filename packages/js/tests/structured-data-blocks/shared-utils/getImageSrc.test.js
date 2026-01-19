import { getImageSrc } from "../../../src/structured-data-blocks/shared-utils/getImageSrc";

describe( "getImageSrc", () => {
	describe( "when contents is not valid", () => {
		it( "should return false when contents is null", () => {
			const result = getImageSrc( null );
			expect( result ).toBe( false );
		} );

		it( "should return false when contents is undefined", () => {
			const result = getImageSrc( undefined );
			expect( result ).toBe( false );
		} );

		it( "should return false when contents is a number", () => {
			const result = getImageSrc( 123 );
			expect( result ).toBe( false );
		} );

		it( "should return false when contents is a boolean", () => {
			const result = getImageSrc( true );
			expect( result ).toBe( false );
		} );

		it( "should return false when contents is an object", () => {
			const result = getImageSrc( { foo: "bar" } );
			expect( result ).toBe( false );
		} );
	} );

	describe( "when contents is an array", () => {
		describe( "and array is empty or has no images", () => {
			it( "should return false when array is empty", () => {
				const result = getImageSrc( [] );
				expect( result ).toBe( false );
			} );

			it( "should return false when array has no image elements", () => {
				const contents = [
					{ type: "p", props: { children: "Paragraph" } },
					{ type: "div", props: { children: "Div" } },
				];
				const result = getImageSrc( contents );
				expect( result ).toBe( false );
			} );

			it( "should return false when array contains only null values", () => {
				const result = getImageSrc( [ null, null, null ] );
				expect( result ).toBe( false );
			} );

			it( "should return false when array contains only undefined values", () => {
				const result = getImageSrc( [ undefined, undefined ] );
				expect( result ).toBe( false );
			} );

			it( "should return false when array contains strings", () => {
				const result = getImageSrc( [ "text1", "text2" ] );
				expect( result ).toBe( false );
			} );
		} );

		describe( "and array contains image elements", () => {
			it( "should return src when image element with src is found", () => {
				const contents = [
					{ type: "img", props: { src: "https://example.com/image.jpg", alt: "Test" } },
				];
				const result = getImageSrc( contents );
				expect( result ).toBe( "https://example.com/image.jpg" );
			} );

			it( "should return src of the first image when multiple images exist", () => {
				const contents = [
					{ type: "img", props: { src: "https://example.com/image1.jpg", alt: "First" } },
					{ type: "img", props: { src: "https://example.com/image2.jpg", alt: "Second" } },
					{ type: "img", props: { src: "https://example.com/image3.jpg", alt: "Third" } },
				];
				const result = getImageSrc( contents );
				expect( result ).toBe( "https://example.com/image1.jpg" );
			} );

			it( "should return src when image is mixed with other elements", () => {
				const contents = [
					{ type: "p", props: { children: "Paragraph" } },
					{ type: "div", props: { children: "Div" } },
					{ type: "img", props: { src: "https://example.com/found.jpg", alt: "Found" } },
					{ type: "span", props: { children: "Span" } },
				];
				const result = getImageSrc( contents );
				expect( result ).toBe( "https://example.com/found.jpg" );
			} );

			it( "should return false when image element has no src", () => {
				const contents = [
					{ type: "img", props: { alt: "No source" } },
				];
				const result = getImageSrc( contents );
				expect( result ).toBe( false );
			} );

			it( "should return false when image element has empty src", () => {
				const contents = [
					{ type: "img", props: { src: "", alt: "Empty source" } },
				];
				const result = getImageSrc( contents );
				expect( result ).toBe( false );
			} );

			it( "should return false when image element has null src", () => {
				const contents = [
					{ type: "img", props: { src: null, alt: "Null source" } },
				];
				const result = getImageSrc( contents );
				expect( result ).toBe( false );
			} );

			it( "should return false when image element has undefined src", () => {
				const contents = [
					{ type: "img", props: { src: undefined, alt: "Undefined source" } },
				];
				const result = getImageSrc( contents );
				expect( result ).toBe( false );
			} );

			it( "should handle image element with no props", () => {
				const contents = [
					{ type: "img" },
				];
				const result = getImageSrc( contents );
				expect( result ).toBe( false );
			} );

			it( "should handle image element with null props", () => {
				const contents = [
					{ type: "img", props: null },
				];
				const result = getImageSrc( contents );
				expect( result ).toBe( false );
			} );

			it( "should return src with relative path", () => {
				const contents = [
					{ type: "img", props: { src: "/images/test.jpg" } },
				];
				const result = getImageSrc( contents );
				expect( result ).toBe( "/images/test.jpg" );
			} );

			it( "should return src with data URI", () => {
				const dataUri = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA";
				const contents = [
					{ type: "img", props: { src: dataUri } },
				];
				const result = getImageSrc( contents );
				expect( result ).toBe( dataUri );
			} );

			it( "should skip null/undefined elements before finding image", () => {
				const contents = [
					null,
					undefined,
					{ type: "p", props: { children: "Text" } },
					null,
					{ type: "img", props: { src: "https://example.com/image.jpg" } },
				];
				const result = getImageSrc( contents );
				expect( result ).toBe( "https://example.com/image.jpg" );
			} );

			it( "should handle image element with additional attributes", () => {
				const contents = [
					{
						type: "img",
						props: {
							src: "https://example.com/image.jpg",
							alt: "Test",
							width: 100,
							height: 200,
							className: "test-class",
						},
					},
				];
				const result = getImageSrc( contents );
				expect( result ).toBe( "https://example.com/image.jpg" );
			} );
		} );
	} );

	describe( "when contents is a string", () => {
		describe( "and string is empty or has no images", () => {
			it( "should return false when string is empty", () => {
				const result = getImageSrc( "" );
				expect( result ).toBe( false );
			} );

			it( "should return false when string has no img tags", () => {
				const result = getImageSrc( "<p>This is just a paragraph</p>" );
				expect( result ).toBe( false );
			} );

			it( "should return false when string contains 'img' text but no img tags", () => {
				const result = getImageSrc( "<p>This text mentions img but has no image tags</p>" );
				expect( result ).toBe( false );
			} );

			it( "should return false when string only contains whitespace", () => {
				const result = getImageSrc( "   \n\t  " );
				expect( result ).toBe( false );
			} );
		} );

		describe( "and string contains img tags", () => {
			it( "should extract src from single img tag", () => {
				const html = '<img src="https://example.com/image.jpg" alt="Test">';
				const result = getImageSrc( html );
				expect( result ).toBe( "https://example.com/image.jpg" );
			} );

			it( "should extract src from self-closing img tag", () => {
				const html = '<img src="https://example.com/image.jpg" alt="Test" />';
				const result = getImageSrc( html );
				expect( result ).toBe( "https://example.com/image.jpg" );
			} );

			it( "should extract src from first image when multiple images exist", () => {
				const html = `
					<img src="https://example.com/image1.jpg" alt="First">
					<img src="https://example.com/image2.jpg" alt="Second">
					<img src="https://example.com/image3.jpg" alt="Third">
				`;
				const result = getImageSrc( html );
				expect( result ).toBe( "https://example.com/image1.jpg" );
			} );

			it( "should extract src from img tag with single quotes", () => {
				const html = "<img src='https://example.com/image.jpg' alt='Test'>";
				const result = getImageSrc( html );
				expect( result ).toBe( "https://example.com/image.jpg" );
			} );

			it( "should extract src from img tag within complex HTML", () => {
				const html = `
					<div>
						<p>Some text</p>
						<section>
							<img src="https://example.com/nested.jpg" alt="Nested">
						</section>
					</div>
				`;
				const result = getImageSrc( html );
				expect( result ).toBe( "https://example.com/nested.jpg" );
			} );

			it( "should extract relative URL", () => {
				const html = '<img src="/images/test.jpg" alt="Relative">';
				const result = getImageSrc( html );
				expect( result ).toContain( "/images/test.jpg" );
			} );

			it( "should extract src with query parameters", () => {
				const html = '<img src="https://example.com/image.jpg?w=300&h=200" alt="With params">';
				const result = getImageSrc( html );
				expect( result ).toBe( "https://example.com/image.jpg?w=300&h=200" );
			} );

			it( "should extract src with special characters", () => {
				const html = '<img src="https://example.com/image-with-special_chars%20(1).jpg" alt="Special">';
				const result = getImageSrc( html );
				expect( result ).toBe( "https://example.com/image-with-special_chars%20(1).jpg" );
			} );

			it( "should handle img tag with multiple attributes", () => {
				const html = '<img src="https://example.com/image.jpg" alt="Test" width="100" height="200" class="test-class" id="test-id">';
				const result = getImageSrc( html );
				expect( result ).toBe( "https://example.com/image.jpg" );
			} );

			it( "should handle img tag with attributes in different order", () => {
				const html = '<img alt="Test" width="100" src="https://example.com/image.jpg" height="200">';
				const result = getImageSrc( html );
				expect( result ).toBe( "https://example.com/image.jpg" );
			} );

			it( "should handle img tag with extra whitespace", () => {
				const html = '<img   src="https://example.com/image.jpg"   alt="Test"   >';
				const result = getImageSrc( html );
				expect( result ).toBe( "https://example.com/image.jpg" );
			} );

			it( "should handle img tag with newlines in attributes", () => {
				const html = `<img
					src="https://example.com/image.jpg"
					alt="Test"
				>`;
				const result = getImageSrc( html );
				expect( result ).toBe( "https://example.com/image.jpg" );
			} );

			it( "should return false when img tag has no src attribute", () => {
				const html = '<img alt="No source">';
				const result = getImageSrc( html );
				expect( result ).toBe( false );
			} );

			it( "should return false when img tag has empty src", () => {
				const html = '<img src="" alt="Empty source">';
				const result = getImageSrc( html );
				expect( result ).toBe( false );
			} );

			it( "should handle data URI", () => {
				const html = '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA" alt="Data URI">';
				const result = getImageSrc( html );
				expect( result ).toBe( "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA" );
			} );

			it( "should handle img tag with srcset attribute", () => {
				const html = '<img src="https://example.com/image.jpg" srcset="image-2x.jpg 2x" alt="Responsive">';
				const result = getImageSrc( html );
				expect( result ).toBe( "https://example.com/image.jpg" );
			} );

			it( "should handle img tag with loading attribute", () => {
				const html = '<img src="https://example.com/image.jpg" loading="lazy" alt="Lazy">';
				const result = getImageSrc( html );
				expect( result ).toBe( "https://example.com/image.jpg" );
			} );

			it( "should handle img tag with WordPress-specific class", () => {
				const html = '<img src="https://example.com/image.jpg" class="wp-image-123" alt="WP">';
				const result = getImageSrc( html );
				expect( result ).toBe( "https://example.com/image.jpg" );
			} );

			it( "should return false when first image has no src", () => {
			// querySelector returns the first img element, which has no src
				const html = `
				<img alt="No source">
				<img src="https://example.com/valid.jpg" alt="Valid">
			`;
				const result = getImageSrc( html );
				expect( result ).toBe( false );
			} );
		} );
	} );
} );

