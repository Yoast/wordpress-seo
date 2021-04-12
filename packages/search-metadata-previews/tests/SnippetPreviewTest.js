import { mount } from "enzyme";
import React from "react";
import { MODE_DESKTOP, MODE_MOBILE } from "../src/snippet-preview/constants";
import SnippetPreview from "../src/snippet-preview/SnippetPreview";

const defaultArgs = {
	description: "Description",
	title: "Title",
	url: "https://example.org",
	mode: MODE_DESKTOP,
	onMouseUp: jest.fn(),
};

/**
 * Mounts a snippet preview component with changed arguments.
 *
 * @param {object} props The component's props.
 *
 * @returns {ReactElement} The SnippetPreview component.
 */
const mountWithArgs = ( props ) => {
	return mount(
		<SnippetPreview
			{ ...defaultArgs }
			{ ...props }
		/>
	);
};

describe( "SnippetPreview", () => {
	describe( "breadcrumbs", () => {
		it( "properly renders multiple breadcrumbs in mobile view", () => {
			const wrapper = mountWithArgs( { mode: MODE_MOBILE, url: "http://www.google.nl/about" } );

			expect( wrapper.find( "SnippetPreview__BaseUrlOverflowContainer" ).text() ).toBe( "www.google.nl › about" );
		} );

		it( "doesn't percent encode characters that are percent encoded by node's url.parse in mobile view", () => {
			const wrapper = mountWithArgs( { mode: MODE_MOBILE, url: "http://www.google.nl/`^ {}" } );

			expect( wrapper.find( "SnippetPreview__BaseUrlOverflowContainer" ).text() ).toBe( "www.google.nl › `^ {}" );
		} );

		it( "properly renders multiple breadcrumbs in desktop view", () => {
			const wrapper = mountWithArgs( { mode: MODE_DESKTOP, url: "http://example.org/this-url" } );

			expect( wrapper.find( "SnippetPreview__BaseUrlOverflowContainer" ).text() ).toBe( "example.org › this-url" );
		} );

		it( "properly renders multiple breadcrumbs in desktop view without a trailing slash", () => {
			const wrapper = mountWithArgs( { mode: MODE_DESKTOP, url: "http://example.org/this-url/" } );

			expect( wrapper.find( "SnippetPreview__BaseUrlOverflowContainer" ).text() ).toBe( "example.org › this-url" );
		} );

		it( "strips http protocol in mobile view", () => {
			const wrapper = mountWithArgs( { mode: MODE_MOBILE, url: "http://www.google.nl/about" } );

			expect( wrapper.find( "SnippetPreview__BaseUrlOverflowContainer" ).text() ).toBe( "www.google.nl › about" );
		} );

		it( "strips https protocol in mobile view", () => {
			const wrapper = mountWithArgs( { mode: MODE_MOBILE, url: "https://www.google.nl/about" } );

			expect( wrapper.find( "SnippetPreview__BaseUrlOverflowContainer" ).text() ).toBe( "www.google.nl › about" );
		} );

		it( "strips http protocol in desktop view", () => {
			const wrapper = mountWithArgs( { mode: MODE_DESKTOP, url: "http://www.google.nl/about" } );

			expect( wrapper.find( "SnippetPreview__BaseUrlOverflowContainer" ).text() ).toBe( "www.google.nl › about" );
		} );

		it( "strips https protocol in desktop view", () => {
			const wrapper = mountWithArgs( { mode: MODE_DESKTOP, url: "https://www.google.nl/about" } );

			expect( wrapper.find( "SnippetPreview__BaseUrlOverflowContainer" ).text() ).toBe( "www.google.nl › about" );
		} );
	} );
} );
