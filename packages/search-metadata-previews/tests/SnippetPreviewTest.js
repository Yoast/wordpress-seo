import { mount } from "enzyme";
import React from "react";
import renderer from "react-test-renderer";
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
 * Renders a snippet preview snapshot with changed arguments.
 *
 * @param {Object} changedArgs The changed arguments.
 *
 * @returns {void}
 */
const renderSnapshotWithArgs = ( changedArgs ) => {
	const args = { ...defaultArgs, ...changedArgs };
	const tree = renderer.create( <SnippetPreview { ...args } /> )
		.toJSON();

	expect( tree ).toMatchSnapshot();
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
	it( "renders a SnippetPreview in the default mode", () => {
		renderSnapshotWithArgs( {
			// eslint-disable-next-line no-undefined
			mode: undefined,
		} );
	} );

	it( "renders a SnippetPreview that looks like Google", () => {
		renderSnapshotWithArgs( {} );
	} );

	it( "shows the date if a date is passed", () => {
		renderSnapshotWithArgs( { date: "Today" } );
	} );

	it( "changes the colors of the description if it was generated", () => {
		renderSnapshotWithArgs( { isDescriptionPlaceholder: true } );
	} );

	it( "renders a caret on hover", () => {
		renderSnapshotWithArgs( { hoveredField: "title" } );
		renderSnapshotWithArgs( { hoveredField: "description" } );
		renderSnapshotWithArgs( { hoveredField: "url" } );
	} );

	it( "renders a caret on activation", () => {
		renderSnapshotWithArgs( { activeField: "title" } );
		renderSnapshotWithArgs( { activeField: "description" } );
		renderSnapshotWithArgs( { activeField: "url" } );
	} );

	describe( "highlights keyphrase in desktop mode", () => {
		it( "highlights keywords inside the description and url", () => {
			renderSnapshotWithArgs( {
				mode: MODE_DESKTOP,
				description: "Something with a keyword",
				url: "https://example.org/this-keyword-url",
				wordsToHighlight: [ "keyword" ],
			} );
		} );

		it( "highlights keywords even if they are transliterated", () => {
			renderSnapshotWithArgs( {
				mode: MODE_DESKTOP,
				description: "Something with a transliterated kaayword",
				wordsToHighlight: [ "kåyword" ],
				locale: "da_DK",
			} );
		} );

		it( "highlights a keyword in different morphological forms", () => {
			renderSnapshotWithArgs( {
				mode: MODE_DESKTOP,
				description: "She runs every day and every run is longer than the previous. Running makes her happy.",
				wordsToHighlight: [ "run", "runs", "running" ],
			} );
		} );

		it( "highlights separate words from the keyphrase", () => {
			renderSnapshotWithArgs( {
				mode: MODE_DESKTOP,
				description: "She runs every day and every run is longer than the previous. Running makes her happy.",
				wordsToHighlight: [ "run", "runs", "running", "every" ],
			} );
		} );
	} );

	describe( "mobile mode", () => {
		it( "renders differently than desktop", () => {
			renderSnapshotWithArgs( { mode: MODE_MOBILE } );
		} );

		it( "renders an AMP logo when isAmp is true", () => {
			renderSnapshotWithArgs( { mode: MODE_MOBILE, isAmp: true } );
		} );
	} );

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
