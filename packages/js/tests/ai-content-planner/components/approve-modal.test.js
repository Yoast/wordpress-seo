import { render, screen, fireEvent } from "@testing-library/react";
import { ApproveModal } from "../../../src/ai-content-planner/components/approve-modal";

const renderApproveModal = ( { onClose = jest.fn(), ...props } = {} ) => render(
	<ApproveModal
		isEmptyPost={ true }
		isPremium={ false }
		isUpsell={ false }
		onClick={ jest.fn() }
		isOpen={ true }
		onClose={ onClose }
		{ ...props }
	/>
);

describe( "ApproveModal", () => {
	describe( "close button", () => {
		it( "calls onClose when the close button is clicked", () => {
			const onClose = jest.fn();
			renderApproveModal( { onClose } );
			fireEvent.click( screen.getByRole( "button", { name: "Close modal" } ) );
			expect( onClose ).toHaveBeenCalledTimes( 1 );
		} );
	} );

	describe( "empty canvas content", () => {
		it( "shows the inspiration title when the canvas is empty", () => {
			renderApproveModal( { isEmptyPost: true } );
			expect( screen.getByText( "Looking for inspiration?" ) ).toBeInTheDocument();
		} );

		it( "shows the ai-primary button variant when the canvas is empty and not an upsell", () => {
			renderApproveModal( { isEmptyPost: true, isUpsell: false } );
			expect( screen.getByRole( "button", { name: "Get content suggestions" } ) ).toHaveClass( "yst-button--ai-primary" );
		} );
	} );

	describe( "non-empty canvas content", () => {
		it( "shows the 'Get content suggestions' title when the canvas has content", () => {
			renderApproveModal( { isEmptyPost: false } );
			expect( screen.getByRole( "heading", { name: "Get content suggestions" } ) ).toBeInTheDocument();
		} );

		it( "shows a note that content will be replaced when the canvas has content", () => {
			renderApproveModal( { isEmptyPost: false } );
			expect( screen.getByText( /Note: Applying a content suggestion will replace/ ) ).toBeInTheDocument();
		} );
	} );

	describe( "upsell variant", () => {
		it( "shows the 'Unlock with Yoast SEO Premium' label when isUpsell is true", () => {
			renderApproveModal( { isUpsell: true } );
			expect( screen.getByText( "Unlock with Yoast SEO Premium" ) ).toBeInTheDocument();
		} );

		it( "renders the upsell button with the correct href when isUpsell is true", () => {
			renderApproveModal( { isUpsell: true, upsellLink: "https://yoa.st/content-planner-approve-modal" } );
			expect( screen.getByRole( "link", { name: /Unlock with Yoast SEO Premium/ } ) ).toHaveAttribute( "href", "https://yoa.st/content-planner-approve-modal" );
		} );

		it( "opens the upsell link in a new tab", () => {
			renderApproveModal( { isUpsell: true, upsellLink: "https://yoa.st/content-planner-approve-modal" } );
			expect( screen.getByRole( "link", { name: /Unlock with Yoast SEO Premium/ } ) ).toHaveAttribute( "target", "_blank" );
		} );
	} );

	describe( "OneSparkNote visibility", () => {
		it( "shows the spark note when the user is not premium and it is not an upsell", () => {
			renderApproveModal( { isPremium: false, isUpsell: false } );
			expect( screen.queryByText( "Using 1 spark" ) ).toBeInTheDocument();
		} );

		it( "does not show the spark note when the user is premium", () => {
			renderApproveModal( { isPremium: true, isUpsell: false } );
			expect( screen.queryByText( "Using 1 spark" ) ).not.toBeInTheDocument();
		} );

		it( "does not show the spark note when it is an upsell", () => {
			renderApproveModal( { isPremium: false, isUpsell: true } );
			expect( screen.queryByText( "Using 1 spark" ) ).not.toBeInTheDocument();
		} );
	} );

	describe( "onClick", () => {
		it( "calls onClick when the 'Get content suggestions' button is clicked", () => {
			const onClick = jest.fn();
			renderApproveModal( { isUpsell: false, onClick } );
			fireEvent.click( screen.getByRole( "button", { name: "Get content suggestions" } ) );
			expect( onClick ).toHaveBeenCalledTimes( 1 );
		} );
	} );
	describe( "premium subscription with usage limit reached", () => {
		it( "shows 'Get content suggestions' button (not upsell) when isUpsell is false even with premium", () => {
			renderApproveModal( { isPremium: true, isUpsell: false } );
			expect( screen.getByRole( "button", { name: "Get content suggestions" } ) ).toBeInTheDocument();
			expect( screen.queryByText( "Unlock with Yoast SEO Premium" ) ).not.toBeInTheDocument();
		} );

		it( "shows upsell when isUpsell is true and user is not premium", () => {
			renderApproveModal( { isPremium: false, isUpsell: true } );
			expect( screen.getByText( "Unlock with Yoast SEO Premium" ) ).toBeInTheDocument();
			expect( screen.queryByRole( "button", { name: "Get content suggestions" } ) ).not.toBeInTheDocument();
		} );
	} );
} );
