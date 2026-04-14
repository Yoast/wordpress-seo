import { render, screen, fireEvent, act } from "@testing-library/react";
import { useDispatch, useSelect, select } from "@wordpress/data";
import { FeatureModal } from "../../../src/ai-content-planner/components/feature-modal";

jest.mock( "@yoast/ai-frontend", () => ( {
	UsageCounter: () => null,
} ) );

jest.mock( "@wordpress/data", () => ( {
	useDispatch: jest.fn(),
	useSelect: jest.fn(),
	combineReducers: ( reducers ) => ( state = {}, action ) => Object.keys( reducers ).reduce(
		( nextState, key ) => ( { ...nextState, [ key ]: reducers[ key ]( state[ key ], action ) } ),
		{}
	),
	createReduxStore: jest.fn(),
	register: jest.fn(),
	select: jest.fn(),
	dispatch: jest.fn(),
	resolveSelect: jest.fn(),
} ) );

jest.mock( "@wordpress/blocks", () => ( {
	createBlock: jest.fn(),
} ) );

jest.mock( "../../../src/ai-content-planner/helpers/build-blocks-from-outline", () => ( {
	buildBlocksFromOutline: jest.fn().mockReturnValue( [] ),
} ) );

jest.mock( "../../../src/ai-content-planner/helpers/apply-post-meta-from-outline", () => ( {
	applyPostMetaFromOutline: jest.fn().mockResolvedValue( undefined ),
} ) );

const mockResetBlocks = jest.fn();
const mockGetContentOutline = jest.fn().mockResolvedValue( undefined );

// Mutable status that fetchContentPlannerSuggestions can update to simulate
// the store transitioning from loading → success after a fetch.
let currentSuggestionsStatus;
const mockFetchContentPlannerSuggestions = jest.fn().mockImplementation( () => {
	currentSuggestionsStatus = "success";
} );

const setupMocks = ( { suggestionsStatus } = {} ) => {
	currentSuggestionsStatus = suggestionsStatus;
	useDispatch.mockImplementation( ( store ) => {
		if ( store === "core/block-editor" ) {
			return { resetBlocks: mockResetBlocks };
		}
		return { getContentOutline: mockGetContentOutline, fetchContentPlannerSuggestions: mockFetchContentPlannerSuggestions };
	} );
	useSelect.mockImplementation( ( selector ) => {
		if ( typeof selector !== "function" ) {
			return {};
		}
		const mockSelect = ( storeName ) => {
			if ( storeName === "yoast-seo/content-planner" ) {
				return {
					selectSuggestionsStatus: () => currentSuggestionsStatus,
					selectSuggestions: () => [
						{ intent: "informational", title: "How to train your dog", description: "Tips on dog training." },
					],
					selectContentOutline: () => ( { sections: [], faqContentNotes: [] } ),
					selectContentPlannerEndpoint: () => "yoast/v1/ai_content_planner/get_suggestions",
				};
			}
			if ( storeName === "yoast-seo/editor" ) {
				return {
					getPostType: () => "post",
					getContentLocale: () => "en_US",
					getEditorType: () => "blockEditor",
					getIsPremium: () => false,
				};
			}
			return {};
		};
		return selector( mockSelect );
	} );
	select.mockReturnValue( { selectContentOutline: jest.fn().mockReturnValue( { sections: [], faqContentNotes: [] } ) } );
};

const renderModal = ( props ) => render(
	<FeatureModal
		isOpen={ true }
		onClose={ jest.fn() }
		isEmptyPost={ true }
		isPremium={ false }
		isUpsell={ false }
		{ ...props }
	/>
);

