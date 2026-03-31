import { render, screen, fireEvent } from "@testing-library/react";
import { Modal } from "@yoast/ui-library";
import { ReplaceContentModal } from "../../../src/ai-content-planner/components/replace-content-modal";

const renderModal = ( { onClose = jest.fn(), onConfirm = jest.fn(), ...props } = {} ) => render(
	<Modal isOpen={ true } onClose={ onClose }>
		<div>
			<ReplaceContentModal
				onClose={ onClose }
				onConfirm={ onConfirm }
				{ ...props }
			/>
		</div>
	</Modal>
);

describe( "ReplaceContentModal", () => {
	describe( "accessibility", () => {
		it( "has an accessible dialog name from the title", () => {
			renderModal();
			expect( screen.getByRole( "dialog", { name: "Replace existing content with this outline?" } ) ).toBeInTheDocument();
		} );

		it( "has a descriptive close button label", () => {
			renderModal();
			expect( screen.getByRole( "button", { name: "Close replace content confirmation" } ) ).toBeInTheDocument();
		} );

		it( "has an accessible description for the modal", () => {
			renderModal();
			expect( screen.getByText(
				/This will replace everything in your post with the generated outline and content notes/
			) ).toBeInTheDocument();
		} );

		it( "focuses the close button on mount for screen reader announcement", () => {
			renderModal();
			expect( screen.getByRole( "button", { name: "Close replace content confirmation" } ) ).toHaveFocus();
		} );
	} );

	describe( "content", () => {
		it( "shows the warning title", () => {
			renderModal();
			expect( screen.getByText( "Replace existing content with this outline?" ) ).toBeInTheDocument();
		} );

		it( "shows the warning description", () => {
			renderModal();
			expect( screen.getByText( /You can revert this action by clicking the 'undo' button/ ) ).toBeInTheDocument();
		} );
	} );

	describe( "actions", () => {
		it( "calls onClose when the cancel button is clicked", () => {
			const onClose = jest.fn();
			renderModal( { onClose } );
			fireEvent.click( screen.getByRole( "button", { name: "Cancel" } ) );
			expect( onClose ).toHaveBeenCalledTimes( 1 );
		} );

		it( "calls onConfirm when the replace content button is clicked", () => {
			const onConfirm = jest.fn();
			renderModal( { onConfirm } );
			fireEvent.click( screen.getByRole( "button", { name: "Replace content" } ) );
			expect( onConfirm ).toHaveBeenCalledTimes( 1 );
		} );

		it( "calls the parent modal onClose when the close button is clicked", () => {
			const onClose = jest.fn();
			renderModal( { onClose } );
			fireEvent.click( screen.getByRole( "button", { name: "Close replace content confirmation" } ) );
			expect( onClose ).toHaveBeenCalledTimes( 1 );
		} );
	} );
} );
