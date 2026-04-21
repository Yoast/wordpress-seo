import { render, screen, fireEvent, act } from "@testing-library/react";
import { Modal } from "@yoast/ui-library";
import { ContentOutlineModal } from "../../../src/ai-content-planner/components/content-outline-modal";
import { ASYNC_ACTION_STATUS } from "../../../src/shared-admin/constants";

const mockUsageCounter = jest.fn( () => null );
jest.mock( "@yoast/ai-frontend", () => ( {
	UsageCounter: ( props ) => mockUsageCounter( props ),
} ) );

jest.mock( "@wordpress/data", () => ( {
	useSelect: jest.fn( () => false ),
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

jest.mock( "../../../src/ai-content-planner/hooks", () => ( {
	useDraggableStructure: () => ( {
		structure: [
			{ id: "1", title: "Introduction" },
			{ id: "2", title: "Why This Matters" },
			{ id: "3", title: "Step-by-Step Guide" },
			{ id: "4", title: "Conclusion" },
		],
		dragOverIndex: null,
		handleDragStart: jest.fn(),
		handleDragOver: jest.fn(),
		handleDrop: jest.fn(),
		handleDragEnd: jest.fn(),
		handleMoveUp: jest.fn(),
		handleMoveDown: jest.fn(),
	} ),
} ) );

const defaultSuggestion = {
	intent: "informational",
	title: "The Ultimate Guide to Setting Up Your WordPress Blog",
	explanation: "This content is suggested because it addresses a common entry point for new users.",
	keyphrase: "Guide to set up WordPress blog",
	// eslint-disable-next-line camelcase
	meta_description: "A comprehensive tutorial covering WordPress installation, theme selection, and essential plugins.",
};

const renderModal = ( { onClose = jest.fn(), status = ASYNC_ACTION_STATUS.loading, ...props } = {} ) => render(
	<Modal isOpen={ true } onClose={ onClose }>
		<div>
			<ContentOutlineModal
				onBackToSuggestions={ jest.fn() }
				onApplyOutline={ jest.fn() }
				suggestion={ defaultSuggestion }
				status={ status }
				isPremium={ false }
				sparksLimit={ undefined }
				sparksUsage={ undefined }
				isActive={ false }
				{ ...props }
			/>
		</div>
	</Modal>
);

/**
 * Renders the modal and advances timers so the loading simulation completes.
 *
 * @param {Object} props Optional props to override defaults.
 * @returns {Object} The render result.
 */
const renderLoadedModal = ( props ) => {
	const result = renderModal( { status: ASYNC_ACTION_STATUS.success, ...props } );
	act( () => {
		jest.advanceTimersByTime( 5000 );
	} );
	return result;
};

describe( "ContentOutlineModal", () => {
	beforeEach( () => {
		mockUsageCounter.mockClear();
		jest.useFakeTimers();
	} );

	afterEach( () => {
		jest.useRealTimers();
	} );

	describe( "close button", () => {
		it( "calls onClose when the close button is clicked", () => {
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
			renderModal();
			act( () => {
				jest.advanceTimersByTime( 100 );
			} );
			expect( screen.queryByRole( "listbox" ) ).not.toBeInTheDocument();
		} );

		it( "renders the intent callout with role='note'", () => {
			renderModal();
			expect( screen.getByRole( "note" ) ).toBeInTheDocument();
		} );

		it( "renders the structure list as a listbox after loading", () => {
			renderLoadedModal();
			expect( screen.getByRole( "listbox", { name: "Blog post structure" } ) ).toBeInTheDocument();
		} );

		it( "renders structure rows as options with accessible labels", () => {
			renderLoadedModal();
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
			expect( screen.getByText( defaultSuggestion.explanation ) ).toBeInTheDocument();
		} );

		it( "renders the correct badge for navigational intent", () => {
			renderModal( { suggestion: { ...defaultSuggestion, intent: "navigational" } } );
			expect( screen.getByText( "Navigational" ) ).toBeInTheDocument();
		} );

		it( "renders the correct badge for commercial intent", () => {
			renderModal( { suggestion: { ...defaultSuggestion, intent: "commercial" } } );
			expect( screen.getByText( "Commercial" ) ).toBeInTheDocument();
		} );

		it( "renders the correct badge for transactional intent", () => {
			renderModal( { suggestion: { ...defaultSuggestion, intent: "transactional" } } );
			expect( screen.getByText( "Transactional" ) ).toBeInTheDocument();
		} );

		it( "renders an unknown intent as a badge with the raw value", () => {
			renderModal( { suggestion: { ...defaultSuggestion, intent: "other" } } );
			expect( screen.getByText( "other" ) ).toBeInTheDocument();
		} );
	} );

	describe( "content state", () => {
		it( "shows the form field labels after loading", () => {
			renderLoadedModal();
			expect( screen.getByText( "Focus Keyphrase" ) ).toBeInTheDocument();
			expect( screen.getByText( "Title" ) ).toBeInTheDocument();
			expect( screen.getByText( "Meta description" ) ).toBeInTheDocument();
		} );

		it( "shows the form field values after loading", () => {
			renderLoadedModal();
			expect( screen.getByDisplayValue( defaultSuggestion.keyphrase ) ).toBeInTheDocument();
			expect( screen.getByDisplayValue( defaultSuggestion.title ) ).toBeInTheDocument();
			expect( screen.getByDisplayValue( defaultSuggestion.meta_description ) ).toBeInTheDocument();
		} );

		it( "shows the blog post structure section after loading", () => {
			renderLoadedModal();
			expect( screen.getByText( "Blog post structure" ) ).toBeInTheDocument();
			expect( screen.getByText( "Drag to reorder" ) ).toBeInTheDocument();
		} );

		it( "renders all structure rows after loading", () => {
			renderLoadedModal();
			expect( screen.getByText( "Introduction" ) ).toBeInTheDocument();
			expect( screen.getByText( "Why This Matters" ) ).toBeInTheDocument();
			expect( screen.getByText( "Step-by-Step Guide" ) ).toBeInTheDocument();
			expect( screen.getByText( "Conclusion" ) ).toBeInTheDocument();
		} );
	} );

	describe( "loading state", () => {
		it( "shows the form field labels when loading", () => {
			renderModal();
			act( () => {
				jest.advanceTimersByTime( 100 );
			} );
			expect( screen.getByText( "Focus Keyphrase" ) ).toBeInTheDocument();
			expect( screen.getByText( "Title" ) ).toBeInTheDocument();
			expect( screen.getByText( "Meta description" ) ).toBeInTheDocument();
		} );

		it( "does not show the form field values when loading", () => {
			renderModal();
			act( () => {
				jest.advanceTimersByTime( 100 );
			} );
			expect( screen.queryByDisplayValue( defaultSuggestion.keyphrase ) ).not.toBeInTheDocument();
			expect( screen.queryByDisplayValue( defaultSuggestion.meta_description ) ).not.toBeInTheDocument();
		} );

		it( "does not show the blog post structure section when loading", () => {
			renderModal();
			act( () => {
				jest.advanceTimersByTime( 100 );
			} );
			expect( screen.queryByText( "Blog post structure" ) ).not.toBeInTheDocument();
			expect( screen.queryByText( "Drag to reorder" ) ).not.toBeInTheDocument();
		} );

		it( "still shows the intent callout when loading", () => {
			renderModal();
			act( () => {
				jest.advanceTimersByTime( 100 );
			} );
			expect( screen.getByText( "Why this content?" ) ).toBeInTheDocument();
			expect( screen.getByText( defaultSuggestion.explanation ) ).toBeInTheDocument();
		} );

		it( "still shows the instruction text when loading", () => {
			renderModal();
			act( () => {
				jest.advanceTimersByTime( 100 );
			} );
			expect( screen.getByText( "Review and customize your content outline before adding it to your post" ) ).toBeInTheDocument();
		} );

		it( "shows the footer buttons when loading", () => {
			renderModal();
			act( () => {
				jest.advanceTimersByTime( 100 );
			} );
			expect( screen.getByRole( "button", { name: /Content suggestions/i } ) ).toBeInTheDocument();
			expect( screen.getByRole( "button", { name: /Add outline to post/i } ) ).toBeInTheDocument();
		} );
	} );

	describe( "category section", () => {
		it( "shows the suggest category section when category is provided", () => {
			renderModal( { status: ASYNC_ACTION_STATUS.success, suggestion: { ...defaultSuggestion, category: { name: "WordPress" } } } );
			expect( screen.getByRole( "switch", { name: "Suggest category" } ) ).toBeInTheDocument();
			expect( screen.getByText( "Adds post to an existing category, when applicable." ) ).toBeInTheDocument();
		} );

		it( "shows the suggest category section when loading", () => {
			renderModal();
			expect( screen.getByRole( "switch", { name: "Suggest category" } ) ).toBeInTheDocument();
			expect( screen.getByText( "Adds post to an existing category, when applicable." ) ).toBeInTheDocument();
		} );

		it( "does not show the suggest category section when category is not provided and not loading", () => {
			renderModal( { status: ASYNC_ACTION_STATUS.success } );
			expect( screen.queryByText( "Suggest category" ) ).not.toBeInTheDocument();
		} );

		it( "disables the toggle when loading", () => {
			renderModal( { suggestion: { ...defaultSuggestion, category: { name: "WordPress" } } } );
			act( () => {
				jest.advanceTimersByTime( 100 );
			} );
			expect( screen.getByRole( "switch", { name: "Suggest category" } ) ).toBeDisabled();
		} );

		it( "enables the toggle after loading completes", () => {
			renderLoadedModal( { suggestion: { ...defaultSuggestion, category: { name: "WordPress" } } } );
			expect( screen.getByRole( "switch", { name: "Suggest category" } ) ).toBeEnabled();
		} );

		it( "does not show the category badge value when loading", () => {
			renderModal( { suggestion: { ...defaultSuggestion, category: { name: "WordPress" } } } );
			act( () => {
				jest.advanceTimersByTime( 100 );
			} );
			expect( screen.queryByText( "WordPress" ) ).not.toBeInTheDocument();
		} );
	} );

	describe( "footer actions", () => {
		it( "calls onBackToSuggestions when the back button is clicked", () => {
			const onBackToSuggestions = jest.fn();
			renderModal( { onBackToSuggestions } );
			fireEvent.click( screen.getByRole( "button", { name: /Content suggestions/i } ) );
			expect( onBackToSuggestions ).toHaveBeenCalledTimes( 1 );
		} );

		it( "calls onApplyOutline when the add button is clicked", () => {
			const onApplyOutline = jest.fn();
			renderLoadedModal( { onApplyOutline } );
			fireEvent.click( screen.getByRole( "button", { name: /Add outline to post/i } ) );
			expect( onApplyOutline ).toHaveBeenCalled();
		} );
	} );

	describe( "keyboard reordering", () => {
		it( "renders all structure rows as keyboard-accessible options", () => {
			renderLoadedModal();
			const options = screen.getAllByRole( "option" );
			expect( options ).toHaveLength( 4 );
			expect( options[ 0 ] ).toHaveAttribute( "aria-label", "H2 Introduction" );
			expect( options[ 1 ] ).toHaveAttribute( "aria-label", "H2 Why This Matters" );
			expect( options[ 2 ] ).toHaveAttribute( "aria-label", "H2 Step-by-Step Guide" );
			expect( options[ 3 ] ).toHaveAttribute( "aria-label", "H2 Conclusion" );
		} );

		it( "allows keyboard navigation with Alt+ArrowUp", () => {
			renderLoadedModal();
			const options = screen.getAllByRole( "option" );
			expect( () => {
				fireEvent.keyDown( options[ 1 ], { key: "ArrowUp", altKey: true } );
			} ).not.toThrow();
		} );

		it( "allows keyboard navigation with Alt+ArrowDown", () => {
			renderLoadedModal();
			const options = screen.getAllByRole( "option" );
			expect( () => {
				fireEvent.keyDown( options[ 0 ], { key: "ArrowDown", altKey: true } );
			} ).not.toThrow();
		} );

		it( "does not throw when first row receives ArrowUp", () => {
			renderLoadedModal();
			const options = screen.getAllByRole( "option" );
			expect( () => {
				fireEvent.keyDown( options[ 0 ], { key: "ArrowUp", altKey: true } );
			} ).not.toThrow();
		} );

		it( "does not throw when last row receives ArrowDown", () => {
			renderLoadedModal();
			const options = screen.getAllByRole( "option" );
			expect( () => {
				fireEvent.keyDown( options[ 3 ], { key: "ArrowDown", altKey: true } );
			} ).not.toThrow();
		} );

		it( "ignores arrow keys without the Alt modifier", () => {
			renderLoadedModal();
			const options = screen.getAllByRole( "option" );
			expect( () => {
				fireEvent.keyDown( options[ 1 ], { key: "ArrowUp", altKey: false } );
			} ).not.toThrow();
		} );
	} );

	describe( "error state", () => {
		const renderErrorModal = ( props = {} ) => renderModal( {
			status: ASYNC_ACTION_STATUS.error,
			error: { errorCode: 500 },
			...props,
		} );

		it( "renders the ContentPlannerError with the error code, identifier, and message", () => {
			renderErrorModal( {
				error: { errorCode: 408, errorIdentifier: "", errorMessage: "timeout" },
			} );
			expect( screen.getByTestId( "content-planner-error" ) ).toBeInTheDocument();
			expect( screen.getByTestId( "error-code" ) ).toHaveTextContent( "408" );
			expect( screen.getByTestId( "error-message" ) ).toHaveTextContent( "timeout" );
		} );

		it( "does not render the outline form fields while in error", () => {
			renderErrorModal();
			expect( screen.queryByLabelText( "Focus Keyphrase" ) ).not.toBeInTheDocument();
			expect( screen.queryByLabelText( "Title" ) ).not.toBeInTheDocument();
			expect( screen.queryByLabelText( "Meta description" ) ).not.toBeInTheDocument();
		} );

		it( "does not render the Add outline to post footer button while in error", () => {
			renderErrorModal();
			expect( screen.queryByRole( "button", { name: "Add outline to post" } ) ).not.toBeInTheDocument();
		} );

		it( "does not render the UsageCounter while in error", () => {
			renderErrorModal( { sparksLimit: 10, sparksUsage: 2 } );
			expect( mockUsageCounter ).not.toHaveBeenCalled();
		} );

		it( "calls onRetry when the retry button is clicked", () => {
			const onRetry = jest.fn();
			renderErrorModal( { onRetry } );
			fireEvent.click( screen.getByRole( "button", { name: "Mock retry" } ) );
			expect( onRetry ).toHaveBeenCalledTimes( 1 );
		} );
	} );
} );
