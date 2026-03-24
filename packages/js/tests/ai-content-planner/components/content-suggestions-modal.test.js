import { render, screen, fireEvent } from "@testing-library/react";
import { ContentSuggestionsModal } from "../../../src/ai-content-planner/components/content-suggestions-modal";

const mockUsageCounter = jest.fn( () => null );
jest.mock( "@yoast/ai-frontend", () => ( {
	UsageCounter: ( props ) => mockUsageCounter( props ),
} ) );

const defaultSuggestions = [
	{ intent: "informational", title: "How to write great content", description: "A guide to writing content that ranks." },
	{ intent: "navigational", title: "Find the best tools", description: "Navigate to the best SEO tools." },
	{ intent: "commercial", title: "Best SEO plugins", description: "Compare the top SEO plugins." },
];

const renderModal = ( props ) => render(
	<ContentSuggestionsModal
		isOpen={ true }
		onClose={ jest.fn() }
		isLoading={ false }
		suggestions={ defaultSuggestions }
		isPremium={ false }
		{ ...props }
	/>
);

describe( "ContentSuggestionsModal", () => {
	beforeEach( () => {
		mockUsageCounter.mockClear();
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

	describe( "loading state", () => {
		it( "shows the loading message when isLoading is true", () => {
			renderModal( { isLoading: true } );
			expect( screen.getByText( "Analyzing your site content…" ) ).toBeInTheDocument();
		} );

		it( "does not show the intro text when isLoading is true", () => {
			renderModal( { isLoading: true } );
			expect( screen.queryByText( /Select a suggestion/ ) ).not.toBeInTheDocument();
		} );

		it( "does not show the loading message when isLoading is false", () => {
			renderModal( { isLoading: false } );
			expect( screen.queryByText( "Analyzing your site content…" ) ).not.toBeInTheDocument();
		} );
	} );

	describe( "suggestions list", () => {
		it( "shows the intro text when not loading", () => {
			renderModal();
			expect( screen.getByText( "Select a suggestion to generate a structured outline for your post." ) ).toBeInTheDocument();
		} );

		it( "renders all suggestions", () => {
			renderModal();
			expect( screen.getByText( "How to write great content" ) ).toBeInTheDocument();
			expect( screen.getByText( "Find the best tools" ) ).toBeInTheDocument();
			expect( screen.getByText( "Best SEO plugins" ) ).toBeInTheDocument();
		} );

		it( "renders suggestion descriptions", () => {
			renderModal();
			expect( screen.getByText( "A guide to writing content that ranks." ) ).toBeInTheDocument();
		} );

		it( "renders the correct intent badge label for informational", () => {
			renderModal( { suggestions: [ { intent: "informational", title: "Info post", description: "An informational post." } ] } );
			expect( screen.getByText( "Informational" ) ).toBeInTheDocument();
		} );

		it( "renders the correct intent badge label for navigational", () => {
			renderModal( { suggestions: [ { intent: "navigational", title: "Nav post", description: "A navigational post." } ] } );
			expect( screen.getByText( "Navigational" ) ).toBeInTheDocument();
		} );

		it( "renders the correct intent badge label for commercial", () => {
			renderModal( { suggestions: [ { intent: "commercial", title: "Commercial post", description: "A commercial post." } ] } );
			expect( screen.getByText( "Commercial" ) ).toBeInTheDocument();
		} );

		it( "renders an unknown intent as a badge with the raw value", () => {
			renderModal( { suggestions: [ { intent: "transactional", title: "Transactional post", description: "A transactional post." } ] } );
			expect( screen.getByText( "transactional" ) ).toBeInTheDocument();
		} );

		it( "renders an empty list when suggestions is empty", () => {
			renderModal( { suggestions: [] } );
			expect( screen.queryByRole( "button", { name: /How to write/i } ) ).not.toBeInTheDocument();
		} );
	} );
} );
