import reducer, { createInitialSelectionState, selectionActions, selectionSelectors } from "../../../src/bulk-editor/store/selection";

describe( "selection slice", () => {
	it( "defaults to no rows selected", () => {
		expect( createInitialSelectionState() ).toEqual( { selectedIds: [] } );
	} );

	it( "adds a row to the selection when toggled on", () => {
		const state = reducer( createInitialSelectionState(), selectionActions.toggleRow( 7 ) );

		expect( state.selectedIds ).toEqual( [ 7 ] );
	} );

	it( "removes a row from the selection when toggled off", () => {
		let state = reducer( createInitialSelectionState(), selectionActions.toggleRow( 7 ) );
		state = reducer( state, selectionActions.toggleRow( 9 ) );

		state = reducer( state, selectionActions.toggleRow( 7 ) );

		expect( state.selectedIds ).toEqual( [ 9 ] );
	} );

	it( "selects all given rows, replacing the current selection", () => {
		let state = reducer( createInitialSelectionState(), selectionActions.toggleRow( 1 ) );

		state = reducer( state, selectionActions.selectAll( [ 7, 9, 11 ] ) );

		expect( state.selectedIds ).toEqual( [ 7, 9, 11 ] );
	} );

	it( "clears the selection on deselectAll", () => {
		let state = reducer( createInitialSelectionState(), selectionActions.selectAll( [ 7, 9 ] ) );

		state = reducer( state, selectionActions.deselectAll() );

		expect( state.selectedIds ).toEqual( [] );
	} );

	it( "selects the selected ids, defaulting to empty when missing", () => {
		expect( selectionSelectors.selectSelectedIds( { selection: { selectedIds: [ 7 ] } } ) ).toEqual( [ 7 ] );
		expect( selectionSelectors.selectSelectedIds( {} ) ).toEqual( [] );
	} );
} );
