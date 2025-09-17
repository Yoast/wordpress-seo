import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useDispatch } from "@wordpress/data";
import { createBlock } from "@wordpress/blocks";
import { AddBlockButton } from "../../../src/components/contentBlocks/AddBlockButton";

// Mock WordPress dependencies
jest.mock( "@wordpress/data", () => ( {
	useDispatch: jest.fn(),
} ) );

jest.mock( "@wordpress/blocks", () => ( {
	createBlock: jest.fn(),
} ) );

// Mock Heroicons
jest.mock( "@heroicons/react/outline", () => ( {
	PlusIcon: ( { className } ) => <svg className={ className } data-testid="plus-icon" />,
} ) );

describe( "AddBlockButton", () => {
	const mockInsertBlock = jest.fn();
	const defaultProps = {
		showUpsellBadge: false,
		blockName: "test/block",
	};

	beforeEach( () => {
		jest.clearAllMocks();
		useDispatch.mockReturnValue( { insertBlock: mockInsertBlock } );
		createBlock.mockReturnValue( { name: "test/block" } );
		jest.useFakeTimers();
	} );

	afterEach( () => {
		jest.useRealTimers();
	} );

	describe( "Rendering", () => {
		it( "renders the button with correct base classes", () => {
			render( <AddBlockButton { ...defaultProps } /> );

			const button = screen.getByRole( "button" );
			expect( button ).toBeInTheDocument();
			expect( button ).toHaveClass( "yst-box-border", "yst-flex", "yst-bg-white" );
		} );

		it( "renders the PlusIcon component", () => {
			render( <AddBlockButton { ...defaultProps } /> );

			const icon = screen.getByTestId( "plus-icon" );
			expect( icon ).toBeInTheDocument();
			expect( icon ).toHaveClass( "yst-h-4", "yst-w-4" );
		} );

		it( "has correct initial aria-label", () => {
			render( <AddBlockButton { ...defaultProps } /> );

			const button = screen.getByRole( "button" );
			expect( button ).toHaveAttribute( "aria-label", "Add block" );
		} );
	} );

	describe( "Mouse interactions", () => {
		it( "shows tooltip on mouse enter", () => {
			render( <AddBlockButton { ...defaultProps } /> );

			const button = screen.getByRole( "button" );
			fireEvent.mouseEnter( button );

			expect( button ).toHaveClass( "yoast-tooltip", "yoast-tooltip-w" );
			expect( button ).toHaveAttribute( "aria-label", "Add block to content." );
		} );

		it( "hides tooltip on mouse leave", () => {
			render( <AddBlockButton { ...defaultProps } /> );

			const button = screen.getByRole( "button" );
			fireEvent.mouseEnter( button );
			fireEvent.mouseLeave( button );

			expect( button ).not.toHaveClass( "yoast-tooltip" );
			expect( button ).toHaveAttribute( "aria-label", "Add block" );
		} );

		it( "does not show tooltip hover styles when button is clicked", () => {
			render( <AddBlockButton { ...defaultProps } /> );

			const button = screen.getByRole( "button" );
			fireEvent.click( button );
			fireEvent.mouseEnter( button );

			expect( button ).not.toHaveClass( "hover:yst-bg-slate-50" );
		} );
	} );

	describe( "Block insertion functionality", () => {
		it( "creates and inserts block when clicked without upsell badge", async() => {
			render( <AddBlockButton { ...defaultProps } /> );

			const button = screen.getByRole( "button" );
			fireEvent.click( button );

			// Button should show clicked state immediately
			expect( button ).toHaveClass( "yst-bg-primary-500" );

			// Fast-forward the timeout
			jest.advanceTimersByTime( 300 );

			await waitFor( () => {
				expect( createBlock ).toHaveBeenCalledWith( "test/block" );
				expect( mockInsertBlock ).toHaveBeenCalledWith( { name: "test/block" } );
			} );
		} );

		it( "changes icon color when clicked", () => {
			render( <AddBlockButton { ...defaultProps } /> );

			const button = screen.getByRole( "button" );
			const icon = screen.getByTestId( "plus-icon" );

			fireEvent.click( button );

			expect( icon ).toHaveClass( "yst-stroke-white" );
		} );
	} );

	describe( "Upsell badge functionality", () => {
		it( "does not insert block when upsell badge is shown", () => {
			render( <AddBlockButton { ...defaultProps } showUpsellBadge={ true } /> );

			const button = screen.getByRole( "button" );
			fireEvent.click( button );

			expect( button ).not.toHaveClass( "yst-bg-primary-500" );
			expect( createBlock ).not.toHaveBeenCalled();
			expect( mockInsertBlock ).not.toHaveBeenCalled();
		} );

		it( "does not show clicked state when upsell badge is shown", () => {
			render( <AddBlockButton { ...defaultProps } showUpsellBadge={ true } /> );

			const button = screen.getByRole( "button" );
			fireEvent.click( button );

			jest.advanceTimersByTime( 300 );

			expect( button ).toHaveClass( "yst-bg-white" );
			expect( button ).not.toHaveClass( "yst-bg-primary-500" );
		} );
	} );

	describe( "PropTypes", () => {
		it( "accepts required props", () => {
			expect( () => {
				render( <AddBlockButton showUpsellBadge={ false } blockName="test/block" /> );
			} ).not.toThrow();
		} );
	} );
} );
