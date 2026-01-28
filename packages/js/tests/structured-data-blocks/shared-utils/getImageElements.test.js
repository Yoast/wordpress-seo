import { getImageElements } from "../../../src/structured-data-blocks/shared-utils/getImageElements";

describe( "getImageElements", () => {
	describe( "when content is not valid", () => {
		it( "should return an empty array when content is not a string", () => {
			expect( getImageElements( null ) ).toEqual( [] );
			expect( getImageElements( undefined ) ).toEqual( [] );
			expect( getImageElements( 123 ) ).toEqual( [] );
			expect( getImageElements( {} ) ).toEqual( [] );
			expect( getImageElements( [] ) ).toEqual( [] );
		} );

		it( "should return an empty array when content is an empty string", () => {
			const result = getImageElements( "" );
			expect( result ).toEqual( [] );
		} );

		it( "should return an empty array when content does not contain img tags", () => {
			const content = "<p>This is a paragraph with no images.</p>";
			const result = getImageElements( content );
			expect( result ).toEqual( [] );
		} );

		it( "should return an empty array when content contains 'img' text but no img tags", () => {
			const content = "<p>This text mentions img but has no image tags.</p>";
			const result = getImageElements( content );
			expect( result ).toEqual( [] );
		} );
	} );

	describe( "when content contains single image", () => {
		it( "should extract a single image with src in double quotes", () => {
			const content = "<img src=\"https://example.com/image.jpg\" alt=\"Test image\">";
			const result = getImageElements( content );

			expect( result ).toHaveLength( 1 );
			// eslint-disable-next-line jsx-a11y/img-redundant-alt,react/jsx-key
			expect( result ).toEqual( [ <img alt="Test image" src="https://example.com/image.jpg" /> ] );
			expect( result[ 0 ].props.src ).toBe( "https://example.com/image.jpg" );
			expect( result[ 0 ].props.alt ).toBe( "Test image" );
		} );

		it( "should extract a single image with src in single quotes", () => {
			const content = "<img src='https://example.com/image.jpg' alt='Test image'>";
			const result = getImageElements( content );

			expect( result ).toHaveLength( 1 );
			expect( result[ 0 ].props.src ).toBe( "https://example.com/image.jpg" );
			expect( result[ 0 ].props.alt ).toBe( "Test image" );
		} );

		it( "should extract a self-closing image tag", () => {
			const content = "<img src=\"https://example.com/image.jpg\" alt=\"Test\" />";
			const result = getImageElements( content );

			expect( result ).toHaveLength( 1 );
			expect( result[ 0 ].props.src ).toBe( "https://example.com/image.jpg" );
		} );

		it( "should extract an image with only src attribute", () => {
			const content = "<img src=\"https://example.com/image.jpg\"/>";
			const result = getImageElements( content );

			expect( result ).toHaveLength( 1 );
			expect( result[ 0 ].props.src ).toBe( "https://example.com/image.jpg" );
		} );

		it( "should extract an image with multiple attributes", () => {
			const content = "<img src=\"https://example.com/image.jpg\" alt=\"Test\" width=\"100\" height=\"200\" class=\"test-class\" id=\"test-id\">";
			const result = getImageElements( content );

			expect( result ).toHaveLength( 1 );
			expect( result[ 0 ].props.src ).toBe( "https://example.com/image.jpg" );
			expect( result[ 0 ].props.alt ).toBe( "Test" );
			expect( result[ 0 ].props.width ).toBe( "100" );
			expect( result[ 0 ].props.height ).toBe( "200" );
		} );

		it( "should extract an image with data attributes", () => {
			const content = "<img src=\"https://example.com/image.jpg\" data-id=\"123\" data-lazy=\"true\">";
			const result = getImageElements( content );

			expect( result ).toHaveLength( 1 );
			expect( result[ 0 ].props.src ).toBe( "https://example.com/image.jpg" );
			expect( result[ 0 ].props[ "data-id" ] ).toBe( "123" );
		} );

		it( "should extract an image with relative URL", () => {
			const content = "<img src=\"/images/test.jpg\" alt=\"Relative path\">";
			const result = getImageElements( content );

			expect( result ).toHaveLength( 1 );
			expect( result[ 0 ].props.src ).toBe( "/images/test.jpg" );
		} );

		it( "should extract an image with data URI", () => {
			const content = "<img src=\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA\" alt=\"Data URI\">";
			const result = getImageElements( content );

			expect( result ).toHaveLength( 1 );
			expect( result[ 0 ].props.src ).toBe( "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA" );
		} );
	} );

	describe( "when content contains multiple images", () => {
		it( "should extract multiple images with different attributes", () => {
			const content = `
				<img src="https://example.com/image1.jpg" alt="Image 1">
				<img src="https://example.com/image2.png" alt="Image 2">
				<img src="https://example.com/image3.gif" alt="Image 3">
			`;
			const result = getImageElements( content );

			expect( result ).toHaveLength( 3 );
			expect( result[ 0 ].props.src ).toBe( "https://example.com/image1.jpg" );
			expect( result[ 1 ].props.src ).toBe( "https://example.com/image2.png" );
			expect( result[ 2 ].props.src ).toBe( "https://example.com/image3.gif" );
		} );

		it( "should extract images from complex HTML content", () => {
			const content = `
				<div>
					<p>Some text before</p>
					<img src="https://example.com/image1.jpg" alt="First">
					<p>Text in between</p>
					<img src="https://example.com/image2.jpg" alt="Second">
					<p>Text after</p>
				</div>
			`;
			const result = getImageElements( content );

			expect( result ).toHaveLength( 2 );
			expect( result[ 0 ].props.src ).toBe( "https://example.com/image1.jpg" );
			expect( result[ 1 ].props.src ).toBe( "https://example.com/image2.jpg" );
		} );

		it( "should extract images with mixed quote styles", () => {
			const content = `
				<img src="https://example.com/image1.jpg" alt="Double quotes">
				<img src='https://example.com/image2.jpg' alt='Single quotes'>
			`;
			const result = getImageElements( content );

			expect( result ).toHaveLength( 2 );
			expect( result[ 0 ].props.src ).toBe( "https://example.com/image1.jpg" );
			expect( result[ 1 ].props.src ).toBe( "https://example.com/image2.jpg" );
		} );

		it( "should extract all images even when nested in various elements", () => {
			const content = `
				<article>
					<header><img src="https://example.com/header.jpg" alt="Header"></header>
					<section>
						<div>
							<img src="https://example.com/content.jpg" alt="Content">
						</div>
					</section>
					<footer><img src="https://example.com/footer.jpg" alt="Footer"></footer>
				</article>
			`;
			const result = getImageElements( content );

			expect( result ).toHaveLength( 3 );
			expect( result[ 0 ].props.alt ).toBe( "Header" );
			expect( result[ 1 ].props.alt ).toBe( "Content" );
			expect( result[ 2 ].props.alt ).toBe( "Footer" );
		} );
	} );

	describe( "when content contains images with WordPress-specific attributes", () => {
		it( "should handle images with wp-image class", () => {
			const content = '<img src="https://example.com/image.jpg" class="wp-image-123" alt="WordPress">';
			const result = getImageElements( content );

			expect( result ).toHaveLength( 1 );
			expect( result[ 0 ].props.className ).toBe( "wp-image-123" );
		} );

		it( "should handle images with size attributes", () => {
			const content = '<img src="https://example.com/image.jpg" width="1024" height="768" alt="Sized">';
			const result = getImageElements( content );

			expect( result ).toHaveLength( 1 );
			expect( result[ 0 ].props.width ).toBe( "1024" );
			expect( result[ 0 ].props.height ).toBe( "768" );
		} );
	} );
} );

