import { render, screen, fireEvent } from "@testing-library/react";
import { StructureRow } from "../../../src/ai-content-planner/components/structure-row";

const defaultProps = {
	heading: "Introduction",
	index: 1,
	dragOverIndex: null,
	onDragStart: jest.fn(),
	onDragOver: jest.fn(),
	onDrop: jest.fn(),
	onDragEnd: jest.fn(),
	onMoveUp: jest.fn(),
	onMoveDown: jest.fn(),
	totalItems: 4,
};

const renderRow = ( props = {} ) => render(
	<StructureRow { ...defaultProps } { ...props } />
);

describe( "StructureRow", () => {
	beforeEach( () => {
		jest.clearAllMocks();
	} );

	describe( "rendering", () => {
		it( "renders the heading text", () => {
			renderRow();
			expect( screen.getByText( "Introduction" ) ).toBeInTheDocument();
		} );

		it( "renders the H2 prefix label", () => {
			renderRow();
			expect( screen.getByText( "H2" ) ).toBeInTheDocument();
		} );

		it( "renders the row as an option with an accessible label", () => {
			renderRow();
			expect( screen.getByRole( "option", { name: "H2 Introduction" } ) ).toBeInTheDocument();
		} );
	} );

	describe( "drag-over highlight", () => {
		it( "applies the highlighted border class when dragOverIndex matches the row index", () => {
			renderRow( { index: 2, dragOverIndex: 2 } );
			expect( screen.getByRole( "option" ) ).toHaveClass( "yst-border-primary-500" );
		} );

		it( "does not apply the highlighted border class when dragOverIndex differs from the row index", () => {
			renderRow( { index: 1, dragOverIndex: 3 } );
			expect( screen.getByRole( "option" ) ).not.toHaveClass( "yst-border-primary-500" );
		} );

		it( "does not apply the highlighted border class when dragOverIndex is null", () => {
			renderRow( { dragOverIndex: null } );
			expect( screen.getByRole( "option" ) ).not.toHaveClass( "yst-border-primary-500" );
		} );
	} );

	describe( "drag events", () => {
		it( "calls onDragStart with the event and index when drag starts", () => {
			const onDragStart = jest.fn();
			renderRow( { onDragStart } );
			fireEvent.dragStart( screen.getByRole( "option" ) );
			expect( onDragStart ).toHaveBeenCalledTimes( 1 );
			expect( onDragStart ).toHaveBeenCalledWith( expect.anything(), defaultProps.index );
		} );

		it( "calls onDragOver with the event and index when dragged over", () => {
			const onDragOver = jest.fn();
			renderRow( { onDragOver } );
			fireEvent.dragOver( screen.getByRole( "option" ) );
			expect( onDragOver ).toHaveBeenCalledTimes( 1 );
			expect( onDragOver ).toHaveBeenCalledWith( expect.anything(), defaultProps.index );
		} );

		it( "calls onDrop with the event and index when dropped", () => {
			const onDrop = jest.fn();
			renderRow( { onDrop } );
			fireEvent.drop( screen.getByRole( "option" ) );
			expect( onDrop ).toHaveBeenCalledTimes( 1 );
			expect( onDrop ).toHaveBeenCalledWith( expect.anything(), defaultProps.index );
		} );

		it( "calls onDragEnd when drag ends", () => {
			const onDragEnd = jest.fn();
			renderRow( { onDragEnd } );
			fireEvent.dragEnd( screen.getByRole( "option" ) );
			expect( onDragEnd ).toHaveBeenCalledTimes( 1 );
		} );
	} );

	describe( "keyboard reordering", () => {
		it( "calls onMoveUp with the index when Alt+ArrowUp is pressed and index > 0", () => {
			const onMoveUp = jest.fn();
			renderRow( { onMoveUp, index: 1 } );
			fireEvent.keyDown( screen.getByRole( "option" ), { key: "ArrowUp", altKey: true } );
			expect( onMoveUp ).toHaveBeenCalledWith( 1 );
		} );

		it( "does not call onMoveUp when Alt+ArrowUp is pressed and index is 0", () => {
			const onMoveUp = jest.fn();
			renderRow( { onMoveUp, index: 0 } );
			fireEvent.keyDown( screen.getByRole( "option" ), { key: "ArrowUp", altKey: true } );
			expect( onMoveUp ).not.toHaveBeenCalled();
		} );

		it( "calls onMoveDown with the index when Alt+ArrowDown is pressed and index < totalItems - 1", () => {
			const onMoveDown = jest.fn();
			renderRow( { onMoveDown, index: 1, totalItems: 4 } );
			fireEvent.keyDown( screen.getByRole( "option" ), { key: "ArrowDown", altKey: true } );
			expect( onMoveDown ).toHaveBeenCalledWith( 1 );
		} );

		it( "does not call onMoveDown when Alt+ArrowDown is pressed and index is the last item", () => {
			const onMoveDown = jest.fn();
			renderRow( { onMoveDown, index: 3, totalItems: 4 } );
			fireEvent.keyDown( screen.getByRole( "option" ), { key: "ArrowDown", altKey: true } );
			expect( onMoveDown ).not.toHaveBeenCalled();
		} );

		it( "ignores ArrowUp without the Alt modifier", () => {
			const onMoveUp = jest.fn();
			renderRow( { onMoveUp, index: 1 } );
			fireEvent.keyDown( screen.getByRole( "option" ), { key: "ArrowUp", altKey: false } );
			expect( onMoveUp ).not.toHaveBeenCalled();
		} );

		it( "ignores ArrowDown without the Alt modifier", () => {
			const onMoveDown = jest.fn();
			renderRow( { onMoveDown, index: 1 } );
			fireEvent.keyDown( screen.getByRole( "option" ), { key: "ArrowDown", altKey: false } );
			expect( onMoveDown ).not.toHaveBeenCalled();
		} );
	} );
} );
