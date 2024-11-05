import { render, screen } from "../../test-utils";
import { UnsavedChangesModal } from "../../../src/shared-admin/components";

describe( "UnsavedChangesModal", () => {
	beforeEach( () => {
		render( <UnsavedChangesModal
			isOpen={ true }
			onClose={ jest.fn() }
			title="Unsaved changes"
			description="There are unsaved changes in one or more steps of the first-time configuration. Leaving means that those changes will be lost. Are you sure you want to leave this page?"
			onDiscard={ jest.fn() }
			dismissLabel="No, continue editing"
			discardLabel="Yes, leave page"
		/> );
	} );

	it( "should have dismiss and leave page buttons", () => {
		const leaveButton = screen.queryByText( "Yes, leave page" );
		expect( leaveButton ).toBeInTheDocument();

		expect( screen.queryByText( "Close" ) ).toBeInTheDocument();

		const dismissButton = screen.queryByText( "No, continue editing" );
		expect( dismissButton ).toBeInTheDocument();
	} );

	it( "should have a title", () => {
		const title = screen.queryByText( "Unsaved changes" );
		expect( title ).toBeInTheDocument();
	} );

	it( "should have a description", () => {
		const title = screen.queryByText( "There are unsaved changes in one or more steps of the first-time configuration. Leaving means that those changes will be lost. Are you sure you want to leave this page?" );
		expect( title ).toBeInTheDocument();
	} );
} );
