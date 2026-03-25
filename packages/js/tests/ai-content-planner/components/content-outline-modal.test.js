import { render, screen, fireEvent } from "@testing-library/react";
import { ContentOutlineModal } from "../../../src/ai-content-planner/components/content-outline-modal";

const mockUsageCounter = jest.fn( () => null );
jest.mock( "@yoast/ai-frontend", () => ( {
	UsageCounter: ( props ) => mockUsageCounter( props ),
} ) );

jest.mock( "@wordpress/data", () => ( {
	useSelect: jest.fn( () => false ),
} ) );

const defaultSuggestion = {
	intent: "informational",
	title: "The Ultimate Guide to Setting Up Your WordPress Blog",
	description: "This content is suggested because it addresses a common entry point for new users.",
	focusKeyphrase: "Guide to set up WordPress blog",
	metaDescription: "A comprehensive tutorial covering WordPress installation, theme selection, and essential plugins.",
	structure: [
		{ level: "H2", title: "Introduction" },
		{ level: "H2", title: "Why This Matters" },
		{ level: "H2", title: "Step-by-Step Guide" },
		{ level: "H2", title: "Conclusion" },
	],
};

const renderModal = ( props ) => render(
	<ContentOutlineModal
		isOpen={ true }
		onClose={ jest.fn() }
		isLoading={ false }
		onBack={ jest.fn() }
		onAddOutline={ jest.fn() }
		suggestion={ defaultSuggestion }
		{ ...props }
	/>
);

