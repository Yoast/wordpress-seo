import { render, screen, fireEvent } from "@testing-library/react";
import { NextPostApproveModal } from "../../../src/ai-next-post/components/next-post-approve-modal";

const renderModal = ( props ) => render(
	<NextPostApproveModal
		isOpen={ true }
		onClose={ jest.fn() }
		isEmptyCanvas={ true }
		isPremium={ false }
		isUpsell={ false }
		{ ...props }
	/>
);

describe( "NextPostApproveModal", () => {
	describe( "visibility", () => {
		it( "renders the modal when isOpen is true", () => {
			renderModal( { isOpen: true } );
			expect( screen.getByRole( "dialog" ) ).toBeInTheDocument();
		} );

		it( "does not render the modal when isOpen is false", () => {
			renderModal( { isOpen: false } );
			expect( screen.queryByRole( "dialog" ) ).not.toBeInTheDocument();
		} );

		it( "calls onClick when the button is clicked", () => {
			const onClick = jest.fn();
			renderModal( { onClick } );
			fireEvent.click( screen.getByRole( "button", { name: "Get content suggestions" } ) );
			expect( onClick ).toHaveBeenCalledTimes( 1 );
		} );
	} );

	describe( "empty canvas content", () => {
		it( "shows the inspiration title when the canvas is empty", () => {
			renderModal( { isEmptyCanvas: true } );
			expect( screen.getByText( "Looking for inspiration?" ) ).toBeInTheDocument();
		} );

		it( "shows the ai-primary button variant when the canvas is empty and not an upsell", () => {
			renderModal( { isEmptyCanvas: true, isUpsell: false } );
			expect( screen.getByRole( "button", { name: "Get content suggestions" } ) ).toHaveClass( "yst-button--ai-primary" );
		} );
	} );

	describe( "non-empty canvas content", () => {
		it( "shows the 'Get content suggestions' title when the canvas has content", () => {
			renderModal( { isEmptyCanvas: false } );
			expect( screen.getByRole( "heading", { name: "Get content suggestions" } ) ).toBeInTheDocument();
		} );

		it( "shows a note that content will be replaced when the canvas has content", () => {
			renderModal( { isEmptyCanvas: false } );
			expect( screen.getByText( /Note: Applying a content suggestion will replace/ ) ).toBeInTheDocument();
		} );
	} );

	describe( "upsell variant", () => {
		it( "shows the 'Unlock with Yoast SEO Premium' label when isUpsell is true", () => {
			renderModal( { isUpsell: true } );
			expect( screen.getByText( "Unlock with Yoast SEO Premium" ) ).toBeInTheDocument();
		} );
	} );

	describe( "OneSparkNote visibility", () => {
		it( "shows the spark note when the user is not premium and it is not an upsell", () => {
			renderModal();
			expect( screen.queryByText( "Using 1 spark" ) ).toBeInTheDocument();
		} );

		it( "does not show the spark note when the user is premium", () => {
			renderModal( { isPremium: true, isUpsell: false } );
			expect( screen.queryByText( "Using 1 spark" ) ).not.toBeInTheDocument();
		} );

		it( "does not show the spark note when it is an upsell", () => {
			renderModal( { isPremium: false, isUpsell: true } );
			expect( screen.queryByText( "Using 1 spark" ) ).not.toBeInTheDocument();
		} );
	} );
} );
