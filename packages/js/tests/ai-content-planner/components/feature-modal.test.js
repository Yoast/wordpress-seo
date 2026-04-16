import { render, screen, fireEvent, act } from "@testing-library/react";
import { useSelect, useDispatch, select } from "@wordpress/data";
import { FeatureModal } from "../../../src/ai-content-planner/components/feature-modal";
import { useFetchContentSuggestions } from "../../../src/ai-content-planner/hooks/use-fetch-content-suggestions";

jest.mock( "@yoast/ai-frontend", () => ( {
	UsageCounter: () => null,
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
				const dispatchFn = ( storeName ) => {
					if ( storeName === "core/block-editor" ) {
						return { resetBlocks: jest.fn() };
					}
					if ( storeName === "yoast-seo/content-planner" ) {
						return {
							getContentOutline: jest.fn().mockResolvedValue( undefined ),
							fetchContentPlannerSuggestions: jest.fn(),
							setFeatureModalStatus: jest.fn(),
						};
					}
					return {};
				};
				const dispatchProps = mapDispatchToProps( dispatchFn );
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

const mockResetBlocks = jest.fn();
const mockGetContentOutline = jest.fn().mockResolvedValue( undefined );
const mockFetchContentPlannerSuggestions = jest.fn();
const mockFetchUsageCount = jest.fn().mockResolvedValue( {} );
const mockAddUsageCount = jest.fn();

const setupMocks = () => {
	useFetchContentSuggestions.mockReturnValue( mockFetchContentPlannerSuggestions );
	useDispatch.mockImplementation( ( storeName ) => {
		if ( storeName === "yoast-seo/ai-generator" ) {
			return {
				fetchUsageCount: mockFetchUsageCount,
				addUsageCount: mockAddUsageCount,
			};
		}
		if ( storeName === "yoast-seo/content-planner" ) {
			return {
				fetchContentPlannerSuggestions: jest.fn(),
				fetchContentOutline: jest.fn(),
				setFeatureModalStatus: jest.fn(),
			};
		}
		return {};
	} );
	useSelect.mockImplementation( ( selector ) => {
		if ( typeof selector !== "function" ) {
			return {};
		}
		const mockSelectFn = ( storeName ) => {
			if ( storeName === "yoast-seo/content-planner" ) {
				return {
					selectSuggestion: () => null,
					selectSuggestions: () => [
						{ intent: "informational", title: "How to train your dog", explanation: "Tips on dog training." },
					],
					selectContentOutline: () => ( { sections: [], faqContentNotes: [] } ),
					selectSuggestionsStatus: () => "success",
					selectContentOutlineStatus: () => "idle",
					selectContentSuggestionsEndpoint: () => "/yoast/v1/content_planner/suggestions",
					selectContentOutlineEndpoint: () => "/yoast/v1/content_planner/outline",
				};
			}
			if ( storeName === "yoast-seo/editor" ) {
				return {
					getIsPremium: () => false,
					getPostType: () => "post",
					getContentLocale: () => "en_US",
					getEditorTypeApiValue: () => "gutenberg",
				};
			}
			if ( storeName === "yoast-seo/ai-generator" ) {
				return {
					selectUsageCount: () => 1,
					selectUsageCountLimit: () => 10,
					selectUsageCountEndpoint: () => "/yoast/v1/ai_generator/get_usage",
					isUsageCountLimitReached: () => false,
				};
			}
			return {};
		};
		return selector( mockSelectFn );
	} );
	select.mockReturnValue( { selectContentOutline: jest.fn().mockReturnValue( { sections: [], faqContentNotes: [] } ) } );
};

const createModalElement = ( { initialStatus = "idle", ...props } = {} ) => (
	<FeatureModal
		isOpen={ true }
		onClose={ jest.fn() }
		isEmptyPost={ true }
		isPremium={ false }
		isUpsell={ false }
		status={ initialStatus }
		setStatus={ jest.fn() }
		resetBlocks={ mockResetBlocks }
		getContentOutline={ mockGetContentOutline }
		{ ...props }
	/>
);

const renderModal = ( props ) => render( createModalElement( props ) );

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
		expect( mockFetchContentPlannerSuggestions ).toHaveBeenCalledTimes( 1 );
	} );

	it( "transitions to the content suggestions view when the store status changes to loading", () => {
		renderModal( { initialStatus: "content-suggestions" } );
		expect( screen.getByText( "Content suggestions" ) ).toBeInTheDocument();
	} );

	it( "shows the replace content confirmation when 'Add outline to post' is clicked and post is not empty", () => {
		const { rerender } = renderModal( { isEmptyPost: false } );
		act( () => {
			jest.advanceTimersByTime( 300 );
		} );
		// Navigate through: approve → suggestions → outline → replace content.
		fireEvent.click( screen.getByRole( "button", { name: "Get content suggestions" } ) );
		rerender( createModalElement( { isEmptyPost: false } ) );
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
		const { rerender } = renderModal( { isEmptyPost: true, onAddOutline, onClose } );
		act( () => {
			jest.advanceTimersByTime( 300 );
		} );
		fireEvent.click( screen.getByRole( "button", { name: "Get content suggestions" } ) );
		rerender( createModalElement( { isEmptyPost: true, onAddOutline, onClose } ) );
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
		const { rerender } = renderModal( { isEmptyPost: false } );
		act( () => {
			jest.advanceTimersByTime( 300 );
		} );
		fireEvent.click( screen.getByRole( "button", { name: "Get content suggestions" } ) );
		rerender( createModalElement( { isEmptyPost: false } ) );
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
		const { rerender } = renderModal( { isEmptyPost: false, onAddOutline, onClose } );
		act( () => {
			jest.advanceTimersByTime( 300 );
		} );
		fireEvent.click( screen.getByRole( "button", { name: "Get content suggestions" } ) );
		rerender( createModalElement( { isEmptyPost: false, onAddOutline, onClose } ) );
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

	it( "skips the approve modal when initialStatus is content-suggestions", () => {
		renderModal( { initialStatus: "content-suggestions" } );
		// Should go straight to content suggestions, no approve modal.
		expect( screen.queryByText( "Looking for inspiration?" ) ).not.toBeInTheDocument();
		expect( screen.getByText( "Content suggestions" ) ).toBeInTheDocument();
	} );

	it( "fetches usage count when the modal opens", () => {
		renderModal( { isOpen: true } );
		expect( mockFetchUsageCount ).toHaveBeenCalledWith( {
			endpoint: "/yoast/v1/ai_generator/get_usage",
			isWooProductEntity: false,
		} );
	} );

	it( "does not fetch usage count when the modal is closed", () => {
		renderModal( { isOpen: false } );
		expect( mockFetchUsageCount ).not.toHaveBeenCalled();
	} );

	it( "calls addUsageCount when suggestions status transitions to success", () => {
		// Start with suggestionsStatus as "idle" so the ref initializes to "idle".
		const mockSelectWithIdle = ( selector ) => {
			if ( typeof selector !== "function" ) {
				return {};
			}
			return selector( ( storeName ) => {
				if ( storeName === "yoast-seo/content-planner" ) {
					return {
						selectSuggestion: () => null,
						selectSuggestions: () => [],
						selectContentOutline: () => ( { sections: [], faqContentNotes: [] } ),
						selectSuggestionsStatus: () => "idle",
						selectContentOutlineStatus: () => "idle",
						selectContentSuggestionsEndpoint: () => "",
						selectContentOutlineEndpoint: () => "",
					};
				}
				if ( storeName === "yoast-seo/editor" ) {
					return {
						getIsPremium: () => false,
						getPostType: () => "post",
						getContentLocale: () => "en_US",
						getEditorTypeApiValue: () => "gutenberg",
					};
				}
				if ( storeName === "yoast-seo/ai-generator" ) {
					return {
						selectUsageCount: () => 0,
						selectUsageCountLimit: () => 10,
						selectUsageCountEndpoint: () => "/yoast/v1/ai_generator/get_usage",
						isUsageCountLimitReached: () => false,
					};
				}
				return {};
			} );
		};

		// Render with suggestions status "idle".
		useSelect.mockImplementation( mockSelectWithIdle );
		const { rerender } = renderModal();
		expect( mockAddUsageCount ).not.toHaveBeenCalled();

		// Now transition suggestions status to "success".
		setupMocks();
		rerender( createModalElement() );

		expect( mockAddUsageCount ).toHaveBeenCalledTimes( 1 );
	} );

	it( "does not call addUsageCount when suggestions status is already success on mount", () => {
		// Default setupMocks returns suggestionsStatus "success", so the ref initializes to "success".
		renderModal();
		// addUsageCount should NOT be called because there was no transition.
		expect( mockAddUsageCount ).not.toHaveBeenCalled();
	} );
} );
