import { createElement } from "@wordpress/element";
import { childrenToString, getImageArray } from "../../../src/structured-data-blocks/shared-utils/migrationHelpers270";

describe( "migrationHelpers270", () => {
	describe( "childrenToString", () => {
		describe( "when value is falsy", () => {
			it( "should return empty string when value is null", () => {
				const result = childrenToString( null );
				expect( result ).toBe( "" );
			} );

			it( "should return empty string when value is undefined", () => {
				const result = childrenToString( undefined );
				expect( result ).toBe( "" );
			} );

			it( "should return empty string when value is false", () => {
				const result = childrenToString( false );
				expect( result ).toBe( "" );
			} );

			it( "should return empty string when value is 0", () => {
				const result = childrenToString( 0 );
				expect( result ).toBe( "" );
			} );

			it( "should return empty string when value is empty string", () => {
				const result = childrenToString( "" );
				expect( result ).toBe( "" );
			} );
		} );

		describe( "when value is a string", () => {
			it( "should return the string as-is", () => {
				const input = "<p>Hello World</p>";
				const result = childrenToString( input );
				expect( result ).toBe( "<p>Hello World</p>" );
			} );

			it( "should handle plain text strings", () => {
				const input = "Plain text";
				const result = childrenToString( input );
				expect( result ).toBe( "Plain text" );
			} );

			it( "should handle strings with special characters", () => {
				const input = "Text with & special < characters >";
				const result = childrenToString( input );
				expect( result ).toBe( "Text with & special < characters >" );
			} );

			it( "should handle multi-line strings", () => {
				const input = "Line 1\nLine 2\nLine 3";
				const result = childrenToString( input );
				expect( result ).toBe( "Line 1\nLine 2\nLine 3" );
			} );
		} );

		describe( "when value is an array", () => {
			it( "should convert array of strings to single string", () => {
				const input = [ "First", "Second", "Third" ];
				const result = childrenToString( input );
				expect( result ).toBe( "FirstSecondThird" );
			} );

			it( "should convert array of React elements to HTML string", () => {
				const input = [
					createElement( "p", null, "Paragraph 1" ),
					createElement( "p", null, "Paragraph 2" ),
				];
				const result = childrenToString( input );
				expect( result ).toContain( "Paragraph 1" );
				expect( result ).toContain( "Paragraph 2" );
			} );

			it( "should handle mixed array of strings and React elements", () => {
				const input = [
					"Plain text",
					createElement( "strong", null, "Bold text" ),
					" more text",
				];
				const result = childrenToString( input );
				expect( result ).toContain( "Plain text" );
				expect( result ).toContain( "Bold text" );
				expect( result ).toContain( "more text" );
			} );

			it( "should handle array with nested React elements", () => {
				const input = [
					createElement( "div", null,
						createElement( "p", null, "Nested paragraph" )
					),
				];
				const result = childrenToString( input );
				expect( result ).toContain( "Nested paragraph" );
			} );

			it( "should filter out null values in array", () => {
				const input = [
					"First",
					null,
					"Second",
					null,
				];
				const result = childrenToString( input );
				expect( result ).toBe( "FirstSecond" );
			} );

			it( "should filter out undefined values in array", () => {
				const input = [
					"First",
					undefined,
					"Second",
				];
				const result = childrenToString( input );
				expect( result ).toBe( "FirstSecond" );
			} );

			it( "should handle array with only null/undefined values", () => {
				const input = [ null, undefined, null ];
				const result = childrenToString( input );
				expect( result ).toBe( "" );
			} );

			it( "should handle empty array", () => {
				const input = [];
				const result = childrenToString( input );
				expect( result ).toBe( "" );
			} );

			it( "should handle array with image elements", () => {
				const input = [
					createElement( "img", { src: "https://example.com/image.jpg", alt: "Test" } ),
				];
				const result = childrenToString( input );
				expect( result ).toContain( "image.jpg" );
			} );

			it( "should handle array with elements with complex props", () => {
				const input = [
					createElement( "div", { className: "container", id: "test" },
						createElement( "span", null, "Content" )
					),
				];
				const result = childrenToString( input );
				expect( result ).toContain( "Content" );
			} );

			it( "should use fallback when renderToString fails", () => {
				// Create an input that might cause renderToString to fail
				const problematicItem = {
					type: "div",
					props: { children: "Content" },
				};
				const input = [ problematicItem ];
				const result = childrenToString( input );
				// Should still return some content via fallback
				expect( typeof result ).toBe( "string" );
			} );

			it( "should handle items without props in fallback", () => {
				const input = [
					"Text",
					// No props
					{ type: "span" },
					"More text",
				];
				const result = childrenToString( input );
				expect( result ).toContain( "Text" );
				expect( result ).toContain( "More text" );
			} );

			it( "should handle arrays with multiple nested levels", () => {
				const input = [
					createElement( "div", null,
						createElement( "ul", null,
							createElement( "li", null, "Item 1" ),
							createElement( "li", null, "Item 2" )
						)
					),
				];
				const result = childrenToString( input );
				expect( result ).toContain( "Item 1" );
				expect( result ).toContain( "Item 2" );
			} );
		} );

		describe( "when value is other types", () => {
			it( "should return empty string for number", () => {
				const result = childrenToString( 123 );
				expect( result ).toBe( "" );
			} );

			it( "should return empty string for object", () => {
				const result = childrenToString( { foo: "bar" } );
				expect( result ).toBe( "" );
			} );

			it( "should return empty string for boolean true", () => {
				const result = childrenToString( true );
				expect( result ).toBe( "" );
			} );
		} );
	} );

	describe( "getImageArray", () => {
		describe( "when imageArray already has images", () => {
			it( "should return existing imageArray unchanged", () => {
				const existingImages = [
					{ type: "img", key: null, props: { src: "image1.jpg", alt: "Alt 1", className: "", style: "" } },
					{ type: "img", key: null, props: { src: "image2.jpg", alt: "Alt 2", className: "", style: "" } },
				];
				const content = "Some text content";

				const result = getImageArray( existingImages, content );

				expect( result ).toBe( existingImages );
				expect( result ).toHaveLength( 2 );
			} );

			it( "should return existing imageArray even when content is array", () => {
				const existingImages = [
					{ type: "img", key: null, props: { src: "existing.jpg", alt: "", className: "", style: "" } },
				];
				const content = [
					{ type: "img", props: { src: "new.jpg", alt: "New" } },
				];

				const result = getImageArray( existingImages, content );

				expect( result ).toBe( existingImages );
				expect( result[ 0 ].props.src ).toBe( "existing.jpg" );
			} );
		} );

		describe( "when imageArray is empty and content is array", () => {
			it( "should extract images from content array", () => {
				const emptyImages = [];
				const content = [
					{ type: "img", key: "img1", props: { src: "image1.jpg", alt: "Alt 1", className: "test-class", style: "width: 100px" } },
					{ type: "p", props: { children: "Paragraph" } },
					{ type: "img", key: "img2", props: { src: "image2.jpg", alt: "Alt 2" } },
				];

				const result = getImageArray( emptyImages, content );

				expect( result ).toHaveLength( 2 );
				expect( result[ 0 ].type ).toBe( "img" );
				expect( result[ 0 ].key ).toBe( "img1" );
				expect( result[ 0 ].props.src ).toBe( "image1.jpg" );
				expect( result[ 0 ].props.alt ).toBe( "Alt 1" );
				expect( result[ 0 ].props.className ).toBe( "test-class" );
				expect( result[ 0 ].props.style ).toBe( "width: 100px" );

				expect( result[ 1 ].type ).toBe( "img" );
				expect( result[ 1 ].key ).toBe( "img2" );
				expect( result[ 1 ].props.src ).toBe( "image2.jpg" );
				expect( result[ 1 ].props.alt ).toBe( "Alt 2" );
			} );

			it( "should handle images with partial props", () => {
				const emptyImages = [];
				// Missing alt, className, style
				const content = [
					{ type: "img", props: { src: "image.jpg" } },
				];

				const result = getImageArray( emptyImages, content );

				expect( result ).toHaveLength( 1 );
				expect( result[ 0 ].props.src ).toBe( "image.jpg" );
				expect( result[ 0 ].props.alt ).toBe( "" );
				expect( result[ 0 ].props.className ).toBe( "" );
				expect( result[ 0 ].props.style ).toBe( "" );
			} );

			it( "should handle images with no props", () => {
				const emptyImages = [];
				// No props at all
				const content = [
					{ type: "img" },
				];

				const result = getImageArray( emptyImages, content );

				expect( result ).toHaveLength( 1 );
				expect( result[ 0 ].props.src ).toBe( "" );
				expect( result[ 0 ].props.alt ).toBe( "" );
			} );

			it( "should filter out non-image elements", () => {
				const emptyImages = [];
				const content = [
					{ type: "p", props: { children: "Paragraph" } },
					{ type: "div", props: { children: "Div" } },
					{ type: "img", props: { src: "image.jpg", alt: "Only image" } },
					{ type: "span", props: { children: "Span" } },
				];

				const result = getImageArray( emptyImages, content );

				expect( result ).toHaveLength( 1 );
				expect( result[ 0 ].props.src ).toBe( "image.jpg" );
			} );

			it( "should return empty array when content has no images", () => {
				const emptyImages = [];
				const content = [
					{ type: "p", props: { children: "Paragraph" } },
					{ type: "div", props: { children: "Div" } },
				];

				const result = getImageArray( emptyImages, content );

				expect( result ).toEqual( [] );
			} );

			it( "should handle null nodes in content", () => {
				const emptyImages = [];
				const content = [
					null,
					{ type: "img", props: { src: "image.jpg", alt: "Test" } },
					null,
				];

				const result = getImageArray( emptyImages, content );

				expect( result ).toHaveLength( 1 );
				expect( result[ 0 ].props.src ).toBe( "image.jpg" );
			} );

			it( "should handle undefined nodes in content", () => {
				const emptyImages = [];
				const content = [
					undefined,
					{ type: "img", props: { src: "image.jpg", alt: "Test" } },
				];

				const result = getImageArray( emptyImages, content );

				expect( result ).toHaveLength( 1 );
			} );

			it( "should handle nodes without type property", () => {
				const emptyImages = [];
				const content = [
				// No type property
					{ props: { src: "image.jpg" } },
					{ type: "img", props: { src: "valid.jpg", alt: "Valid" } },
				];

				const result = getImageArray( emptyImages, content );

				expect( result ).toHaveLength( 1 );
				expect( result[ 0 ].props.src ).toBe( "valid.jpg" );
			} );

			it( "should handle empty content array", () => {
				const emptyImages = [];
				const content = [];

				const result = getImageArray( emptyImages, content );

				expect( result ).toEqual( [] );
			} );
		} );

		describe( "when imageArray is empty and content is not array", () => {
			it( "should return empty array when content is string", () => {
				const emptyImages = [];
				const content = "<img src='image.jpg' alt='Test'>";

				const result = getImageArray( emptyImages, content );

				expect( result ).toEqual( [] );
			} );

			it( "should return empty array when content is null", () => {
				const emptyImages = [];
				const content = null;

				const result = getImageArray( emptyImages, content );

				expect( result ).toEqual( [] );
			} );

			it( "should return empty array when content is undefined", () => {
				const emptyImages = [];
				const content = undefined;

				const result = getImageArray( emptyImages, content );

				expect( result ).toEqual( [] );
			} );

			it( "should return empty array when content is object", () => {
				const emptyImages = [];
				const content = { type: "img", props: { src: "image.jpg" } };

				const result = getImageArray( emptyImages, content );

				expect( result ).toEqual( [] );
			} );
		} );

		describe( "edge cases", () => {
			it( "should handle multiple images with same key", () => {
				const emptyImages = [];
				const content = [
					{ type: "img", key: "same-key", props: { src: "image1.jpg", alt: "First" } },
					{ type: "img", key: "same-key", props: { src: "image2.jpg", alt: "Second" } },
				];

				const result = getImageArray( emptyImages, content );

				expect( result ).toHaveLength( 2 );
			} );

			it( "should handle images with null key", () => {
				const emptyImages = [];
				const content = [
					{ type: "img", key: null, props: { src: "image.jpg", alt: "Test" } },
				];

				const result = getImageArray( emptyImages, content );

				expect( result ).toHaveLength( 1 );
				expect( result[ 0 ].key ).toBeNull();
			} );

			it( "should handle images with undefined key", () => {
				const emptyImages = [];
				const content = [
				// No key property
					{ type: "img", props: { src: "image.jpg", alt: "Test" } },
				];

				const result = getImageArray( emptyImages, content );

				expect( result ).toHaveLength( 1 );
				expect( result[ 0 ].key ).toBeUndefined();
			} );

			it( "should preserve image props structure", () => {
				const emptyImages = [];
				const content = [
					{
						type: "img",
						key: "test-key",
						props: {
							src: "https://example.com/image.jpg",
							alt: "Test Alt",
							className: "wp-image-123",
							style: "max-width: 100%; height: auto;",
						},
					},
				];

				const result = getImageArray( emptyImages, content );

				expect( result[ 0 ] ).toEqual( {
					type: "img",
					key: "test-key",
					props: {
						src: "https://example.com/image.jpg",
						alt: "Test Alt",
						className: "wp-image-123",
						style: "max-width: 100%; height: auto;",
					},
				} );
			} );
		} );
	} );
} );

