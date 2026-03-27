import { render, screen, fireEvent, within, act } from "@testing-library/react";
import { FeatureModal } from "../../../src/ai-content-planner/components/feature-modal";

const mockUsageCounter = jest.fn( () => null );
jest.mock( "@yoast/ai-frontend", () => ( {
	UsageCounter: ( props ) => mockUsageCounter( props ),
} ) );

const renderModal = ( props ) => render(
	<FeatureModal
		isOpen={ true }
		onClose={ jest.fn() }
		isPremium={ false }
		isEmptyCanvas={ false }
		isUpsell={ false }
		{ ...props }
	/>
);

const renderLoadingModal = ( props ) => {
	const result = renderModal( props );
	fireEvent.click( screen.getByRole( "button", { name: "Get content suggestions" } ) );
	return result;
};

const renderSuccessModal = ( props ) => {
	const result = renderLoadingModal( props );
	act( () => {
		jest.advanceTimersByTime( 5000 );
	} );
	return result;
};

describe( "ContentSuggestionsModal", () => {
	beforeEach( () => {
		mockUsageCounter.mockClear();
		jest.useFakeTimers();
	} );

	afterEach( () => {
		jest.useRealTimers();
	} );

	describe( "header", () => {
		it( "shows the 'Content suggestions' title", () => {
			renderLoadingModal();
			expect( screen.getByText( "Content suggestions" ) ).toBeInTheDocument();
		} );

		it( "shows the 'Beta' badge", () => {
			renderLoadingModal();
			expect( screen.getByText( "Beta" ) ).toBeInTheDocument();
		} );
	} );

	describe( "accessibility", () => {
		it( "has a descriptive close button label", () => {
			renderLoadingModal();
			expect( screen.getByRole( "button", { name: "Close content suggestions modal" } ) ).toBeInTheDocument();
		} );

		it( "has an accessible dialog name from the title", () => {
			renderLoadingModal();
			expect( screen.getByRole( "dialog", { name: "Content suggestions" } ) ).toBeInTheDocument();
		} );

		it( "calls onClose when the close button is clicked", () => {
			const onClose = jest.fn();
			renderLoadingModal( { onClose } );
			fireEvent.click( screen.getByRole( "button", { name: "Close content suggestions modal" } ) );
			expect( onClose ).toHaveBeenCalledTimes( 1 );
		} );

		it( "announces content via the aria-live region when status is success", () => {
			renderSuccessModal();
			const liveRegion = document.querySelector( "[aria-live='polite']" );
			expect( within( liveRegion ).getByText( "Select a suggestion to generate a structured outline for your post." ) ).toBeInTheDocument();
		} );
	} );

	describe( "loading state", () => {
		it( "shows the loading message when loading", () => {
			renderLoadingModal();
			expect( screen.getByText( "Analyzing your site content…" ) ).toBeInTheDocument();
		} );

		it( "does not show the intro text while loading", () => {
			renderLoadingModal();
			expect( screen.queryByText( /Select a suggestion/ ) ).not.toBeInTheDocument();
		} );
	} );

	describe( "suggestions list", () => {
		it( "shows the intro text when success", () => {
			renderSuccessModal();
			expect( screen.getByText( "Select a suggestion to generate a structured outline for your post." ) ).toBeInTheDocument();
		} );

		it( "does not show the loading message when success", () => {
			renderSuccessModal();
			expect( screen.queryByText( "Analyzing your site content…" ) ).not.toBeInTheDocument();
		} );

		it( "renders all suggestions", () => {
			renderSuccessModal();
			expect( screen.getByText( "How to train your dog" ) ).toBeInTheDocument();
			expect( screen.getByText( "Best dog training schools in New York" ) ).toBeInTheDocument();
			expect( screen.getByText( "Top 10 dog training tools" ) ).toBeInTheDocument();
			expect( screen.getByText( "How to groom your dog" ) ).toBeInTheDocument();
			expect( screen.getByText( "Dog parks in Los Angeles" ) ).toBeInTheDocument();
			expect( screen.getByText( "Best dog food brands" ) ).toBeInTheDocument();
		} );

		it( "renders suggestion descriptions", () => {
			renderSuccessModal();
			expect( screen.getByText( "Tips and tricks on how to train your dog effectively." ) ).toBeInTheDocument();
		} );

		it( "renders informational intent badges", () => {
			renderSuccessModal();
			expect( screen.getAllByText( "Informational" ).length ).toBeGreaterThan( 0 );
		} );

		it( "renders navigational intent badges", () => {
			renderSuccessModal();
			expect( screen.getAllByText( "Navigational" ).length ).toBeGreaterThan( 0 );
		} );

		it( "renders commercial intent badges", () => {
			renderSuccessModal();
			expect( screen.getAllByText( "Commercial" ).length ).toBeGreaterThan( 0 );
		} );
	} );

	describe( "UsageCounter", () => {
		it( "passes mentionBetaInTooltip and mentionResetInTooltip as false when not premium", () => {
			renderLoadingModal( { isPremium: false } );
			expect( mockUsageCounter ).toHaveBeenCalledWith( expect.objectContaining( {
				mentionBetaInTooltip: false,
				mentionResetInTooltip: false,
			} ) );
		} );

		it( "passes mentionBetaInTooltip and mentionResetInTooltip as true when premium", () => {
			renderLoadingModal( { isPremium: true } );
			expect( mockUsageCounter ).toHaveBeenCalledWith( expect.objectContaining( {
				mentionBetaInTooltip: true,
				mentionResetInTooltip: true,
			} ) );
		} );
	} );
} );
