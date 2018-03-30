import SnippetPreview, { MODE_DESKTOP, MODE_MOBILE } from "../components/SnippetPreview";
import React from "react";
import renderer from "react-test-renderer";
import { createComponentWithIntl } from "../../../../utils/intlProvider";

const defaultArgs = {
	description: "Description",
	title: "Title",
	url: "https://example.org",
	mode: MODE_DESKTOP,
	onClick: jest.fn(),
};

const renderSnapshotWithArgs = ( changedArgs ) => {
	const args = { ...defaultArgs, ...changedArgs };
	const tree = createComponentWithIntl( <SnippetPreview {...args} /> )
		.toJSON();

	expect( tree ).toMatchSnapshot();
};

describe( "SnippetPreview", () => {
	it( "renders a SnippetPreview that looks like Google", () => {
		renderSnapshotWithArgs( {} );
	} );

	it( "shows the date if a date is passed", () => {
		renderSnapshotWithArgs( { date: "Today" } );
	} );

	it( "changes the colors of the description if it was generated", () => {
		renderSnapshotWithArgs( { isDescriptionGenerated: true } );
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

	describe( "mobile mode", () => {
		it( "renders differently than desktop", () => {
			renderSnapshotWithArgs( { mode: MODE_MOBILE } );
		} );

		it( "renders an AMP logo when isAmp is true", () => {
			renderSnapshotWithArgs( { mode: MODE_MOBILE, isAmp: true } );
		} );
	} );
} );
