import { render, screen, fireEvent, act } from "@testing-library/react";
import { useDispatch, select } from "@wordpress/data";
import { FeatureModal } from "../../../src/ai-content-planner/components/feature-modal";

jest.mock( "@yoast/ai-frontend", () => ( {
	UsageCounter: () => null,
} ) );

jest.mock( "@wordpress/data", () => ( {
	useDispatch: jest.fn(),
	useSelect: jest.fn( () => false ),
	select: jest.fn(),
	dispatch: jest.fn(),
	resolveSelect: jest.fn(),
	combineReducers: ( reducers ) => ( state = {}, action ) => Object.keys( reducers ).reduce(
		( nextState, key ) => ( { ...nextState, [ key ]: reducers[ key ]( state[ key ], action ) } ),
		{}
	),
	createReduxStore: jest.fn(),
	register: jest.fn(),
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

const setupMocks = () => {
	useDispatch.mockImplementation( ( store ) => {
		if ( store === "core/block-editor" ) {
			return { resetBlocks: mockResetBlocks };
		}
		return { getContentOutline: mockGetContentOutline };
	} );
	select.mockReturnValue( { selectContentOutline: jest.fn().mockReturnValue( {} ) } );
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

	it( "transitions to the content suggestions view when the 'Get content suggestions' button is clicked", () => {
		renderModal();
		act( () => {
			jest.advanceTimersByTime( 300 );
		} );
		fireEvent.click( screen.getByRole( "button", { name: "Get content suggestions" } ) );
		expect( screen.getByText( "Content suggestions" ) ).toBeInTheDocument();
	} );

	it( "shows the replace content confirmation when 'Add outline to post' is clicked and canvas is not empty", () => {
		renderModal( { isEmptyCanvas: false } );
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

	it( "directly applies the outline when 'Add outline to post' is clicked and canvas is empty", async() => {
		const onAddOutline = jest.fn();
		const onClose = jest.fn();
		renderModal( { isEmptyCanvas: true, onAddOutline, onClose } );
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
		renderModal( { isEmptyCanvas: false } );
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

	it( "applies the outline when replace is confirmed on non-empty canvas", async() => {
		const onAddOutline = jest.fn();
		const onClose = jest.fn();
		renderModal( { isEmptyCanvas: false, onAddOutline, onClose } );
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
} );
