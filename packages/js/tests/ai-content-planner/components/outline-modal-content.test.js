import { render, screen, fireEvent, act } from "@testing-library/react";
import { Modal } from "@yoast/ui-library";
import { OutlineModalContent } from "../../../src/ai-content-planner/components/outline-modal-content";
import { ASYNC_ACTION_STATUS } from "../../../src/shared-admin/constants";
import { getDescriptionProgress, getProgressColor } from "@yoast/search-metadata-previews";
import { useFetchContentOutline } from "../../../src/ai-content-planner/hooks";

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

jest.mock( "@yoast/search-metadata-previews", () => ( {
	getDescriptionProgress: jest.fn( () => ( { actual: 100, score: 9, max: 156 } ) ),
	getProgressColor: jest.fn( () => "#2a9d8f" ),
} ) );

jest.mock( "../../../src/ai-content-planner/hooks", () => ( {
	useFetchContentOutline: jest.fn(),
	useDraggableStructure: () => ( {
		structure: [
			{ id: "1", heading: "Introduction" },
			{ id: "2", heading: "Why This Matters" },
			{ id: "3", heading: "Step-by-Step Guide" },
			{ id: "4", heading: "Conclusion" },
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

const mockFetchContentOutlineFn = jest.fn();

const defaultSuggestion = {
	intent: "informational",
	title: "The Ultimate Guide to Setting Up Your WordPress Blog",
	explanation: "This content is suggested because it addresses a common entry point for new users.",
	keyphrase: "Guide to set up WordPress blog",
	// eslint-disable-next-line camelcase
	meta_description: "A comprehensive tutorial covering WordPress installation, theme selection, and essential plugins.",
	index: 2,
};

const renderModal = ( { onClose = jest.fn(), status = ASYNC_ACTION_STATUS.loading, ...props } = {} ) => render(
	<Modal isOpen={ true } onClose={ onClose }>
		<div>
			<OutlineModalContent
				onBackToSuggestions={ jest.fn() }
				onApplyOutline={ jest.fn() }
				suggestion={ defaultSuggestion }
				status={ status }
				isPremium={ false }
				isActive={ false }
				date=""
				locale="en_US"
				isCornerstone={ false }
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
		getDescriptionProgress.mockClear();
		getProgressColor.mockClear();
		jest.useFakeTimers();
		useFetchContentOutline.mockReturnValue( mockFetchContentOutlineFn );
	} );

	afterEach( () => {
		jest.useRealTimers();
	} );

	describe( "accessibility", () => {
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

		it( "does not show the suggest category section for the empty-category sentinel when not loading", () => {
			renderModal( {
				status: ASYNC_ACTION_STATUS.success,
				suggestion: { ...defaultSuggestion, category: { name: "", id: -1 } },
			} );
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

		it( "hides the category badge when the toggle is switched off", () => {
			renderLoadedModal( { suggestion: { ...defaultSuggestion, category: { name: "WordPress" } } } );
			expect( screen.getByText( "WordPress" ) ).toBeInTheDocument();
			fireEvent.click( screen.getByRole( "switch", { name: "Suggest category" } ) );
			expect( screen.queryByText( "WordPress" ) ).not.toBeInTheDocument();
		} );
	} );

	describe( "footer actions", () => {
		it( "passes the fallback category when isCategoryEnabled is toggled off before applying", () => {
			const onApplyOutline = jest.fn();
			const suggestionWithCategory = { ...defaultSuggestion, category: { name: "WordPress", id: 5 } };
			renderLoadedModal( { onApplyOutline, suggestion: suggestionWithCategory } );
			fireEvent.click( screen.getByRole( "switch", { name: "Suggest category" } ) );
			fireEvent.click( screen.getByRole( "button", { name: /Add outline to post/i } ) );
			expect( onApplyOutline ).toHaveBeenCalledWith(
				expect.objectContaining( { category: { name: "", id: -1 } } )
			);
		} );

		it( "calls onBackToSuggestions when the back button is clicked", () => {
			const onBackToSuggestions = jest.fn();
			renderModal( { onBackToSuggestions, status: ASYNC_ACTION_STATUS.success } );
			fireEvent.click( screen.getByRole( "button", { name: /Content suggestions/i } ) );
			expect( onBackToSuggestions ).toHaveBeenCalledTimes( 1 );
		} );

		it( "doesnt call onBackToSuggestions when the back button is clicked while loading", () => {
			const onBackToSuggestions = jest.fn();
			renderModal( { onBackToSuggestions } );
			fireEvent.click( screen.getByRole( "button", { name: /Content suggestions/i } ) );
			expect( onBackToSuggestions ).not.toHaveBeenCalled();
		} );

		it( "calls onApplyOutline when the add button is clicked", () => {
			const onApplyOutline = jest.fn();
			renderLoadedModal( { onApplyOutline } );
			fireEvent.click( screen.getByRole( "button", { name: /Add outline to post/i } ) );
			expect( onApplyOutline ).toHaveBeenCalled();
		} );

		it( "calls focus on closeButtonRef.current when isLoading changes", () => {
			const focusMock = jest.fn();
			const closeButtonRef = { current: { focus: focusMock } };
			renderLoadedModal( { closeButtonRef } );
			expect( focusMock ).toHaveBeenCalledTimes( 1 );
		} );

		it( "updates the focus keyphrase field when its value changes", () => {
			renderLoadedModal();
			const input = screen.getByDisplayValue( defaultSuggestion.keyphrase );
			fireEvent.change( input, { target: { value: "updated keyphrase" } } );
			expect( screen.getByDisplayValue( "updated keyphrase" ) ).toBeInTheDocument();
		} );

		it( "updates the title field when its value changes", () => {
			renderLoadedModal();
			const input = screen.getByDisplayValue( defaultSuggestion.title );
			fireEvent.change( input, { target: { value: "Updated title" } } );
			expect( screen.getByDisplayValue( "Updated title" ) ).toBeInTheDocument();
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

		it( "calls fetchContentOutline when the retry button is clicked", () => {
			mockFetchContentOutlineFn.mockClear();
			renderErrorModal();
			fireEvent.click( screen.getByRole( "button", { name: "Mock retry" } ) );
			expect( mockFetchContentOutlineFn ).toHaveBeenCalledTimes( 1 );
		} );
	} );

	describe( "MetaDescriptionProgressBar", () => {
		it( "renders the progress bar container after loading", () => {
			renderLoadedModal();
			expect( document.body.querySelector( ".yst-h-1\\.5.yst-bg-slate-200" ) ).not.toBeNull();
		} );

		it( "does not render the progress bar when loading", () => {
			renderModal();
			expect( document.body.querySelector( ".yst-h-1\\.5.yst-bg-slate-200" ) ).toBeNull();
		} );

		it( "calls getDescriptionProgress with the meta description value, date, and locale after loading", () => {
			renderLoadedModal( { date: "Apr 22, 2026", locale: "en_US", isCornerstone: false } );
			expect( getDescriptionProgress ).toHaveBeenCalledWith(
				defaultSuggestion.meta_description,
				"Apr 22, 2026",
				false,
				false,
				"en_US"
			);
		} );

		it( "calls getDescriptionProgress with isTaxonomy=false always", () => {
			renderLoadedModal( { isCornerstone: true } );
			expect( getDescriptionProgress ).toHaveBeenCalledWith(
				expect.anything(),
				expect.anything(),
				true,
				false,
				expect.anything()
			);
		} );

		it( "calls getProgressColor with the score returned by getDescriptionProgress", () => {
			getDescriptionProgress.mockReturnValueOnce( { actual: 80, score: 6, max: 156 } );
			renderLoadedModal();
			expect( getProgressColor ).toHaveBeenCalledWith( 6 );
		} );

		it( "re-calls getDescriptionProgress when the meta description field is updated", () => {
			renderLoadedModal();
			getDescriptionProgress.mockClear();
			fireEvent.change( screen.getByDisplayValue( defaultSuggestion.meta_description ), { target: { value: "Updated description" } } );
			expect( getDescriptionProgress ).toHaveBeenCalledWith(
				"Updated description",
				expect.anything(),
				expect.anything(),
				false,
				expect.anything()
			);
		} );

		it( "caps the progress bar width at 100% when description is very long", () => {
			getDescriptionProgress.mockReturnValueOnce( { actual: 99999, score: 3, max: 156 } );
			renderLoadedModal();
			const innerBar = document.body.querySelector( ".yst-h-1\\.5.yst-bg-slate-200 > div" );
			expect( innerBar ).toHaveStyle( "width: 100%" );
		} );

		it( "sets the progress bar background color from getProgressColor", () => {
			getDescriptionProgress.mockReturnValueOnce( { actual: 10, score: 3, max: 156 } );
			getProgressColor.mockReturnValueOnce( "#e63946" );
			renderLoadedModal();
			const innerBar = document.body.querySelector( ".yst-h-1\\.5.yst-bg-slate-200 > div" );
			expect( innerBar ).toHaveStyle( "background-color: #e63946" );
		} );
	} );
} );
