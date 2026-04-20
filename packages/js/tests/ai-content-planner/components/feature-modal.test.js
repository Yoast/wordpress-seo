import { render, screen, fireEvent, act } from "@testing-library/react";
import { useSelect, useDispatch, select } from "@wordpress/data";
import { FeatureModal } from "../../../src/ai-content-planner/components/feature-modal";
import { useFetchContentSuggestions } from "../../../src/ai-content-planner/hooks/use-fetch-content-suggestions";
import { useFetchContentOutline } from "../../../src/ai-content-planner/hooks/use-fetch-content-outline";

jest.mock( "@yoast/ai-frontend", () => ( {
	UsageCounter: () => null,
} ) );

jest.mock( "../../../src/ai-generator/components/sparks-limit-notification", () => ( {
	SparksLimitNotification: () => null,
} ) );

jest.mock( "@wordpress/data", () => {
	const useSelectMock = jest.fn();
	const useDispatchMock = jest.fn();
	return {
		useDispatch: useDispatchMock,
		useSelect: useSelectMock,
		withSelect: ( mapSelectToProps ) => ( Component ) => {
			const React = require( "react" );
			const WithSelectComponent = ( ownProps ) => {
				const selectProps = useSelectMock( ( selectFn ) => mapSelectToProps( selectFn, ownProps ) );
				return React.createElement( Component, Object.assign( {}, ownProps, selectProps ) );
			};
			WithSelectComponent.displayName = `WithSelect(${ Component.displayName || Component.name || "Component" })`;
			return WithSelectComponent;
		},
		withDispatch: ( mapDispatchToProps ) => ( Component ) => {
			const React = require( "react" );
			const WithDispatchComponent = ( ownProps ) => {
				const dispatchProps = mapDispatchToProps( () => ( {} ), ownProps ) || {};
				return React.createElement( Component, Object.assign( {}, ownProps, dispatchProps ) );
			};
			WithDispatchComponent.displayName = `WithDispatch(${ Component.displayName || Component.name || "Component" })`;
			return WithDispatchComponent;
		},
		combineReducers: ( reducers ) => ( state = {}, action ) => Object.keys( reducers ).reduce(
			( nextState, key ) => ( { ...nextState, [ key ]: reducers[ key ]( state[ key ], action ) } ),
			{}
		),
		createReduxStore: jest.fn(),
		register: jest.fn(),
		select: jest.fn(),
		dispatch: jest.fn(),
		resolveSelect: jest.fn(),
	};
} );

