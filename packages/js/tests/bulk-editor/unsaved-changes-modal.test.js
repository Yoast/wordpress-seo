import { render, screen, fireEvent } from "../test-utils";
import { UnsavedChangesModal } from "../../src/bulk-editor/components/unsaved-changes-modal";

describe( "UnsavedChangesModal", () => {
	const baseProps = { isOpen: true, onSave: jest.fn(), onDiscard: jest.fn(), onClose: jest.fn() };

	beforeEach( () => {
		jest.clearAllMocks();
	} );

	it( "disables every action while a save is in flight", () => {
		render( <UnsavedChangesModal { ...baseProps } isSaving={ true } /> );

		expect( screen.getByRole( "button", { name: "Save changes" } ) ).toBeDisabled();
		expect( screen.getByRole( "button", { name: "Continue without saving" } ) ).toBeDisabled();
		expect( screen.getByRole( "button", { name: "Cancel" } ) ).toBeDisabled();
	} );

	it( "enables the actions when no save is in flight", () => {
		render( <UnsavedChangesModal { ...baseProps } isSaving={ false } /> );

		expect( screen.getByRole( "button", { name: "Save changes" } ) ).toBeEnabled();
		expect( screen.getByRole( "button", { name: "Continue without saving" } ) ).toBeEnabled();
		expect( screen.getByRole( "button", { name: "Cancel" } ) ).toBeEnabled();
	} );

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
} );
