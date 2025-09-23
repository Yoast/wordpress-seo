import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useDispatch, useSelect } from "@wordpress/data";
import { createBlock } from "@wordpress/blocks";
import { AddBlockButton } from "../../../src/components/contentBlocks/AddBlockButton";

// Mock WordPress dependencies
jest.mock( "@wordpress/data", () => ( {
	useDispatch: jest.fn(),
	useSelect: jest.fn(),
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
	const mockReplaceBlock = jest.fn();

	const defaultProps = {
		showUpsellBadge: false,
		blockName: "test/block",
	};

	beforeEach( () => {
		jest.clearAllMocks();
		useDispatch.mockReturnValue( { insertBlock: mockInsertBlock } );
		createBlock.mockReturnValue( { name: "test/block" } );
		jest.useFakeTimers();
		useDispatch.mockReturnValue( {
			insertBlock: mockInsertBlock,
			replaceBlock: mockReplaceBlock,
		} );
	} );

	afterEach( () => {
		jest.useRealTimers();
		jest.clearAllMocks();
	} );

	describe( "Rendering", () => {
		const emptyParagraphBlock = {
			clientId: "empty-block-id",
			name: "core/paragraph",
			attributes: { content: { text: "" } },
		};
		beforeEach( () => {
			useSelect.mockReturnValue( {
				blockInsertionPoint: { index: 1 },
				blocks: [ emptyParagraphBlock ],
			} );
		} );
		it( "renders the button with correct base classes", () => {
			render( <AddBlockButton { ...defaultProps } /> );

			const button = screen.getByRole( "button" );
			expect( button ).toBeInTheDocument();
			expect( button ).toHaveClass( "yoast-add-block-button" );
		} );

		it( "renders the PlusIcon component", () => {
			render( <AddBlockButton { ...defaultProps } /> );

			const icon = screen.getByTestId( "plus-icon" );
			expect( icon ).toBeInTheDocument();
			expect( icon ).toHaveClass( "yoast-add-block-button__icon" );
		} );

		it( "has correct initial aria-label", () => {
			render( <AddBlockButton { ...defaultProps } /> );

			const button = screen.getByRole( "button" );
			expect( button ).toHaveAttribute( "aria-label", "Add block" );
		} );
	} );

	describe( "Mouse interactions", () => {
		const emptyParagraphBlock = {
			clientId: "empty-block-id",
			name: "core/paragraph",
			attributes: { content: { text: "" } },
		};
		beforeEach( () => {
			useSelect.mockReturnValue( {
				blockInsertionPoint: { index: 1 },
				blocks: [ emptyParagraphBlock ],
			} );
		} );
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
		const nonEmptyParagraphBlock = {
			clientId: "non-empty-block-id",
			name: "core/paragraph",
			attributes: { content: { text: "This is a paragraph." } },
		};
		beforeEach( () => {
			useSelect.mockReturnValue( {
				blockInsertionPoint: { index: 1 },
				blocks: [ nonEmptyParagraphBlock ],
			} );
		} );
		it( "creates and inserts block when clicked without upsell badge", async() => {
			render( <AddBlockButton { ...defaultProps } /> );

			const button = screen.getByRole( "button" );
			fireEvent.click( button );

			// Button should show clicked state immediately
			expect( button ).toHaveClass( "yoast-add-block-button--clicked" );

			// Fast-forward the timeout
			jest.advanceTimersByTime( 300 );

			await waitFor( () => {
				expect( createBlock ).toHaveBeenCalledWith( "test/block" );
				expect( mockInsertBlock ).toHaveBeenCalledWith( { name: "test/block" }, 1 );
			} );
		} );

		it( "changes icon color when clicked", () => {
			render( <AddBlockButton { ...defaultProps } /> );

			const button = screen.getByRole( "button" );
			const icon = screen.getByTestId( "plus-icon" );

			fireEvent.click( button );

			expect( icon ).toHaveClass( "yoast-add-block-button__icon--clicked" );
		} );
	} );

	describe( "Upsell badge functionality", () => {
		const emptyParagraphBlock = {
			clientId: "empty-block-id",
			name: "core/paragraph",
			attributes: { content: { text: "" } },
		};
		beforeEach( () => {
			useSelect.mockReturnValue( {
				blockInsertionPoint: { index: 1 },
				blocks: [ emptyParagraphBlock ],
			} );
		} );
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

			expect( button ).not.toHaveClass( "yoast-add-block-button__icon--clicked" );
		} );
	} );

	describe( "Block insertion with empty paragraph replacement", () => {
		it( "replaces empty paragraph block when inserting at that position", async() => {
			const emptyParagraphBlock = {
				clientId: "empty-block-id",
				name: "core/paragraph",
				attributes: { content: { text: "" } },
			};

			useSelect.mockReturnValue( {
				blockInsertionPoint: { index: 1 },
				blocks: [ emptyParagraphBlock ],
			} );

			render( <AddBlockButton { ...defaultProps } /> );

			const button = screen.getByRole( "button" );
			fireEvent.click( button );

			jest.advanceTimersByTime( 300 );

			await waitFor( () => {
				expect( createBlock ).toHaveBeenCalledWith( "test/block" );
				expect( mockReplaceBlock ).toHaveBeenCalledWith( "empty-block-id", { name: "test/block" } );
				expect( mockInsertBlock ).not.toHaveBeenCalled();
			} );
		} );

		it( "inserts new block when block at position is not empty paragraph", async() => {
			const contentBlock = {
				clientId: "content-block-id",
				name: "core/paragraph",
				attributes: { content: { text: "Some content" } },
			};

			useSelect.mockReturnValue( {
				blockInsertionPoint: { index: 1 },
				blocks: [ contentBlock ],
			} );

			render( <AddBlockButton { ...defaultProps } /> );

			const button = screen.getByRole( "button" );
			fireEvent.click( button );

			jest.advanceTimersByTime( 300 );

			await waitFor( () => {
				expect( createBlock ).toHaveBeenCalledWith( "test/block" );
				expect( mockInsertBlock ).toHaveBeenCalledWith( { name: "test/block" }, 1 );
				expect( mockReplaceBlock ).not.toHaveBeenCalled();
			} );
		} );

		it( "inserts new block when block at position is different block type", async() => {
			const headingBlock = {
				clientId: "heading-block-id",
				name: "core/heading",
				attributes: { content: "" },
			};

			useSelect.mockReturnValue( {
				blockInsertionPoint: { index: 1 },
				blocks: [ headingBlock ],
			} );

			render( <AddBlockButton { ...defaultProps } /> );

			const button = screen.getByRole( "button" );
			fireEvent.click( button );

			jest.advanceTimersByTime( 300 );

			await waitFor( () => {
				expect( mockInsertBlock ).toHaveBeenCalledWith( { name: "test/block" }, 1 );
				expect( mockReplaceBlock ).not.toHaveBeenCalled();
			} );
		} );

		it( "inserts new block when no block exists at insertion point", async() => {
			useSelect.mockReturnValue( {
				blockInsertionPoint: { index: 2 },
				blocks: [ { name: "core/paragraph" } ],
			} );

			render( <AddBlockButton { ...defaultProps } /> );

			const button = screen.getByRole( "button" );
			fireEvent.click( button );

			jest.advanceTimersByTime( 300 );

			await waitFor( () => {
				expect( mockInsertBlock ).toHaveBeenCalledWith( { name: "test/block" }, 2 );
				expect( mockReplaceBlock ).not.toHaveBeenCalled();
			} );
		} );

		it( "handles paragraph block with undefined content", async() => {
			const paragraphWithUndefinedContent = {
				clientId: "undefined-content-block",
				name: "core/paragraph",
				attributes: { content: undefined },
			};

			useSelect.mockReturnValue( {
				blockInsertionPoint: { index: 1 },
				blocks: [ paragraphWithUndefinedContent ],
			} );

			render( <AddBlockButton { ...defaultProps } /> );

			const button = screen.getByRole( "button" );
			fireEvent.click( button );

			jest.advanceTimersByTime( 300 );

			await waitFor( () => {
				expect( mockInsertBlock ).toHaveBeenCalledWith( { name: "test/block" }, 1 );
				expect( mockReplaceBlock ).not.toHaveBeenCalled();
			} );
		} );

		it( "handles paragraph block with null content text", async() => {
			const paragraphWithNullText = {
				clientId: "null-text-block",
				name: "core/paragraph",
				attributes: { content: { text: null } },
			};

			useSelect.mockReturnValue( {
				blockInsertionPoint: { index: 1 },
				blocks: [ paragraphWithNullText ],
			} );

			render( <AddBlockButton { ...defaultProps } /> );

			const button = screen.getByRole( "button" );
			fireEvent.click( button );

			jest.advanceTimersByTime( 300 );

			await waitFor( () => {
				expect( mockInsertBlock ).toHaveBeenCalledWith( { name: "test/block" }, 1 );
				expect( mockReplaceBlock ).not.toHaveBeenCalled();
			} );
		} );
	} );
} );
