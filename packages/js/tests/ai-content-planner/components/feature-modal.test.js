import { render, screen, fireEvent, act } from "@testing-library/react";
import { useSelect, useDispatch } from "@wordpress/data";
import { FeatureModal } from "../../../src/ai-content-planner/components/feature-modal";

jest.mock( "@yoast/ai-frontend", () => ( {
	UsageCounter: () => null,
} ) );

jest.mock( "@wordpress/data", () => ( {
	useSelect: jest.fn(),
	useDispatch: jest.fn(),
	combineReducers: ( reducers ) => ( state = {}, action ) => Object.keys( reducers ).reduce(
		( nextState, key ) => ( { ...nextState, [ key ]: reducers[ key ]( state[ key ], action ) } ),
		{}
	),
	createReduxStore: jest.fn(),
	register: jest.fn(),
} ) );

const mockFetchContentPlannerSuggestions = jest.fn();

const setupMocks = ( { suggestionsStatus = "idle" } = {} ) => {
	// Set up the window global that the component reads lazily on click.
	window.wpseoAiGenerator = {
		endpoints: {
			contentPlanner: "yoast/v1/ai_content_planner/get_suggestions",
		},
	};

	useSelect.mockImplementation( ( selector ) => {
		if ( typeof selector !== "function" ) {
			return {};
		}

		const postPlannerStore = {
			selectSuggestionsStatus: () => suggestionsStatus,
			selectSuggestions: () => [],
		};

		const editorStore = {
			getPostType: () => "post",
			getContentLocale: () => "en_US",
			getIsBlockEditor: () => true,
			getIsElementorEditor: () => false,
		};

		const select = ( storeName ) => {
			if ( storeName === "yoast-seo/post-planner" ) {
				return postPlannerStore;
			}
			if ( storeName === "yoast-seo/editor" ) {
				return editorStore;
			}
			return {};
		};

		return selector( select );
	} );
	useDispatch.mockReturnValue( {
		fetchContentPlannerSuggestions: mockFetchContentPlannerSuggestions,
	} );
};

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

describe( "FeatureModal", () => {
	beforeEach( () => {
		jest.useFakeTimers();
		jest.clearAllMocks();
		setupMocks();
	} );

	afterEach( () => {
		jest.useRealTimers();
		delete window.wpseoAiGenerator;
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
		renderModal();
		expect( screen.getByText( "Content suggestions" ) ).toBeInTheDocument();
	} );

	it( "transitions to the replace content confirmation when 'Add outline to post' is clicked", () => {
		renderModal();
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

	it( "returns to the content outline when cancel is clicked on the replace confirmation", () => {
		renderModal();
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

	it( "calls onAddOutline and onClose when replace is confirmed", () => {
		const onAddOutline = jest.fn();
		const onClose = jest.fn();
		renderModal( { onAddOutline, onClose } );
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
		fireEvent.click( screen.getByRole( "button", { name: "Replace content" } ) );
		expect( onAddOutline ).toHaveBeenCalledTimes( 1 );
		expect( onClose ).toHaveBeenCalledTimes( 1 );
	} );
} );
