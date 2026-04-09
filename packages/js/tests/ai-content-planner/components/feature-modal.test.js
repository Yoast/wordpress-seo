import { render, screen, fireEvent, act } from "@testing-library/react";
import { FeatureModal } from "../../../src/ai-content-planner/components/feature-modal";

jest.mock( "@yoast/ai-frontend", () => ( {
	UsageCounter: () => null,
} ) );

jest.mock( "@wordpress/data", () => ( {
	useSelect: jest.fn( () => false ),
} ) );

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
	} );

	afterEach( () => {
		jest.useRealTimers();
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