describe( "FeatureModal", () => {
	beforeEach( () => {
		jest.useFakeTimers();
		setupMocks();
	} );

	afterEach( () => {
		jest.useRealTimers();
		jest.clearAllMocks();
	} );

	it( "does not render the dialog when isOpen is false", () => {
		renderModal( { isOpen: false } );
		expect( screen.queryByRole( "dialog" ) ).not.toBeInTheDocument();
	} );

	it( "renders the approve modal initially when open", () => {
		renderModal();
		act( () => {
			jest.advanceTimersByTime( 300 );
		} );
		expect( screen.getByRole( "dialog" ) ).toBeInTheDocument();
		expect( screen.getByText( "Looking for inspiration?" ) ).toBeInTheDocument();
	} );

	it( "calls onClose when the close button is clicked", () => {
		const onClose = jest.fn();
		renderModal( { onClose } );
		act( () => {
			jest.advanceTimersByTime( 300 );
		} );
		fireEvent.click( screen.getByRole( "button", { name: "Close modal" } ) );
		expect( onClose ).toHaveBeenCalledTimes( 1 );
	} );

	it( "dispatches fetchContentPlannerSuggestions when the 'Get content suggestions' button is clicked", () => {
		renderModal();
		act( () => {
			jest.advanceTimersByTime( 300 );
		} );
		fireEvent.click( screen.getByRole( "button", { name: "Get content suggestions" } ) );
		expect( mockFetchContentPlannerSuggestions ).toHaveBeenCalledWith( {
			endpoint: "yoast/v1/ai_content_planner/get_suggestions",
			postType: "post",
			language: "en-US",
			editor: "gutenberg",
		} );
	} );

	it( "transitions to the content suggestions view when the store status changes to loading", () => {
		setupMocks( { suggestionsStatus: "loading" } );
		renderModal( { initialStatus: "content-suggestions-loading" } );
		expect( screen.getByText( "Content suggestions" ) ).toBeInTheDocument();
	} );

	it( "shows the replace content confirmation when 'Add outline to post' is clicked and post is not empty", () => {
		renderModal( { isEmptyPost: false } );
		act( () => {
			jest.advanceTimersByTime( 300 );
		} );
		// Navigate through: approve → suggestions → outline → replace content.
		fireEvent.click( screen.getByRole( "button", { name: "Get content suggestions" } ) );
		act( () => {
			jest.advanceTimersByTime( 5000 );
		} );
		fireEvent.click( screen.getByText( "How to train your dog" ) );
		act( () => {
			jest.advanceTimersByTime( 5000 );
		} );
		fireEvent.click( screen.getByRole( "button", { name: /Add outline to post/i } ) );
		act( () => {
			jest.advanceTimersByTime( 600 );
		} );
		expect( screen.getByText( "Replace existing content with this outline?" ) ).toBeInTheDocument();
	} );

	it( "directly applies the outline when 'Add outline to post' is clicked and post is empty", async() => {
		const onAddOutline = jest.fn();
		const onClose = jest.fn();
		renderModal( { isEmptyPost: true, onAddOutline, onClose } );
		act( () => {
			jest.advanceTimersByTime( 300 );
		} );
		fireEvent.click( screen.getByRole( "button", { name: "Get content suggestions" } ) );
		act( () => {
			jest.advanceTimersByTime( 5000 );
		} );
		fireEvent.click( screen.getByText( "How to train your dog" ) );
		act( () => {
			jest.advanceTimersByTime( 5000 );
		} );
		await act( async() => {
			fireEvent.click( screen.getByRole( "button", { name: /Add outline to post/i } ) );
		} );
		expect( mockGetContentOutline ).toHaveBeenCalledTimes( 1 );
		expect( mockResetBlocks ).toHaveBeenCalledTimes( 1 );
		expect( onAddOutline ).toHaveBeenCalledTimes( 1 );
		expect( onClose ).toHaveBeenCalledTimes( 1 );
		expect( screen.queryByText( "Replace existing content with this outline?" ) ).not.toBeInTheDocument();
	} );

	it( "returns to the content outline when cancel is clicked on the replace confirmation", () => {
		renderModal( { isEmptyPost: false } );
		act( () => {
			jest.advanceTimersByTime( 300 );
		} );
		fireEvent.click( screen.getByRole( "button", { name: "Get content suggestions" } ) );
		act( () => {
			jest.advanceTimersByTime( 5000 );
		} );
		fireEvent.click( screen.getByText( "How to train your dog" ) );
		act( () => {
			jest.advanceTimersByTime( 5000 );
		} );
		fireEvent.click( screen.getByRole( "button", { name: /Add outline to post/i } ) );
		act( () => {
			jest.advanceTimersByTime( 600 );
		} );
		fireEvent.click( screen.getByRole( "button", { name: "Cancel" } ) );
		act( () => {
			jest.advanceTimersByTime( 600 );
		} );
		expect( screen.getByText( "Content outline" ) ).toBeInTheDocument();
	} );

	it( "applies the outline when replace is confirmed on non-empty post", async() => {
		const onAddOutline = jest.fn();
		const onClose = jest.fn();
		renderModal( { isEmptyPost: false, onAddOutline, onClose } );
		act( () => {
			jest.advanceTimersByTime( 300 );
		} );
		fireEvent.click( screen.getByRole( "button", { name: "Get content suggestions" } ) );
		act( () => {
			jest.advanceTimersByTime( 5000 );
		} );
		fireEvent.click( screen.getByText( "How to train your dog" ) );
		act( () => {
			jest.advanceTimersByTime( 5000 );
		} );
		fireEvent.click( screen.getByRole( "button", { name: /Add outline to post/i } ) );
		act( () => {
			jest.advanceTimersByTime( 600 );
		} );
		await act( async() => {
			fireEvent.click( screen.getByRole( "button", { name: "Replace content" } ) );
		} );
		expect( mockGetContentOutline ).toHaveBeenCalledTimes( 1 );
		expect( mockResetBlocks ).toHaveBeenCalledTimes( 1 );
		expect( onAddOutline ).toHaveBeenCalledTimes( 1 );
		expect( onClose ).toHaveBeenCalledTimes( 1 );
	} );

	it( "skips the approve modal when initialStatus is content-suggestions-loading", () => {
		renderModal( { initialStatus: "content-suggestions-loading" } );
		// Should go straight to content suggestions, no approve modal.
		expect( screen.queryByText( "Looking for inspiration?" ) ).not.toBeInTheDocument();
		expect( screen.getByText( "Content suggestions" ) ).toBeInTheDocument();
	} );
} );
