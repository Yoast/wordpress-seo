import { renderHook, act } from "@testing-library/react";
import { useSelect } from "@wordpress/data";
import { useDraggableStructure } from "../../../src/ai-content-planner/hooks/use-draggable-structure";

jest.mock( "@wordpress/data", () => ( {
	useSelect: jest.fn(),
} ) );

const mockOutline = [
	// eslint-disable-next-line camelcase
	{ subheading_text: "Introduction" },
	// eslint-disable-next-line camelcase
	{ subheading_text: "Body" },
	// eslint-disable-next-line camelcase
	{ subheading_text: "Conclusion" },
];

/**
 * Creates a mock drag event with the given overrides.
 *
 * @param {Object} overrides Properties to merge into the mock event.
 * @returns {Object} Mock event object.
 */
const mockEvent = ( overrides = {} ) => ( {
	preventDefault: jest.fn(),
	dataTransfer: { effectAllowed: "", dropEffect: "" },
	...overrides,
} );

/**
 * Sets up useSelect to return the given outline.
 *
 * @param {Array|null} outline The outline to return.
 */
const setupUseSelect = ( outline ) => {
	useSelect.mockImplementation( ( selector ) => selector( ( storeName ) => {
		if ( storeName === "yoast-seo/content-planner" ) {
			return { selectContentOutline: () => outline };
		}
	} ) );
};

