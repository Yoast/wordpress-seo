import { activeContentTypeActions } from "../../../src/bulk-editor/store/active-content-type";
import { activeFieldSetActions } from "../../../src/bulk-editor/store/active-field-set";
import reducer, { createInitialSelectionState, selectionActions, selectionSelectors } from "../../../src/bulk-editor/store/selection";
import { queryActions } from "../../../src/bulk-editor/store/query";

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

	it( "clears the selection when the status filter changes", () => {
		const state = reducer( { selectedIds: [ 7, 9 ] }, queryActions.setStatuses( [ "draft" ] ) );

		expect( state.selectedIds ).toEqual( [] );
	} );

	it( "clears the selection when the search changes", () => {
		const state = reducer( { selectedIds: [ 7, 9 ] }, queryActions.setSearch( "seo" ) );

		expect( state.selectedIds ).toEqual( [] );
	} );

	it( "clears the selection when the page changes", () => {
		const state = reducer( { selectedIds: [ 7, 9 ] }, queryActions.setPage( 2 ) );

		expect( state.selectedIds ).toEqual( [] );
	} );

	it( "clears the selection when the needs-improvement filter changes", () => {
		const state = reducer( { selectedIds: [ 7, 9 ] }, queryActions.setNeedsImprovement( [ "seo_title" ] ) );

		expect( state.selectedIds ).toEqual( [] );
	} );

	it( "clears the selection when the content type changes", () => {
		const state = reducer( { selectedIds: [ 7, 9 ] }, activeContentTypeActions.setActiveContentType( "page" ) );

		expect( state.selectedIds ).toEqual( [] );
	} );

	it( "clears the selection when the tab (field set) changes", () => {
		const state = reducer( { selectedIds: [ 7, 9 ] }, activeFieldSetActions.setActiveFieldSet( "social" ) );

		expect( state.selectedIds ).toEqual( [] );
	} );

	it( "selects the selected ids, defaulting to empty when missing", () => {
		expect( selectionSelectors.selectSelectedIds( { selection: { selectedIds: [ 7 ] } } ) ).toEqual( [ 7 ] );
		expect( selectionSelectors.selectSelectedIds( {} ) ).toEqual( [] );
	} );
} );
