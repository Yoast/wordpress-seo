import SnippetPreview, { DESKTOP, MOBILE } from "../components/SnippetPreview";
import React from "react";
import renderer from "react-test-renderer";
import PropTypes from "prop-types";

const defaultArgs = {
	description: "Description",
	title: "Title",
	url: "https://example.org",
	mode: DESKTOP,
	onClick: jest.fn(),
};

const renderSnapshotWithArgs = ( changedArgs ) => {
	const args = { ...defaultArgs, ...changedArgs };
	const tree = renderer
		.create( <SnippetPreview {...args} /> )
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
			renderSnapshotWithArgs( { mode: MOBILE } );
		} );
	} );
} );



// 	title: PropTypes.string.isRequired,
//  url: PropTypes.string.isRequired,
// 	description: PropTypes.string.isRequired,
// 	date: PropTypes.string,
// 	breadcrumbs: PropTypes.array,
//
// 	hoveredField: PropTypes.string,
// 	activeField: PropTypes.string,
// 	keyword: PropTypes.string,
// 	isDescriptionGenerated: PropTypes.bool,
// 	locale: PropTypes.string,
// 	mode: PropTypes.oneOf( [ DESKTOP, MOBILE ] ),
//
// 	onClick: PropTypes.func.isRequired,
// 	onHover: PropTypes.func,
// 	onMouseOver: PropTypes.func,
// 	onMouseLeave: PropTypes.func,