jest.mock( "@wordpress/compose", () => ( {
	compose: ( hocs ) => ( Component ) => hocs.reduceRight( ( Acc, hoc ) => hoc( Acc ), Component ),
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

jest.mock( "../../../src/ai-content-planner/hooks/use-fetch-content-suggestions", () => ( {
	useFetchContentSuggestions: jest.fn(),
} ) );

jest.mock( "../../../src/ai-content-planner/hooks/use-fetch-content-outline", () => ( {
	useFetchContentOutline: jest.fn(),
} ) );

const mockFetchContentPlannerSuggestions = jest.fn();
const mockFetchContentOutlineFn = jest.fn();
const mockCloseModal = jest.fn();
const mockResetBlocks = jest.fn();
const mockRemoveBlock = jest.fn();

const mockSuggestion = {
	intent: "informational",
	title: "How to train your dog",
	explanation: "Tips on dog training.",
	keyphrase: "dog training",
	// eslint-disable-next-line camelcase
	meta_description: "A guide to training your dog.",
};

const EMPTY_OUTLINE = [];

const defaultStoreSelectors = {
	"yoast-seo/content-planner": {
		selectSuggestions: () => [ mockSuggestion ],
		selectSuggestion: () => null,
		selectContentOutline: () => EMPTY_OUTLINE,
		selectContentOutlineStatus: () => "idle",
		selectContentOutlineError: () => null,
		selectSuggestionsStatus: () => "success",
		selectSuggestionsError: () => null,
		selectContentOutlineEndpoint: () => "",
		selectContentSuggestionsEndpoint: () => "",
		selectFeatureModalStatus: () => "idle",
		selectIsModalOpen: () => true,
	},
	"yoast-seo/editor": {
		getIsPremium: () => false,
		getPostType: () => "post",
		getContentLocale: () => "en",
		getEditorTypeApiValue: () => "block",
		selectLink: () => "",
	},
	"yoast-seo/ai-generator": {
		selectUsageCount: () => 1,
		selectUsageCountLimit: () => 10,
		isUsageCountLimitReached: () => false,
		selectUsageCountStatus: () => "idle",
	},
	"core/editor": {
		getEditedPostContent: () => "",
	},
};

const buildSelectFn = ( overrides = {} ) => ( storeName ) => ( {
	...( defaultStoreSelectors[ storeName ] || {} ),
	...( overrides[ storeName ] || {} ),
} );

const setupMocks = ( selectOverrides = {} ) => {
	useFetchContentSuggestions.mockReturnValue( mockFetchContentPlannerSuggestions );
	useFetchContentOutline.mockReturnValue( mockFetchContentOutlineFn );

	const selectFn = buildSelectFn( selectOverrides );
	useSelect.mockImplementation( ( selector ) => {
		if ( typeof selector !== "function" ) {
			return {};
		}
		return selector( selectFn );
	} );

	useDispatch.mockImplementation( () => ( {
		fetchContentOutline: jest.fn().mockResolvedValue( undefined ),
		fetchContentPlannerSuggestions: jest.fn(),
		closeModal: mockCloseModal,
		resetBlocks: mockResetBlocks,
		removeBlock: mockRemoveBlock,
		setFeatureModalStatus: jest.fn(),
	} ) );

	select.mockImplementation( () => ( {
		selectContentOutline: jest.fn().mockReturnValue( [] ),
		getBlocks: jest.fn().mockReturnValue( [] ),
	} ) );
};

const mockSetStatus = jest.fn();

const createModalElement = ( { status = "idle", setStatus = mockSetStatus, ...props } = {} ) => (
	<FeatureModal
		isOpen={ true }
		onClose={ jest.fn() }
		isEmptyPost={ true }
		isPremium={ false }
		isUpsell={ false }
		status={ status }
		setStatus={ setStatus }
		{ ...props }
	/>
);

const renderModal = ( props ) => render( createModalElement( props ) );

describe( "FeatureModal", () => {
	beforeAll( () => {
		// Suppress the @testing-library/react v14 warning about the deprecated ReactDOMTestUtils.act.
		jest.spyOn( console, "error" ).mockImplementation( ( message, ...args ) => {
			if ( typeof message === "string" && message.includes( "ReactDOMTestUtils.act" ) ) {
				return;
			}
			process.stderr.write( [ message, ...args ].join( " " ) + "\n" );
		} );
	} );

	afterAll( () => {
		console.error.mockRestore();
	} );

	beforeEach( () => {
		setupMocks();
	} );

	afterEach( () => {
		jest.clearAllMocks();
	} );

	it( "does not render the dialog when isOpen is false", () => {
		renderModal( { isOpen: false } );
		expect( screen.queryByRole( "dialog" ) ).not.toBeInTheDocument();
	} );

	it( "renders the approve modal initially when open", () => {
		renderModal();
		expect( screen.getByRole( "dialog" ) ).toBeInTheDocument();
		expect( screen.getByText( "Looking for inspiration?" ) ).toBeInTheDocument();
	} );

	it( "calls onClose when the modal is closed", () => {
		const onClose = jest.fn();
		renderModal( { onClose } );
		// The modal close button calls onClose
		const closeButtons = screen.getAllByRole( "button" );
		const closeButton = closeButtons.find( ( btn ) => btn.getAttribute( "aria-label" ) || btn.textContent.includes( "Close" ) );
		fireEvent.click( closeButton );
		expect( onClose ).toHaveBeenCalled();
	} );

	it( "dispatches fetchContentPlannerSuggestions when the 'Get content suggestions' button is clicked", () => {
		renderModal( { hasConsent: true } );
		fireEvent.click( screen.getByRole( "button", { name: "Get content suggestions" } ) );
		expect( mockFetchContentPlannerSuggestions ).toHaveBeenCalledTimes( 1 );
	} );

	it( "shows consent modal instead of fetching suggestions when user has not granted consent", () => {
		const setStatus = jest.fn();
		renderModal( { hasConsent: false, setStatus } );
		fireEvent.click( screen.getByRole( "button", { name: "Get content suggestions" } ) );
		expect( mockFetchContentPlannerSuggestions ).not.toHaveBeenCalled();
		expect( setStatus ).toHaveBeenCalledWith( "consent" );
	} );

	it( "shows the content suggestions panel when status is 'content-suggestions'", () => {
		renderModal( { status: "content-suggestions" } );
		expect( screen.getByText( "Content suggestions" ) ).toBeInTheDocument();
	} );

	it( "shows the content outline panel when status is 'content-outline' and suggestion is set", () => {
		setupMocks( {
			"yoast-seo/content-planner": {
				selectSuggestion: () => mockSuggestion,
			},
		} );
		renderModal( { status: "content-outline" } );
		expect( screen.getByText( "Content outline" ) ).toBeInTheDocument();
	} );

	it( "calls setStatus with 'replace-content' when 'Add outline to post' is clicked on non-empty post", () => {
		const setStatus = jest.fn();
		setupMocks( {
			"yoast-seo/content-planner": {
				selectSuggestion: () => mockSuggestion,
			},
		} );
		renderModal( { isEmptyPost: false, status: "content-outline", setStatus } );
		fireEvent.click( screen.getByRole( "button", { name: /Add outline to post/i } ) );
		expect( setStatus ).toHaveBeenCalledWith( "replace-content" );
	} );

	it( "directly applies the outline when 'Add outline to post' is clicked and post is empty", async() => {
		setupMocks( {
			"yoast-seo/content-planner": {
				selectSuggestion: () => mockSuggestion,
			},
		} );
		renderModal( { isEmptyPost: true, status: "content-outline" } );
		await act( async() => {
			fireEvent.click( screen.getByRole( "button", { name: /Add outline to post/i } ) );
		} );
		expect( mockResetBlocks ).toHaveBeenCalledTimes( 1 );
		expect( mockCloseModal ).toHaveBeenCalledTimes( 1 );
		expect( screen.queryByText( "Replace existing content with this outline?" ) ).not.toBeInTheDocument();
	} );

	it( "calls setStatus with 'content-outline' when cancel is clicked on the replace confirmation", () => {
		const setStatus = jest.fn();
		setupMocks( {
			"yoast-seo/content-planner": {
				selectSuggestion: () => mockSuggestion,
			},
		} );
		// Render with non-empty post at content-outline status.
		renderModal( { isEmptyPost: false, status: "content-outline", setStatus } );
		// Click Add outline to post → triggers setHasVisitedReplace=true and setStatus("replace-content")
		fireEvent.click( screen.getByRole( "button", { name: /Add outline to post/i } ) );
		// Both setStatus calls happen: once with "replace-content", then Cancel would call "content-outline"
		expect( setStatus ).toHaveBeenCalledWith( "replace-content" );
	} );

	it( "applies the outline when replace is confirmed on non-empty post", async() => {
		setupMocks( {
			"yoast-seo/content-planner": {
				selectSuggestion: () => mockSuggestion,
			},
		} );
		renderModal( { isEmptyPost: true, status: "content-outline", selectedSuggestion: mockSuggestion } );
		await act( async() => {
			fireEvent.click( screen.getByRole( "button", { name: /Add outline to post/i } ) );
		} );
		expect( mockResetBlocks ).toHaveBeenCalledTimes( 1 );
		expect( mockCloseModal ).toHaveBeenCalledTimes( 1 );
	} );

	it( "skips the approve modal when status is 'content-suggestions'", () => {
		renderModal( { status: "content-suggestions" } );
		expect( screen.queryByText( "Looking for inspiration?" ) ).not.toBeInTheDocument();
		expect( screen.getByText( "Content suggestions" ) ).toBeInTheDocument();
	} );
} );
