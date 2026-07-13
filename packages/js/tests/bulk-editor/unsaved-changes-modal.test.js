import { fireEvent, render, screen } from "../test-utils";
import { UnsavedChangesModal } from "../../src/bulk-editor/components/unsaved-changes-modal";

describe( "UnsavedChangesModal", () => {
	it( "wires each action to its handler", () => {
		const onSave = jest.fn();
		const onDiscard = jest.fn();
		const onClose = jest.fn();
		render( <UnsavedChangesModal isOpen={ true } onSave={ onSave } onDiscard={ onDiscard } onClose={ onClose } /> );

		fireEvent.click( screen.getByRole( "button", { name: "Save changes" } ) );
		fireEvent.click( screen.getByRole( "button", { name: "Continue without saving" } ) );
		fireEvent.click( screen.getByRole( "button", { name: "Cancel" } ) );

		expect( onSave ).toHaveBeenCalledTimes( 1 );
		expect( onDiscard ).toHaveBeenCalledTimes( 1 );
		expect( onClose ).toHaveBeenCalledTimes( 1 );
	} );

	it( "disables Save and Discard while a save is in flight, keeping Cancel available", () => {
		render( <UnsavedChangesModal isOpen={ true } isSaving={ true } /> );

		expect( screen.getByRole( "button", { name: "Save changes" } ) ).toBeDisabled();
		expect( screen.getByRole( "button", { name: "Continue without saving" } ) ).toBeDisabled();
		// Cancel stays enabled so a stalled save can't trap the user in the modal.
		expect( screen.getByRole( "button", { name: "Cancel" } ) ).toBeEnabled();
	} );
} );
