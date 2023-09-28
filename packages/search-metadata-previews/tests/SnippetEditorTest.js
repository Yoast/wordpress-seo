import React from "react";
import SnippetEditor from "../src/snippet-editor/SnippetEditor";
import { render, screen, fireEvent } from "./test-utils";

const defaultData = {
	title: "Test title",
	slug: "test-slug",
	description: "Test description, %%replacement_variable%%",
};

const defaultArgs = {
	baseUrl: "http://example.org/",
	siteName: "Test site name",
	data: defaultData,
	isOpen: true,
	onChange: () => {},
};

describe( "SnippetEditor", () => {
	it( "Mobile mode", async() => {
		const { container } = render( <SnippetEditor { ...defaultArgs } /> );
		const desktopRadioInput = screen.getByLabelText( "Desktop result" );
		const mobileRadioInput = screen.getByLabelText( "Mobile result" );
		expect( desktopRadioInput ).not.toBeChecked();
	    expect( mobileRadioInput ).toBeChecked();
		expect( container ).toMatchSnapshot();
	} );
	it( "Desktop mode", async() => {
		const { container } = render( <SnippetEditor { ...defaultArgs } mode="desktop" /> );
		const desktopRadioInput = screen.getByLabelText( "Desktop result" );
		const mobileRadioInput = screen.getByLabelText( "Mobile result" );
		expect( desktopRadioInput ).toBeChecked();
	    expect( mobileRadioInput ).not.toBeChecked();
		expect( container ).toMatchSnapshot();
	} );

	it( "Without close snippet editor button", async() => {
		const { container } = render( <SnippetEditor { ...defaultArgs } showCloseButton={ false } /> );
		expect( container ).toMatchSnapshot();
	} );

	describe( "Snippet editor defaults", () => {
		beforeEach( () => {
			render( <SnippetEditor { ...defaultArgs } /> );
		} );
		it( "Close snippet editor with button", async() => {
			const openSnippetEditorButton = screen.getByText( "Edit snippet" );
			expect( openSnippetEditorButton ).toBeInTheDocument();
			fireEvent.click( openSnippetEditorButton );
			const closeSnippetEditorButton = screen.getByText( "Close snippet editor" );
			expect( closeSnippetEditorButton ).toBeInTheDocument();
			fireEvent.click( closeSnippetEditorButton );
			expect( closeSnippetEditorButton ).not.toBeInTheDocument();
		} );
	} );
} );
