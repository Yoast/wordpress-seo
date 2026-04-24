import { render, screen, fireEvent, act } from "@testing-library/react";
import { useSelect, useDispatch, select } from "@wordpress/data";
import { FeatureModal } from "../../../src/ai-content-planner/components/feature-modal";
import { useFetchContentSuggestions, useFetchContentOutline, useApplyOutline } from "../../../src/ai-content-planner/hooks";

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

jest.mock( "../../../src/ai-content-planner/hooks/use-apply-outline", () => ( {
	useApplyOutline: jest.fn(),
} ) );

const mockFetchContentPlannerSuggestions = jest.fn();
const mockFetchContentOutlineFn = jest.fn();
const mockCloseModal = jest.fn();
const mockResetBlocks = jest.fn();
const mockRemoveBlock = jest.fn();
const mockOpenReplaceContentModal = jest.fn();
const mockSetHasVisitedReplace = jest.fn();
const mockApplyOutline = jest.fn();

const mockSuggestion = {
	intent: "informational",
	title: "How to train your dog",
	explanation: "Tips on dog training.",
	keyphrase: "dog training",
	// eslint-disable-next-line camelcase
	meta_description: "A guide to training your dog.",
	index: 0,
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

const createModalElement = ( { status = "idle", editedOutlineRef = { current: null }, ...props } = {} ) => (
	<FeatureModal
		onClose={ jest.fn() }
		isEmptyPost={ true }
		isPremium={ false }
		status={ status }
		editedOutlineRef={ editedOutlineRef }
		openReplaceContentModal={ mockOpenReplaceContentModal }
		setHasVisitedReplace={ mockSetHasVisitedReplace }
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

	it( "does not render the modal when status is 'idle'", () => {
		renderModal();
		expect( screen.queryByRole( "dialog" ) ).not.toBeInTheDocument();
	} );

	it( "calls onClose when the modal is closed", () => {
		const onClose = jest.fn();
		renderModal( { onClose, status: "content-suggestions" } );
		const closeButtons = screen.getAllByRole( "button" );
		const closeButton = closeButtons.find( ( btn ) => btn.getAttribute( "aria-label" ) || btn.textContent.includes( "Close" ) );
		fireEvent.click( closeButton );
		expect( onClose ).toHaveBeenCalled();
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

	it( "directly applies the outline when 'Add outline to post' is clicked and post is empty", async() => {
		useApplyOutline.mockReturnValue( mockApplyOutline );
		setupMocks( {
			"yoast-seo/content-planner": {
				selectSuggestion: () => mockSuggestion,
			},
		} );
		renderModal( { isEmptyPost: true, status: "content-outline" } );
		await act( async() => {
			fireEvent.click( screen.getByRole( "button", { name: /Add outline to post/i } ) );
		} );
		expect( mockApplyOutline ).toHaveBeenCalled();
		expect( mockOpenReplaceContentModal ).not.toHaveBeenCalled();
	} );

	it( "calls openReplaceContentModal and setHasVisitedReplace when 'Add outline to post' is clicked and post is not empty", () => {
		useApplyOutline.mockReturnValue( mockApplyOutline );
		setupMocks( {
			"yoast-seo/content-planner": {
				selectSuggestion: () => mockSuggestion,
			},
		} );
		renderModal( { isEmptyPost: false, status: "content-outline" } );
		fireEvent.click( screen.getByRole( "button", { name: /Add outline to post/i } ) );
		expect( mockOpenReplaceContentModal ).toHaveBeenCalledTimes( 1 );
		expect( mockSetHasVisitedReplace ).toHaveBeenCalledWith( true );
		expect( mockApplyOutline ).not.toHaveBeenCalled();
	} );

	it( "applies the outline when 'Add outline to post' is clicked on an empty post", async() => {
		useApplyOutline.mockReturnValue( mockApplyOutline );
		setupMocks( {
			"yoast-seo/content-planner": {
				selectSuggestion: () => mockSuggestion,
			},
		} );
		renderModal( { isEmptyPost: true, status: "content-outline" } );
		await act( async() => {
			fireEvent.click( screen.getByRole( "button", { name: /Add outline to post/i } ) );
		} );
		expect( mockApplyOutline ).toHaveBeenCalledTimes( 1 );
	} );

	it( "skips the approve modal when status is 'content-suggestions'", () => {
		renderModal( { status: "content-suggestions" } );
		expect( screen.queryByText( "Looking for inspiration?" ) ).not.toBeInTheDocument();
		expect( screen.getByText( "Content suggestions" ) ).toBeInTheDocument();
	} );
} );
