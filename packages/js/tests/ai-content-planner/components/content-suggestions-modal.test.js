import { render, screen, fireEvent, within } from "@testing-library/react";
import { Modal } from "@yoast/ui-library";
import { ContentSuggestionsModal } from "../../../src/ai-content-planner/components/content-suggestions-modal";

const mockUsageCounter = jest.fn( () => null );
jest.mock( "@yoast/ai-frontend", () => ( {
	UsageCounter: ( props ) => mockUsageCounter( props ),
} ) );

jest.mock( "../../../src/ai-generator/components/sparks-limit-notification", () => ( {
	SparksLimitNotification: () => null,
} ) );

const mockFetchContentSuggestions = jest.fn();
jest.mock( "../../../src/ai-content-planner/hooks", () => ( {
	useFetchContentSuggestions: () => mockFetchContentSuggestions,
} ) );

jest.mock( "../../../src/ai-content-planner/components/content-planner-error", () => ( {
	ContentPlannerError: ( { errorCode, errorIdentifier, errorMessage, onRetry } ) => (
		<div data-testid="content-planner-error">
			<span data-testid="error-code">{ errorCode }</span>
			<span data-testid="error-identifier">{ errorIdentifier }</span>
			<span data-testid="error-message">{ errorMessage }</span>
			<button type="button" onClick={ onRetry }>Mock retry</button>
		</div>
	),
} ) );

const mockSuggestions = [
	{
		intent: "informational",
		title: "How to train your dog",
		explanation: "Tips and tricks on how to train your dog effectively.",
	},
	{
		intent: "navigational",
		title: "Best dog training schools in New York",
		explanation: "A list of the best dog training schools in New York.",
	},
	{
		intent: "commercial",
		title: "Top 10 dog training tools",
		explanation: "A review of the top 10 dog training tools on the market.",
	},
	{
		intent: "informational",
		title: "How to groom your dog",
		explanation: "Step-by-step guide on how to groom your dog at home.",
	},
	{
		intent: "navigational",
		title: "Dog parks in Los Angeles",
		explanation: "Find the best dog parks in Los Angeles for your furry friend.",
	},
	{
		intent: "commercial",
		title: "Best dog food brands",
		explanation: "An overview of the best dog food brands for a healthy diet.",
	},
];

const renderLoadingModal = ( { onClose = jest.fn(), suggestions = mockSuggestions, ...props } = {} ) => render(
	<Modal isOpen={ true } onClose={ onClose }>
		<div>
			<ContentSuggestionsModal status="loading" isPremium={ false } suggestions={ suggestions } skipTransitions={ true } { ...props } />
		</div>
	</Modal>
);

const renderSuccessModal = ( { onClose = jest.fn(), suggestions = mockSuggestions, ...props } = {} ) => render(
	<Modal isOpen={ true } onClose={ onClose }>
		<div>
			<ContentSuggestionsModal status="success" isPremium={ false } suggestions={ suggestions } skipTransitions={ true } { ...props } />
		</div>
	</Modal>
);

const renderErrorModal = ( { onClose = jest.fn(), error = { errorCode: 500 }, ...props } = {} ) => render(
	<Modal isOpen={ true } onClose={ onClose }>
		<div>
			<ContentSuggestionsModal
				status="error"
				isPremium={ false }
				suggestions={ [] }
				skipTransitions={ true }
				error={ error }
				{ ...props }
			/>
		</div>
	</Modal>
);

describe( "ContentSuggestionsModal", () => {
	beforeEach( () => {
		mockUsageCounter.mockClear();
		mockFetchContentSuggestions.mockClear();
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

		it( "announces the loading message via the aria-live region", () => {
			renderLoadingModal();
			const liveRegion = document.querySelector( "[aria-live='polite']" );
			expect( liveRegion ).not.toBeNull();
			expect( within( liveRegion ).getByText( "Analyzing your site content…" ) ).toBeInTheDocument();
		} );

		it( "announces content via the aria-live region when status is success", () => {
			renderSuccessModal();
			const liveRegion = document.querySelector( "[aria-live='polite']" );
			expect( liveRegion ).not.toBeNull();
			expect( within( liveRegion ).getByText( "Select a suggestion to generate a structured outline for your post." ) ).toBeInTheDocument();
		} );
	} );

	describe( "loading state", () => {
		it( "shows the loading message immediately", () => {
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

		it( "renders all suggestions from the store", () => {
			renderSuccessModal();
			expect( screen.getByText( "How to train your dog" ) ).toBeInTheDocument();
			expect( screen.getByText( "Best dog training schools in New York" ) ).toBeInTheDocument();
			expect( screen.getByText( "Top 10 dog training tools" ) ).toBeInTheDocument();
			expect( screen.getByText( "How to groom your dog" ) ).toBeInTheDocument();
			expect( screen.getByText( "Dog parks in Los Angeles" ) ).toBeInTheDocument();
			expect( screen.getByText( "Best dog food brands" ) ).toBeInTheDocument();
		} );

		it( "renders suggestion explanations", () => {
			renderSuccessModal();
			expect( screen.getByText( "Tips and tricks on how to train your dog effectively." ) ).toBeInTheDocument();
		} );

		it( "renders informational intent badges", () => {
			renderSuccessModal();
			expect( screen.getAllByText( "Informational" ) ).toHaveLength( 2 );
		} );

		it( "renders navigational intent badges", () => {
			renderSuccessModal();
			expect( screen.getAllByText( "Navigational" ) ).toHaveLength( 2 );
		} );

		it( "renders commercial intent badges", () => {
			renderSuccessModal();
			expect( screen.getAllByText( "Commercial" ) ).toHaveLength( 2 );
		} );

		it( "renders no suggestion buttons when suggestions is empty", () => {
			renderSuccessModal( { suggestions: [] } );
			expect( screen.queryByText( "How to train your dog" ) ).not.toBeInTheDocument();
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

		it( "is not rendered when status is error", () => {
			renderErrorModal();
			expect( mockUsageCounter ).not.toHaveBeenCalled();
		} );
	} );

	describe( "error state", () => {
		it( "renders the ContentPlannerError with the error code, identifier, and message", () => {
			renderErrorModal( {
				error: { errorCode: 429, errorIdentifier: "", errorMessage: "Rate limited" },
			} );
			expect( screen.getByTestId( "content-planner-error" ) ).toBeInTheDocument();
			expect( screen.getByTestId( "error-code" ) ).toHaveTextContent( "429" );
			expect( screen.getByTestId( "error-message" ) ).toHaveTextContent( "Rate limited" );
		} );

		it( "does not render the loading message while in error", () => {
			renderErrorModal();
			expect( screen.queryByText( "Analyzing your site content…" ) ).not.toBeInTheDocument();
		} );

		it( "does not render the success intro while in error", () => {
			renderErrorModal();
			expect( screen.queryByText( /Select a suggestion/ ) ).not.toBeInTheDocument();
		} );

		it( "calls onRetry when the retry button is clicked", () => {
			renderErrorModal();
			fireEvent.click( screen.getByRole( "button", { name: "Mock retry" } ) );
			expect( mockFetchContentSuggestions ).toHaveBeenCalledTimes( 1 );
		} );
	} );
} );