describe( "useDraggableStructure", () => {
	beforeEach( () => {
		setupUseSelect( mockOutline );
	} );

	describe( "initial state", () => {
		it( "builds structure from the outline with stable ids", () => {
			const { result } = renderHook( () => useDraggableStructure() );
			expect( result.current.structure ).toEqual( [
				{ id: "0-H2-Introduction", title: "Introduction" },
				{ id: "1-H2-Body", title: "Body" },
				{ id: "2-H2-Conclusion", title: "Conclusion" },
			] );
		} );

		it( "handles a null outline by producing an empty structure", () => {
			setupUseSelect( null );
			const { result } = renderHook( () => useDraggableStructure() );
			expect( result.current.structure ).toEqual( [] );
		} );

		it( "initialises dragOverIndex to null", () => {
			const { result } = renderHook( () => useDraggableStructure() );
			expect( result.current.dragOverIndex ).toBeNull();
		} );

		it( "returns all expected handler functions", () => {
			const { result } = renderHook( () => useDraggableStructure() );
			expect( typeof result.current.handleDragStart ).toBe( "function" );
			expect( typeof result.current.handleDragOver ).toBe( "function" );
			expect( typeof result.current.handleDrop ).toBe( "function" );
			expect( typeof result.current.handleDragEnd ).toBe( "function" );
			expect( typeof result.current.handleMoveUp ).toBe( "function" );
			expect( typeof result.current.handleMoveDown ).toBe( "function" );
		} );
	} );

	describe( "outline effect", () => {
		it( "resets structure when the outline changes", () => {
			const { result, rerender } = renderHook( () => useDraggableStructure() );
			expect( result.current.structure ).toHaveLength( 3 );

			// eslint-disable-next-line camelcase
			const newOutline = [ { subheading_text: "Only section" } ];
			setupUseSelect( newOutline );

			act( () => {
				rerender();
			} );

			expect( result.current.structure ).toEqual( [
				{ id: "0-H2-Only section", title: "Only section" },
			] );
		} );
	} );

	describe( "handleDragStart", () => {
		it( "sets effectAllowed to 'move' on the dataTransfer object", () => {
			const { result } = renderHook( () => useDraggableStructure() );
			const e = mockEvent();
			act( () => {
				result.current.handleDragStart( e, 0 );
			} );
			expect( e.dataTransfer.effectAllowed ).toBe( "move" );
		} );
	} );

	describe( "handleDragOver", () => {
		it( "calls preventDefault on the event", () => {
			const { result } = renderHook( () => useDraggableStructure() );
			const e = mockEvent();
			act( () => {
				result.current.handleDragOver( e, 1 );
			} );
			expect( e.preventDefault ).toHaveBeenCalledTimes( 1 );
		} );

		it( "sets dropEffect to 'move' on the dataTransfer object", () => {
			const { result } = renderHook( () => useDraggableStructure() );
			const e = mockEvent();
			act( () => {
				result.current.handleDragOver( e, 1 );
			} );
			expect( e.dataTransfer.dropEffect ).toBe( "move" );
		} );

		it( "updates dragOverIndex to the hovered index", () => {
			const { result } = renderHook( () => useDraggableStructure() );
			act( () => {
				result.current.handleDragOver( mockEvent(), 2 );
			} );
			expect( result.current.dragOverIndex ).toBe( 2 );
		} );
	} );

	describe( "handleDrop", () => {
		it( "reorders structure when dragging forward (dragIndex < dropIndex)", () => {
			const { result } = renderHook( () => useDraggableStructure() );

			act( () => {
				result.current.handleDragStart( mockEvent(), 0 );
			} );
			act( () => {
				result.current.handleDrop( mockEvent(), 2 );
			} );

			// Dragging index 0 to position 2: dest = 2-1 = 1
			// [Introduction, Body, Conclusion] → [Body, Introduction, Conclusion]
			expect( result.current.structure.map( ( i ) => i.title ) ).toEqual( [
				"Body",
				"Introduction",
				"Conclusion",
			] );
		} );

		it( "reorders structure when dragging backward (dragIndex > dropIndex)", () => {
			const { result } = renderHook( () => useDraggableStructure() );

			act( () => {
				result.current.handleDragStart( mockEvent(), 2 );
			} );
			act( () => {
				result.current.handleDrop( mockEvent(), 0 );
			} );

			// Dragging index 2 to position 0: dest = 0 (dragIndex > dropIndex)
			// [Introduction, Body, Conclusion] → [Conclusion, Introduction, Body]
			expect( result.current.structure.map( ( i ) => i.title ) ).toEqual( [
				"Conclusion",
				"Introduction",
				"Body",
			] );
		} );

		it( "does not reorder when dropping onto the same index", () => {
			const { result } = renderHook( () => useDraggableStructure() );
			const originalTitles = result.current.structure.map( ( i ) => i.title );

			act( () => {
				result.current.handleDragStart( mockEvent(), 1 );
			} );
			act( () => {
				result.current.handleDrop( mockEvent(), 1 );
			} );

			expect( result.current.structure.map( ( i ) => i.title ) ).toEqual( originalTitles );
		} );

		it( "resets dragOverIndex to null after a successful drop", () => {
			const { result } = renderHook( () => useDraggableStructure() );

			act( () => {
				result.current.handleDragStart( mockEvent(), 0 );
				result.current.handleDragOver( mockEvent(), 1 );
			} );
			act( () => {
				result.current.handleDrop( mockEvent(), 1 );
			} );

			expect( result.current.dragOverIndex ).toBeNull();
		} );

		it( "resets dragOverIndex to null when drop is a no-op (same index)", () => {
			const { result } = renderHook( () => useDraggableStructure() );

			act( () => {
				result.current.handleDragStart( mockEvent(), 0 );
				result.current.handleDragOver( mockEvent(), 0 );
			} );
			act( () => {
				result.current.handleDrop( mockEvent(), 0 );
			} );

			expect( result.current.dragOverIndex ).toBeNull();
		} );

		it( "calls preventDefault on the event", () => {
			const { result } = renderHook( () => useDraggableStructure() );
			const e = mockEvent();
			act( () => {
				result.current.handleDragStart( mockEvent(), 0 );
			} );
			act( () => {
				result.current.handleDrop( e, 1 );
			} );
			expect( e.preventDefault ).toHaveBeenCalledTimes( 1 );
		} );
	} );

	describe( "handleDragEnd", () => {
		it( "resets dragOverIndex to null", () => {
			const { result } = renderHook( () => useDraggableStructure() );

			act( () => {
				result.current.handleDragOver( mockEvent(), 1 );
			} );
			expect( result.current.dragOverIndex ).toBe( 1 );

			act( () => {
				result.current.handleDragEnd();
			} );
			expect( result.current.dragOverIndex ).toBeNull();
		} );
	} );

	describe( "handleMoveUp", () => {
		it( "swaps the item at the given index with the one above it", () => {
			const { result } = renderHook( () => useDraggableStructure() );

			act( () => {
				result.current.handleMoveUp( 1 );
			} );

			expect( result.current.structure.map( ( i ) => i.title ) ).toEqual( [
				"Body",
				"Introduction",
				"Conclusion",
			] );
		} );

		it( "moves the last item to the second-to-last position", () => {
			const { result } = renderHook( () => useDraggableStructure() );

			act( () => {
				result.current.handleMoveUp( 2 );
			} );

			expect( result.current.structure.map( ( i ) => i.title ) ).toEqual( [
				"Introduction",
				"Conclusion",
				"Body",
			] );
		} );
	} );

	describe( "handleMoveDown", () => {
		it( "swaps the item at the given index with the one below it", () => {
			const { result } = renderHook( () => useDraggableStructure() );

			act( () => {
				result.current.handleMoveDown( 0 );
			} );

			expect( result.current.structure.map( ( i ) => i.title ) ).toEqual( [
				"Body",
				"Introduction",
				"Conclusion",
			] );
		} );

		it( "moves the first item to the second position", () => {
			const { result } = renderHook( () => useDraggableStructure() );

			act( () => {
				result.current.handleMoveDown( 1 );
			} );

			expect( result.current.structure.map( ( i ) => i.title ) ).toEqual( [
				"Introduction",
				"Conclusion",
				"Body",
			] );
		} );
	} );
} );
