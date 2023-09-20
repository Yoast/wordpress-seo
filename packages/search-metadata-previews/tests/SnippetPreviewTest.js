
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

};

describe( "SnippetPreview", () => {
	describe( "breadcrumbs", () => {
		it( "properly renders multiple breadcrumbs in mobile view", () => {

		} );

		it( "doesn't percent encode characters that are percent encoded by node's url.parse in mobile view", () => {

		} );

		it( "properly renders multiple breadcrumbs in desktop view", () => {

		} );

		it( "properly renders multiple breadcrumbs in desktop view without a trailing slash", () => {

		} );

		it( "strips http protocol in mobile view", () => {

		} );

		it( "strips https protocol in mobile view", () => {

		} );

		it( "strips http protocol in desktop view", () => {

		} );

		it( "strips https protocol in desktop view", () => {

		} );
	} );
} );
