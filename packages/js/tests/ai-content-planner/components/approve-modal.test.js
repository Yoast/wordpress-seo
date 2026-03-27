import { render, screen, fireEvent } from "@testing-library/react";
import { FeatureModal } from "../../../src/ai-content-planner/components/feature-modal";

const renderModal = ( props ) => render(
	<FeatureModal
		isOpen={ true }
		onClose={ jest.fn() }
		isEmptyCanvas={ true }
		isPremium={ false }
		isUpsell={ false }
		{ ...props }
	/>
);

describe( "ApproveModal", () => {
	describe( "close button", () => {
		it( "calls onClose when the close button is clicked", () => {
			const onClose = jest.fn();
			renderModal( { onClose } );
			fireEvent.click( screen.getByRole( "button", { name: "Close modal" } ) );
			expect( onClose ).toHaveBeenCalledTimes( 1 );
		} );

		it( "transitions to the content suggestions view when the 'Get content suggestions' button is clicked", () => {
			renderModal();
			fireEvent.click( screen.getByRole( "button", { name: "Get content suggestions" } ) );
			expect( screen.getByText( "Content suggestions" ) ).toBeInTheDocument();
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
