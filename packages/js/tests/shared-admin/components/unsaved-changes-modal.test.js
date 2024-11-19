import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { UnsavedChangesModal } from "../../../src/shared-admin/components";
import { fireEvent, render, screen } from "../../test-utils";

describe( "UnsavedChangesModal", () => {
	const onClose = jest.fn();
	const onDiscard = jest.fn();

	beforeEach( () => {
		jest.clearAllMocks();
		render( <UnsavedChangesModal
			isOpen={ true }
			onClose={ onClose }
			onDiscard={ onDiscard }
			title="Unsaved changes"
			description="There are unsaved changes in one or more steps of the first-time configuration. Leaving means that those changes will be lost. Are you sure you want to leave this page?"
			dismissLabel="No, continue editing"
			discardLabel="Yes, leave page"
		/> );
	} );

	it( "should have a role of dialog", () => {
		expect( screen.queryByRole( "dialog" ) ).toBeInTheDocument();
	} );

	it.each( [
		[ "dismiss", "No, continue editing" ],
		[ "discard", "Yes, leave page" ],
	] )( "should have the %s button: %s", ( _, text ) => {
		const button = screen.queryByText( text );
		expect( button ).toBeInTheDocument();
		expect( button.tagName ).toBe( "BUTTON" );
		expect( button ).toHaveAttribute( "type", "button" );
	} );

	it( "should have the close button", () => {
		const screenReaderText = screen.queryByText( "Close" );
		expect( screenReaderText ).toBeInTheDocument();
		expect( screenReaderText.parentElement ).toHaveAttribute( "type", "button" );
		expect( screenReaderText.parentElement.tagName ).toBe( "BUTTON" );
	} );

	it( "should have a title", () => {
		const title = screen.queryByText( "Unsaved changes" );
		expect( title ).toBeInTheDocument();
		expect( title.tagName ).toBe( "H1" );
	} );

	it( "should have a description", () => {
		const description = screen.queryByText( "There are unsaved changes in one or more steps of the first-time configuration. Leaving means that those changes will be lost. Are you sure you want to leave this page?" );
		expect( description ).toBeInTheDocument();
		expect( description.tagName ).toBe( "P" );
	} );

	it( "should call onClose when clicking the close button", () => {
		fireEvent.click( screen.queryByText( "Close" ) );
		expect( onClose ).toHaveBeenCalled();
	} );

	it( "should call onClose when clicking the continue editing button", () => {
		fireEvent.click( screen.queryByText( "No, continue editing" ) );
		expect( onClose ).toHaveBeenCalled();
	} );

	it( "should call onDiscard when clicking the leave page button", () => {
		fireEvent.click( screen.queryByText( "Yes, leave page" ) );
		expect( onDiscard ).toHaveBeenCalled();
	} );

	describe( "fallback props", () => {
		it( "should not throw an error when the onClose and onDiscard props are not passed", () => {
			const currentImplementation = console.error;
			console.error = jest.fn();

			render( <UnsavedChangesModal
				isOpen={ true }
				title="Unsaved changes"
				description="There are unsaved changes in one or more steps of the first-time configuration. Leaving means that those changes will be lost. Are you sure you want to leave this page?"
				dismissLabel="No, continue editing"
				discardLabel="Yes, leave page"
			/> );

			try {
				expect( console.error ).not.toHaveBeenCalled();
			} finally {
				// Cleanup.
				console.error = currentImplementation;
			}
		} );
	} );
} );
