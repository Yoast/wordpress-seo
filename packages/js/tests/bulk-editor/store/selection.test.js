import { activeContentTypeActions } from "../../../src/bulk-editor/store/active-content-type";
import { activeFieldSetActions } from "../../../src/bulk-editor/store/active-field-set";
import reducer, { createInitialSelectionState, selectionActions, selectionSelectors } from "../../../src/bulk-editor/store/selection";
import { queryActions } from "../../../src/bulk-editor/store/query";

describe( "selection slice", () => {
	it( "defaults to no rows selected, no carried-over selection and no exclusions", () => {
		expect( createInitialSelectionState() ).toEqual( { selectedIds: [], preselectedTotal: 0, hasExcludedPreselected: false } );
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

	it( "prunes selected ids missing from the given selectable ids, keeping the carried-over selection total and flagging the exclusion", () => {
		const state = reducer( { selectedIds: [ 7, 9, 11 ], preselectedTotal: 25 }, selectionActions.pruneSelection( [ 9, 11, 13 ] ) );

		expect( state ).toEqual( { selectedIds: [ 9, 11 ], preselectedTotal: 25, hasExcludedPreselected: true } );
	} );

	it( "keeps the selection intact and unflagged when all selected ids are selectable", () => {
		const state = reducer(
			{ selectedIds: [ 7, 9 ], preselectedTotal: 25, hasExcludedPreselected: false },
			selectionActions.pruneSelection( [ 7, 9, 11 ] )
		);

		expect( state ).toEqual( { selectedIds: [ 7, 9 ], preselectedTotal: 25, hasExcludedPreselected: false } );
	} );

	it( "clears the exclusion flag on dismissExclusionNotice, keeping the selection and the carried-over total", () => {
		const state = reducer(
			{ selectedIds: [ 9, 11 ], preselectedTotal: 25, hasExcludedPreselected: true },
			selectionActions.dismissExclusionNotice()
		);

		expect( state ).toEqual( { selectedIds: [ 9, 11 ], preselectedTotal: 25, hasExcludedPreselected: false } );
	} );

	it( "clears the exclusion flag on selectAll", () => {
		const state = reducer( { selectedIds: [ 9 ], preselectedTotal: 25, hasExcludedPreselected: true }, selectionActions.selectAll( [ 7, 9 ] ) );

		expect( state ).toEqual( { selectedIds: [ 7, 9 ], preselectedTotal: 0, hasExcludedPreselected: false } );
	} );

	it( "clears the exclusion flag when the shown result set changes", () => {
		const state = reducer( { selectedIds: [ 9 ], preselectedTotal: 25, hasExcludedPreselected: true }, queryActions.setPage( 2 ) );

		expect( state ).toEqual( createInitialSelectionState() );
	} );

	it( "selects the exclusion flag, defaulting to false when missing", () => {
		expect( selectionSelectors.selectHasExcludedPreselected( { selection: { hasExcludedPreselected: true } } ) ).toBe( true );
		expect( selectionSelectors.selectHasExcludedPreselected( {} ) ).toBe( false );
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

	it( "clears the carried-over selection total on dismissPreselectionNotice", () => {
		const state = reducer( { selectedIds: [ 7, 9 ], preselectedTotal: 25 }, selectionActions.dismissPreselectionNotice() );

		expect( state ).toEqual( { selectedIds: [ 7, 9 ], preselectedTotal: 0 } );
	} );

	it( "clears the carried-over selection total on selectAll", () => {
		const state = reducer( { selectedIds: [ 7 ], preselectedTotal: 25 }, selectionActions.selectAll( [ 7, 9 ] ) );

		expect( state ).toEqual( { selectedIds: [ 7, 9 ], preselectedTotal: 0, hasExcludedPreselected: false } );
	} );

	it( "clears the carried-over selection total on deselectAll", () => {
		const state = reducer( { selectedIds: [ 7 ], preselectedTotal: 25 }, selectionActions.deselectAll() );

		expect( state ).toEqual( createInitialSelectionState() );
	} );

	it( "keeps the carried-over selection total when a single row is toggled", () => {
		const state = reducer( { selectedIds: [ 7 ], preselectedTotal: 25 }, selectionActions.toggleRow( 9 ) );

		expect( state ).toEqual( { selectedIds: [ 7, 9 ], preselectedTotal: 25 } );
	} );

	it( "clears the carried-over selection total when the shown result set changes", () => {
		const state = reducer( { selectedIds: [ 7, 9 ], preselectedTotal: 25 }, queryActions.setPage( 2 ) );

		expect( state ).toEqual( createInitialSelectionState() );
	} );

	it( "clears the selection when the overview filter is toggled", () => {
		const state = reducer( { selectedIds: [ 7, 9 ], preselectedTotal: 25 }, queryActions.setOverviewFilterActive( false ) );

		expect( state ).toEqual( createInitialSelectionState() );
	} );

	it( "selects the carried-over selection total, defaulting to 0 when missing", () => {
		expect( selectionSelectors.selectPreselectedTotal( { selection: { preselectedTotal: 25 } } ) ).toBe( 25 );
		expect( selectionSelectors.selectPreselectedTotal( {} ) ).toBe( 0 );
	} );
} );
