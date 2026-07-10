import { render, screen } from "../test-utils";
import { UnsavedChangesModal } from "../../src/bulk-editor/components/unsaved-changes-modal";

describe( "UnsavedChangesModal", () => {
	const baseProps = { isOpen: true, onSave: jest.fn(), onDiscard: jest.fn(), onClose: jest.fn() };

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
	} );
} );
