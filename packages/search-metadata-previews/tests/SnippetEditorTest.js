import React from "react";
import SnippetEditor from "../src/snippet-editor/SnippetEditor";
import { fireEvent, render, screen, waitFor } from "./test-utils";

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
	onChange: jest.fn(),
};

describe( "SnippetEditor", () => {
	it( "Mobile mode", async() => {
		const { container } = render( <SnippetEditor { ...defaultArgs } /> );
		// Wait for any async state updates from Transition component
		await waitFor( () => expect( container.firstChild ).toBeInTheDocument() );
		const toggle = screen.getByRole( "switch", { name: /Google preview/i } );
		expect( toggle ).toHaveAttribute( "aria-checked", "false" );
		expect( screen.getByText( "Mobile" ) ).toHaveClass( "yst-text-slate-800" );
		expect( screen.getByText( "Desktop" ) ).toHaveClass( "yst-text-slate-500" );
		expect( container ).toMatchSnapshot();
	} );
	it( "Desktop mode and should switch to mobile", async() => {
		const { container } = render( <SnippetEditor { ...defaultArgs } mode="desktop" /> );
		// Wait for any async state updates from Transition component
		await waitFor( () => expect( container.firstChild ).toBeInTheDocument() );
		const toggle = screen.getByRole( "switch", { name: /Google preview/i } );
		expect( toggle ).toHaveAttribute( "aria-checked", "true" );
		expect( screen.getByText( "Mobile" ) ).toHaveClass( "yst-text-slate-500" );
		expect( screen.getByText( "Desktop" ) ).toHaveClass( "yst-text-slate-800" );
		expect( container ).toMatchSnapshot();

		fireEvent.click( toggle );
		expect( defaultArgs.onChange ).toHaveBeenCalledWith( "mode", "mobile" );
	} );

	it( "Without close snippet editor button", async() => {
		render( <SnippetEditor { ...defaultArgs } showCloseButton={ false } /> );
		expect( screen.queryByText( "Edit snippet" ) ).not.toBeInTheDocument();
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

		it( "should switch to desktop mode", () => {
			const toggle = screen.getByRole( "switch", { name: /Google preview/i } );
			fireEvent.click( toggle );
			expect( defaultArgs.onChange ).toHaveBeenCalledWith( "mode", "desktop" );
		} );
	} );
} );