describe( "ContentOutlineModal", () => {
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
		it( "shows the 'Content outline' title", () => {
			renderModal();
			expect( screen.getByText( "Content outline" ) ).toBeInTheDocument();
		} );

		it( "shows the 'Beta' badge", () => {
			renderModal();
			expect( screen.getByText( "Beta" ) ).toBeInTheDocument();
		} );

		it( "shows the UsageCounter when sparksLimit is provided", () => {
			renderModal( { sparksLimit: 10, sparksUsage: 3 } );
			expect( mockUsageCounter ).toHaveBeenCalledWith(
				expect.objectContaining( { limit: 10, requests: 3 } )
			);
		} );

		it( "does not show the UsageCounter when sparksLimit is not provided", () => {
			mockUsageCounter.mockClear();
			renderModal();
			expect( mockUsageCounter ).not.toHaveBeenCalled();
		} );
	} );

	describe( "accessibility", () => {
		it( "has a descriptive close button label", () => {
			renderModal();
			expect( screen.getByRole( "button", { name: "Close content outline" } ) ).toBeInTheDocument();
		} );

		it( "has an accessible dialog name from the title", () => {
			renderModal();
			expect( screen.getByRole( "dialog", { name: "Content outline" } ) ).toBeInTheDocument();
		} );

		it( "has an accessible description for the modal", () => {
			renderModal();
			expect( screen.getByText( "Review and customize your content outline before adding it to your post" ) ).toBeInTheDocument();
		} );

		it( "does not show the structure section when loading", () => {
			renderModal( { isLoading: true } );
			expect( screen.queryByRole( "listbox" ) ).not.toBeInTheDocument();
		} );

		it( "renders the intent callout with role='note'", () => {
			renderModal();
			expect( screen.getByRole( "note" ) ).toBeInTheDocument();
		} );

		it( "renders the structure list as a listbox", () => {
			renderModal();
			expect( screen.getByRole( "listbox", { name: "Blog post structure" } ) ).toBeInTheDocument();
		} );

		it( "renders structure rows as options with accessible labels", () => {
			renderModal();
			expect( screen.getByRole( "option", { name: "H2 Introduction" } ) ).toBeInTheDocument();
			expect( screen.getByRole( "option", { name: "H2 Conclusion" } ) ).toBeInTheDocument();
		} );
	} );

	describe( "intent callout", () => {
		it( "shows the intent badge label", () => {
			renderModal();
			expect( screen.getByText( "Informational" ) ).toBeInTheDocument();
		} );

		it( "shows the 'Why this content?' text", () => {
			renderModal();
			expect( screen.getByText( "Why this content?" ) ).toBeInTheDocument();
		} );

		it( "shows the suggestion description", () => {
			renderModal();
			expect( screen.getByText( defaultSuggestion.description ) ).toBeInTheDocument();
		} );

		it( "renders the correct badge for navigational intent", () => {
			renderModal( { suggestion: { ...defaultSuggestion, intent: "navigational" } } );
			expect( screen.getByText( "Navigational" ) ).toBeInTheDocument();
		} );

		it( "renders the correct badge for commercial intent", () => {
			renderModal( { suggestion: { ...defaultSuggestion, intent: "commercial" } } );
			expect( screen.getByText( "Commercial" ) ).toBeInTheDocument();
		} );

		it( "renders an unknown intent as a badge with the raw value", () => {
			renderModal( { suggestion: { ...defaultSuggestion, intent: "transactional" } } );
			expect( screen.getByText( "transactional" ) ).toBeInTheDocument();
		} );
	} );

	describe( "content state", () => {
		it( "shows the form field labels", () => {
			renderModal();
			expect( screen.getByText( "Focus Keyphrase" ) ).toBeInTheDocument();
			expect( screen.getByText( "Title" ) ).toBeInTheDocument();
			expect( screen.getByText( "Meta description" ) ).toBeInTheDocument();
		} );

		it( "shows the form field values", () => {
			renderModal();
			expect( screen.getByText( defaultSuggestion.focusKeyphrase ) ).toBeInTheDocument();
			expect( screen.getByText( defaultSuggestion.title ) ).toBeInTheDocument();
			expect( screen.getByText( defaultSuggestion.metaDescription ) ).toBeInTheDocument();
		} );

		it( "shows the blog post structure section", () => {
			renderModal();
			expect( screen.getByText( "Blog post structure" ) ).toBeInTheDocument();
			expect( screen.getByText( "Drag to reorder" ) ).toBeInTheDocument();
		} );

		it( "renders all structure rows", () => {
			renderModal();
			expect( screen.getByText( "Introduction" ) ).toBeInTheDocument();
			expect( screen.getByText( "Why This Matters" ) ).toBeInTheDocument();
			expect( screen.getByText( "Step-by-Step Guide" ) ).toBeInTheDocument();
			expect( screen.getByText( "Conclusion" ) ).toBeInTheDocument();
		} );
	} );

	describe( "loading state", () => {
		it( "shows the form field labels when loading", () => {
			renderModal( { isLoading: true } );
			expect( screen.getByText( "Focus Keyphrase" ) ).toBeInTheDocument();
			expect( screen.getByText( "Title" ) ).toBeInTheDocument();
			expect( screen.getByText( "Meta description" ) ).toBeInTheDocument();
		} );

		it( "does not show the form field values when loading", () => {
			renderModal( { isLoading: true } );
			expect( screen.queryByText( defaultSuggestion.focusKeyphrase ) ).not.toBeInTheDocument();
			expect( screen.queryByText( defaultSuggestion.metaDescription ) ).not.toBeInTheDocument();
		} );

		it( "does not show the blog post structure section when loading", () => {
			renderModal( { isLoading: true } );
			expect( screen.queryByText( "Blog post structure" ) ).not.toBeInTheDocument();
			expect( screen.queryByText( "Drag to reorder" ) ).not.toBeInTheDocument();
		} );

		it( "still shows the intent callout when loading", () => {
			renderModal( { isLoading: true } );
			expect( screen.getByText( "Why this content?" ) ).toBeInTheDocument();
			expect( screen.getByText( defaultSuggestion.description ) ).toBeInTheDocument();
		} );

		it( "still shows the instruction text when loading", () => {
			renderModal( { isLoading: true } );
			expect( screen.getByText( "Review and customize your content outline before adding it to your post" ) ).toBeInTheDocument();
		} );

		it( "shows the footer buttons when loading", () => {
			renderModal( { isLoading: true } );
			expect( screen.getByRole( "button", { name: /Content suggestions/i } ) ).toBeInTheDocument();
			expect( screen.getByRole( "button", { name: /Add outline to post/i } ) ).toBeInTheDocument();
		} );
	} );

	describe( "category section", () => {
		it( "shows the suggest category section when category is provided", () => {
			renderModal( { category: "WordPress" } );
			expect( screen.getByRole( "switch", { name: "Suggest category" } ) ).toBeInTheDocument();
			expect( screen.getByText( "Adds post to an existing category, when applicable." ) ).toBeInTheDocument();
			expect( screen.getByText( "WordPress" ) ).toBeInTheDocument();
		} );

		it( "does not show the suggest category section when category is not provided", () => {
			renderModal();
			expect( screen.queryByText( "Suggest category" ) ).not.toBeInTheDocument();
		} );

		it( "hides the category badge when the toggle is turned off", () => {
			renderModal( { category: "WordPress" } );
			expect( screen.getByText( "WordPress" ) ).toBeInTheDocument();
			fireEvent.click( screen.getByRole( "switch", { name: "Suggest category" } ) );
			expect( screen.queryByText( "WordPress" ) ).not.toBeInTheDocument();
		} );

		it( "does not show the category badge value when loading", () => {
			renderModal( { category: "WordPress", isLoading: true } );
			expect( screen.queryByText( "WordPress" ) ).not.toBeInTheDocument();
		} );
	} );

	describe( "footer actions", () => {
		it( "calls onBack when the back button is clicked", () => {
			const onBack = jest.fn();
			renderModal( { onBack } );
			fireEvent.click( screen.getByRole( "button", { name: /Content suggestions/i } ) );
			expect( onBack ).toHaveBeenCalledTimes( 1 );
		} );

		it( "calls onAddOutline when the add button is clicked", () => {
			const onAddOutline = jest.fn();
			renderModal( { onAddOutline } );
			fireEvent.click( screen.getByRole( "button", { name: /Add outline to post/i } ) );
			expect( onAddOutline ).toHaveBeenCalledTimes( 1 );
		} );
	} );

	describe( "keyboard reordering", () => {
		it( "moves a row up with Alt+ArrowUp", () => {
			renderModal();
			const options = screen.getAllByRole( "option" );
			// "Why This Matters" is at index 1
			fireEvent.keyDown( options[ 1 ], { key: "ArrowUp", altKey: true } );
			const updatedOptions = screen.getAllByRole( "option" );
			expect( updatedOptions[ 0 ] ).toHaveAttribute( "aria-label", "H2 Why This Matters" );
			expect( updatedOptions[ 1 ] ).toHaveAttribute( "aria-label", "H2 Introduction" );
		} );

		it( "moves a row down with Alt+ArrowDown", () => {
			renderModal();
			const options = screen.getAllByRole( "option" );
			// "Introduction" is at index 0
			fireEvent.keyDown( options[ 0 ], { key: "ArrowDown", altKey: true } );
			const updatedOptions = screen.getAllByRole( "option" );
			expect( updatedOptions[ 0 ] ).toHaveAttribute( "aria-label", "H2 Why This Matters" );
			expect( updatedOptions[ 1 ] ).toHaveAttribute( "aria-label", "H2 Introduction" );
		} );

		it( "does not move the first row up", () => {
			renderModal();
			const options = screen.getAllByRole( "option" );
			fireEvent.keyDown( options[ 0 ], { key: "ArrowUp", altKey: true } );
			const updatedOptions = screen.getAllByRole( "option" );
			expect( updatedOptions[ 0 ] ).toHaveAttribute( "aria-label", "H2 Introduction" );
		} );

		it( "does not move the last row down", () => {
			renderModal();
			const options = screen.getAllByRole( "option" );
			fireEvent.keyDown( options[ 3 ], { key: "ArrowDown", altKey: true } );
			const updatedOptions = screen.getAllByRole( "option" );
			expect( updatedOptions[ 3 ] ).toHaveAttribute( "aria-label", "H2 Conclusion" );
		} );

		it( "does not move without the Alt key", () => {
			renderModal();
			const options = screen.getAllByRole( "option" );
			fireEvent.keyDown( options[ 1 ], { key: "ArrowUp", altKey: false } );
			const updatedOptions = screen.getAllByRole( "option" );
			expect( updatedOptions[ 1 ] ).toHaveAttribute( "aria-label", "H2 Why This Matters" );
		} );
	} );
} );
