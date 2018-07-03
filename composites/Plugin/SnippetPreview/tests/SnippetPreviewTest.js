import SnippetPreview from "../components/SnippetPreview";
import { MODE_DESKTOP, MODE_MOBILE } from "../constants";
import React from "react";
import { createComponentWithIntl } from "../../../../utils/intlProvider";
import {
	mountWithIntl,
} from "../../../../utils/helpers/intl-enzyme-test-helper";

const defaultArgs = {
	description: "Description",
	title: "Title",
	url: "https://example.org",
	mode: MODE_DESKTOP,
	onMouseUp: jest.fn(),
};

const renderSnapshotWithArgs = ( changedArgs ) => {
	const args = { ...defaultArgs, ...changedArgs };
	const tree = createComponentWithIntl( <SnippetPreview {...args} /> )
		.toJSON();

	expect( tree ).toMatchSnapshot();
};

const mountWithArgs = ( props ) => {
	return mountWithIntl(
		<SnippetPreview
			{ ...defaultArgs }
			{ ...props } />
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

	it( "highlights keywords inside the description and url", () => {
		renderSnapshotWithArgs( {
			description: "Something with a keyword",
			url: "https://example.org/this-keyword-url",
			keyword: "keyword",
		} );
	} );

	it( "highlights keywords even if they are transliterated", () => {
		renderSnapshotWithArgs( {
			description: "Something with a transliterated kaayword",
			keyword: "kåyword",
			locale: "da_DK",
		} );
	} );

	it( "adds a trailing slash to the url", () => {
		const wrapper = mountWithArgs( { mode: MODE_DESKTOP, url: "https://example.org/this-url" } );

		expect( wrapper.find( "SnippetPreview__BaseUrlOverflowContainer" ).text() ).toBe( "https://example.org/this-url/" );
	} );

	it( "does not add a trailing slash to the url", () => {
		const wrapper = mountWithArgs( { mode: MODE_DESKTOP, url: "https://example.org/this-url/" } );

		expect( wrapper.find( "SnippetPreview__BaseUrlOverflowContainer" ).text() ).toBe( "https://example.org/this-url/" );
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

		it( "doesn't percent encode characters that are percent encoded by node's url.parse", () => {
			const wrapper = mountWithArgs( { mode: MODE_MOBILE, url: "http://www.google.nl/`^ {}" } );

			expect( wrapper.find( "SnippetPreview__BaseUrlOverflowContainer" ).text() ).toBe( "www.google.nl › `^ {}" );
		} );
	} );
} );
