import { activeContentTypeActions } from "../../../src/bulk-editor/store/active-content-type";
import reducer, { createInitialQueryState, queryActions, querySelectors } from "../../../src/bulk-editor/store/query";

describe( "query slice", () => {
	it( "defaults to an empty search on the first page with no status, needs-improvement or overview filter", () => {
		expect( createInitialQueryState() ).toEqual( { search: "", page: 1, statuses: [], needsImprovement: [], overviewIds: [], isOverviewFilterActive: false } );
	} );

	it( "sets the search term and resets to the first page", () => {
		const state = reducer( { search: "", page: 4 }, queryActions.setSearch( "seo" ) );

		expect( state ).toEqual( { search: "seo", page: 1 } );
	} );

	it( "sets the page via setPage", () => {
		const state = reducer( { search: "seo", page: 1 }, queryActions.setPage( 3 ) );

		expect( state ).toEqual( { search: "seo", page: 3 } );
	} );

	it( "sets the status filter and resets to the first page", () => {
		const state = reducer( { search: "seo", page: 4, statuses: [] }, queryActions.setStatuses( [ "draft", "pending" ] ) );

		expect( state ).toEqual( { search: "seo", page: 1, statuses: [ "draft", "pending" ] } );
	} );

	it( "sets the needs-improvement filter and resets to the first page", () => {
		const state = reducer( { search: "seo", page: 4, needsImprovement: [] }, queryActions.setNeedsImprovement( [ "title", "description" ] ) );

		expect( state ).toEqual( { search: "seo", page: 1, needsImprovement: [ "title", "description" ] } );
	} );

	it( "resets to the first page and drops the overview selection when the content type changes", () => {
		const state = reducer(
			{ search: "seo", page: 9, overviewIds: [ 5, 3 ], isOverviewFilterActive: true },
			activeContentTypeActions.setActiveContentType( "page" )
		);

		expect( state ).toEqual( { search: "seo", page: 1, overviewIds: [], isOverviewFilterActive: false } );
	} );

	it( "toggles the overview filter and resets to the first page", () => {
		let state = reducer( { page: 4, overviewIds: [ 5, 3 ], isOverviewFilterActive: true }, queryActions.setOverviewFilterActive( false ) );
		expect( state ).toEqual( { page: 1, overviewIds: [ 5, 3 ], isOverviewFilterActive: false } );

		state = reducer( { ...state, page: 2 }, queryActions.setOverviewFilterActive( true ) );
		expect( state ).toEqual( { page: 1, overviewIds: [ 5, 3 ], isOverviewFilterActive: true } );
	} );

	it( "selects the overview selection state, defaulting when missing", () => {
		const state = { query: { overviewIds: [ 5, 3 ], isOverviewFilterActive: true } };

		expect( querySelectors.selectOverviewIds( state ) ).toEqual( [ 5, 3 ] );
		expect( querySelectors.selectIsOverviewFilterActive( state ) ).toBe( true );
		expect( querySelectors.selectOverviewIds( {} ) ).toEqual( [] );
		expect( querySelectors.selectIsOverviewFilterActive( {} ) ).toBe( false );
	} );

	it( "selects the search term, page, statuses, needs-improvement and query from the store state", () => {
		const state = { query: { search: "seo", page: 2, statuses: [ "draft" ], needsImprovement: [ "title" ] } };

		expect( querySelectors.selectSearch( state ) ).toBe( "seo" );
		expect( querySelectors.selectPage( state ) ).toBe( 2 );
		expect( querySelectors.selectStatuses( state ) ).toEqual( [ "draft" ] );
		expect( querySelectors.selectNeedsImprovement( state ) ).toEqual( [ "title" ] );
		expect( querySelectors.selectQuery( state ) ).toEqual( { search: "seo", page: 2, statuses: [ "draft" ], needsImprovement: [ "title" ] } );
	} );

	it( "falls back to defaults when the state is missing", () => {
		expect( querySelectors.selectSearch( {} ) ).toBe( "" );
		expect( querySelectors.selectPage( {} ) ).toBe( 1 );
		expect( querySelectors.selectStatuses( {} ) ).toEqual( [] );
		expect( querySelectors.selectNeedsImprovement( {} ) ).toEqual( [] );
		expect( querySelectors.selectQuery( {} ) ).toEqual( { search: "", page: 1, statuses: [], needsImprovement: [], overviewIds: [], isOverviewFilterActive: false } );
	} );
} );
