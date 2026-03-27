import { render, screen, fireEvent } from "@testing-library/react";
import { ApproveModal } from "../../../src/ai-content-planner/components/approve-modal";

const renderModal = ( props ) => render(
	<ApproveModal
		isOpen={ true }
		onClose={ jest.fn() }
		isEmptyCanvas={ true }
		isPremium={ false }
		isUpsell={ false }
		{ ...props }
	/>
);

describe( "ApproveModal", () => {
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

		it( "renders the upsell button with the correct href when isUpsell is true", () => {
			renderModal( { isUpsell: true, upsellLink: "https://yoa.st/content-planner-approve-modal" } );
			expect( screen.getByRole( "link", { name: /Unlock with Yoast SEO Premium/ } ) ).toHaveAttribute( "href", "https://yoa.st/content-planner-approve-modal" );
		} );

		it( "opens the upsell link in a new tab", () => {
			renderModal( { isUpsell: true, upsellLink: "https://yoa.st/content-planner-approve-modal" } );
			expect( screen.getByRole( "link", { name: /Unlock with Yoast SEO Premium/ } ) ).toHaveAttribute( "target", "_blank" );
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
