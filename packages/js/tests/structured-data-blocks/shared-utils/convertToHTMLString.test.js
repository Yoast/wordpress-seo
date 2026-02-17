import { createElement } from "@wordpress/element";
import { convertToHTMLString } from "../../../src/structured-data-blocks/shared-utils/convertToHTMLString";

describe( "convertToHTMLString", () => {
	describe( "when contents is not an array", () => {
		it( "should return the string as-is when contents is a string", () => {
			const input = "<p>Hello World</p>";
			const result = convertToHTMLString( input );

			expect( result ).toBe( "<p>Hello World</p>" );
		} );

		it( "should return the input as-is when contents is a number", () => {
			const input = 42;
			const result = convertToHTMLString( input );

			expect( result ).toBe( 42 );
		} );

		it( "should return the input as-is when contents is an object", () => {
			const input = { foo: "bar" };
			const result = convertToHTMLString( input );

			expect( result ).toEqual( { foo: "bar" } );
		} );

		it( "should return undefined when contents is undefined", () => {
			const input = undefined;
			const result = convertToHTMLString( input );

			expect( result ).toBeUndefined();
		} );

		it( "should return null when contents is null", () => {
			const input = null;
			const result = convertToHTMLString( input );

			expect( result ).toBeNull();
		} );
	} );

	describe( "when contents is an array", () => {
		it( "should return an empty string when array is empty", () => {
			const input = [];
			const result = convertToHTMLString( input );

			expect( result ).toBe( "" );
		} );

		it( "should return an empty string when array contains only falsy values", () => {
			const input = [ null, undefined, false, "" ];
			const result = convertToHTMLString( input );

			expect( result ).toBe( "" );
		} );

		it( "should convert array of strings to a single HTML string", () => {
			const input = [ "<p>First</p>", "<p>Second</p>", "<p>Third</p>" ];
			const result = convertToHTMLString( input );

			expect( result ).toBe( "<p>First</p><p>Second</p><p>Third</p>" );
		} );

		it( "should convert React elements to HTML strings", () => {
			const input = [
				createElement( "p", null, "First paragraph" ),
				createElement( "p", null, "Second paragraph" ),
			];
			const result = convertToHTMLString( input );

			expect( result ).toBe( "<p>First paragraph</p><p>Second paragraph</p>" );
		} );

		it( "should convert React elements with attributes to HTML strings", () => {
			const input = [
				createElement( "div", { className: "container" }, "Content" ),
				createElement( "span", { id: "test-id" }, "Text" ),
			];
			const result = convertToHTMLString( input );

			expect( result ).toContain( "Content" );
			expect( result ).toContain( "Text" );
		} );

		it( "should handle nested React elements", () => {
			const input = [
				createElement( "div", null,
					createElement( "p", null, "Nested content" )
				),
			];
			const result = convertToHTMLString( input );

			expect( result ).toBe( "<div><p>Nested content</p></div>" );
		} );

		it( "should handle mixed array of strings and React elements", () => {
			const input = [
				"<h1>Title</h1>",
				createElement( "p", null, "Paragraph" ),
				"<span>Footer</span>",
			];
			const result = convertToHTMLString( input );

			expect( result ).toBe( "<h1>Title</h1><p>Paragraph</p><span>Footer</span>" );
		} );

		it( "should filter out null values in the array", () => {
			const input = [
				"<p>First</p>",
				null,
				"<p>Second</p>",
				null,
			];
			const result = convertToHTMLString( input );

			expect( result ).toBe( "<p>First</p><p>Second</p>" );
		} );

		it( "should filter out undefined values in the array", () => {
			const input = [
				"<p>First</p>",
				undefined,
				"<p>Second</p>",
			];
			const result = convertToHTMLString( input );

			expect( result ).toBe( "<p>First</p><p>Second</p>" );
		} );

		it( "should filter out false values in the array", () => {
			const input = [
				"<p>First</p>",
				false,
				"<p>Second</p>",
			];
			const result = convertToHTMLString( input );

			expect( result ).toBe( "<p>First</p><p>Second</p>" );
		} );

		it( "should handle empty strings in the array", () => {
			const input = [
				"<p>First</p>",
				"",
				"<p>Second</p>",
			];
			const result = convertToHTMLString( input );

			expect( result ).toBe( "<p>First</p><p>Second</p>" );
		} );

		it( "should handle complex mixed content", () => {
			const input = [
				"<div>Start</div>",
				null,
				createElement( "p", { className: "content" }, "Main content" ),
				undefined,
				"<span>Middle</span>",
				false,
				createElement( "footer", null, "End" ),
				"",
			];
			const result = convertToHTMLString( input );

			expect( result ).toContain( "<div>Start</div>" );
			expect( result ).toContain( "Main content" );
			expect( result ).toContain( "<span>Middle</span>" );
			expect( result ).toContain( "<footer>End</footer>" );
			expect( result ).not.toContain( "null" );
			expect( result ).not.toContain( "undefined" );
			expect( result ).not.toContain( "false" );
		} );

		it( "should handle React elements with multiple children", () => {
			const input = [
				createElement( "ul", null,
					createElement( "li", null, "Item 1" ),
					createElement( "li", null, "Item 2" ),
					createElement( "li", null, "Item 3" )
				),
			];
			const result = convertToHTMLString( input );

			expect( result ).toBe( "<ul><li>Item 1</li><li>Item 2</li><li>Item 3</li></ul>" );
		} );

		it( "should handle self-closing elements", () => {
			const input = [
				createElement( "img", { src: "test.jpg", alt: "Test" } ),
				createElement( "br" ),
			];
			const result = convertToHTMLString( input );

			expect( result ).toContain( "test.jpg" );
			expect( result ).toContain( "alt=\"Test\"" );
		} );

		it( "should preserve HTML entities in strings", () => {
			const input = [
				"&lt;p&gt;Escaped&lt;/p&gt;",
				"&amp; &copy; &trade;",
			];
			const result = convertToHTMLString( input );

			expect( result ).toBe( "&lt;p&gt;Escaped&lt;/p&gt;&amp; &copy; &trade;" );
		} );

		it( "should handle React fragments", () => {
			const input = [
				"First string sentence.",
				// eslint-disable-next-line react/jsx-key
				<img src="example.com/image.png" alt="Example" />,
				"Second string sentence.",
			];
			const result = convertToHTMLString( input );

			expect( result ).toContain( "First string sentence." );
			expect( result ).toContain( "<img src=\"example.com/image.png\" alt=\"Example\"/>" );
			expect( result ).toContain( "Second string sentence." );
		} );

		it( "should handle single element in array", () => {
			const input = [ "<p>Single element</p>" ];
			const result = convertToHTMLString( input );

			expect( result ).toBe( "<p>Single element</p>" );
		} );

		it( "should handle array with only whitespace strings", () => {
			const input = [ "   ", "\t", "\n" ];
			const result = convertToHTMLString( input );

			expect( result ).toBe( "   \t\n" );
		} );
	} );
} );

