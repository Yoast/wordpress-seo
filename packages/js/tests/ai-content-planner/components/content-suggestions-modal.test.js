import { render, screen, fireEvent, within, act } from "@testing-library/react";
import { ContentSuggestionsModal } from "../../../src/ai-content-planner/components/content-suggestions-modal";

const mockUsageCounter = jest.fn( () => null );
jest.mock( "@yoast/ai-frontend", () => ( {
	UsageCounter: ( props ) => mockUsageCounter( props ),
} ) );

const renderModal = ( props ) => render(
	<ContentSuggestionsModal
		isOpen={ true }
		onClose={ jest.fn() }
		isPremium={ false }
		{ ...props }
	/>
);

const renderLoadedModal = ( props ) => {
	const result = renderModal( props );
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

	describe( "visibility", () => {
		it( "renders the modal when isOpen is true", () => {
			renderModal( { isOpen: true } );
			expect( screen.getByRole( "dialog" ) ).toBeInTheDocument();
		} );

		it( "does not render the modal when isOpen is false", () => {
			renderModal( { isOpen: false } );
			expect( screen.queryByRole( "dialog" ) ).not.toBeInTheDocument();
		} );

		it( "calls onClose when the modal close button is clicked", () => {
			const onClose = jest.fn();
			renderModal( { onClose } );
			fireEvent.click( screen.getByRole( "button", { name: /close/i } ) );
			expect( onClose ).toHaveBeenCalledTimes( 1 );
		} );
	} );

	describe( "header", () => {
		it( "shows the 'Content suggestions' title", () => {
			renderModal();
			expect( screen.getByText( "Content suggestions" ) ).toBeInTheDocument();
		} );

		it( "shows the 'Beta' badge", () => {
			renderModal();
			expect( screen.getByText( "Beta" ) ).toBeInTheDocument();
		} );
	} );

	describe( "accessibility", () => {
		it( "announces the loading-to-loaded transition via the aria-live region", () => {
			renderModal();
			const liveRegion = document.querySelector( "[aria-live='polite']" );
			act( () => {
				jest.advanceTimersByTime( 5000 );
			} );
			expect( within( liveRegion ).getByText( "Select a suggestion to generate a structured outline for your post." ) ).toBeInTheDocument();
		} );

		it( "has a descriptive close button label", () => {
			renderModal();
			expect( screen.getByRole( "button", { name: "Close content suggestions modal" } ) ).toBeInTheDocument();
		} );

		it( "has an accessible dialog name from the title", () => {
			renderModal();
			expect( screen.getByRole( "dialog", { name: "Content suggestions" } ) ).toBeInTheDocument();
		} );
	} );

	describe( "loading state", () => {
		it( "shows the loading message on open", () => {
			renderModal();
			// wait 100ms for the loading state to be set
			act( () => {
				jest.advanceTimersByTime( 100 );
			} );
			expect( screen.getByText( "Analyzing your site content…" ) ).toBeInTheDocument();
		} );

		it( "does not show the intro text while loading", () => {
			renderModal();
			expect( screen.queryByText( /Select a suggestion/ ) ).not.toBeInTheDocument();
		} );

		it( "does not show the loading message after loading completes", () => {
			renderModal();
			act( () => {
				jest.advanceTimersByTime( 5000 );
			} );
			expect( screen.queryByText( "Analyzing your site content…" ) ).not.toBeInTheDocument();
		} );
	} );

	describe( "suggestions list", () => {
		it( "shows the intro text when not loading", () => {
			renderLoadedModal();
			expect( screen.getByText( "Select a suggestion to generate a structured outline for your post." ) ).toBeInTheDocument();
		} );

		it( "renders all suggestions", () => {
			renderLoadedModal();
			expect( screen.getByText( "How to train your dog" ) ).toBeInTheDocument();
			expect( screen.getByText( "Best dog training schools in New York" ) ).toBeInTheDocument();
			expect( screen.getByText( "Top 10 dog training tools" ) ).toBeInTheDocument();
			expect( screen.getByText( "How to groom your dog" ) ).toBeInTheDocument();
			expect( screen.getByText( "Dog parks in Los Angeles" ) ).toBeInTheDocument();
			expect( screen.getByText( "Best dog food brands" ) ).toBeInTheDocument();
		} );

		it( "renders suggestion descriptions", () => {
			renderLoadedModal();
			expect( screen.getByText( "Tips and tricks on how to train your dog effectively." ) ).toBeInTheDocument();
		} );

		it( "renders informational intent badges", () => {
			renderLoadedModal();
			expect( screen.getAllByText( "Informational" ).length ).toBeGreaterThan( 0 );
		} );

		it( "renders navigational intent badges", () => {
			renderLoadedModal();
			expect( screen.getAllByText( "Navigational" ).length ).toBeGreaterThan( 0 );
		} );

		it( "renders commercial intent badges", () => {
			renderLoadedModal();
			expect( screen.getAllByText( "Commercial" ).length ).toBeGreaterThan( 0 );
		} );
	} );
} );
