import { Fill, SlotFillProvider } from "@wordpress/components";
import { dispatch } from "@wordpress/data";
import { act, fireEvent, render, screen, waitFor } from "../test-utils";
import { BulkEditorContent, getSelectionView, getSmartSelectItems } from "../../src/bulk-editor/components/bulk-editor-content";
import { FIELD_SET_SEARCH, FIELD_SET_SOCIAL, PENDING_CHANGES_MODAL_SLOT, STORE_NAME } from "../../src/bulk-editor/constants";
import { DataProvider } from "../../src/bulk-editor/services";
import registerStore from "../../src/bulk-editor/store";

const dataProvider = new DataProvider( {
	contentTypes: [ { name: "post", label: "Posts", singularLabel: "Post" } ],
	endpoints: { posts: "https://example.com/wp-json/yoast/v1/bulk_editor/posts" },
	links: {},
} );
// The data layer is covered by use-posts.test.js; here the request stays pending so the table renders its
// loading state and the tabs (the unit under test) are unaffected by data.
const remoteDataProvider = { fetchJson: jest.fn( () => new Promise( () => {} ) ) };

// Reports the slot's fillProps into the DOM so the test can assert isOpen and trigger onCommit.
const SlotProbe = () => (
	<Fill name={ PENDING_CHANGES_MODAL_SLOT }>
		{ ( { isOpen, onCommit } ) => (
			<button type="button" data-testid="slot-probe" data-open={ String( isOpen ) } onClick={ onCommit }>
				commit
			</button>
		) }
	</Fill>
);

// Flips the external-pending flag and flushes the store subscription so the mounted component re-renders
// (and its onChangeTab closure updates) before the next interaction.
const setExternalPending = ( value ) => act( () => {
	dispatch( STORE_NAME ).setHasExternalPendingChanges( value );
} );

const renderContent = () => render(
	<SlotFillProvider>
		<BulkEditorContent
			dataProvider={ dataProvider }
			remoteDataProvider={ remoteDataProvider }
			contentType="post"
			contentTypeLabel="Posts"
			contentTypeSingularLabel="Post"
		/>
		<SlotProbe />
	</SlotFillProvider>
);

// The store registers once for the whole file: the WP data registry is global, so a second register would clash.
beforeAll( () => {
	registerStore();
} );

// The store lives in the global registry: reset the state each test touches so tests stay order-independent.
beforeEach( () => {
	dispatch( STORE_NAME ).setActiveFieldSet( FIELD_SET_SEARCH );
	dispatch( STORE_NAME ).setHasExternalPendingChanges( false );
	dispatch( STORE_NAME ).stopEdit();
	dispatch( STORE_NAME ).clearPendingSwitch();
	dispatch( STORE_NAME ).setSearch( "" );
	dispatch( STORE_NAME ).setStatuses( [] );
	dispatch( STORE_NAME ).setPage( 1 );
} );

/**
 * Asserts every bulk-actions band row (one per tab table) is expanded or collapsed, via the aria-hidden
 * that mirrors `showBulkActions`.
 *
 * @param {HTMLElement} container  The render container.
 * @param {boolean}     isExpanded Whether the band should be expanded.
 *
 * @returns {void}
 */
const expectBandExpanded = ( container, isExpanded ) => {
	const rows = Array.from( container.querySelectorAll( "tr[aria-hidden]" ) );
	expect( rows ).not.toHaveLength( 0 );
	rows.forEach( ( row ) => expect( row ).toHaveAttribute( "aria-hidden", String( ! isExpanded ) ) );
};

describe( "getSelectionView", () => {
	const items = [ { id: 1, editable: true }, { id: 2, editable: true }, { id: 3, editable: true } ];

	it( "presents a neutral selection while loading", () => {
		expect( getSelectionView( true, [ 1, 2 ], items, 3 ) ).toEqual( {
			isAllSelected: false,
			isIndeterminate: false,
			selectedCount: 0,
			totalCount: 0,
			hasSelection: false,
		} );
	} );

	it( "marks the checkbox as checked when every row is selected", () => {
		const view = getSelectionView( false, [ 1, 2, 3 ], items, 3 );

		expect( view.isAllSelected ).toBe( true );
		expect( view.isIndeterminate ).toBe( false );
		expect( view.hasSelection ).toBe( true );
	} );

	it( "marks the checkbox as indeterminate on a partial selection", () => {
		const view = getSelectionView( false, [ 1, 2 ], items, 3 );

		expect( view.isAllSelected ).toBe( false );
		expect( view.isIndeterminate ).toBe( true );
		expect( view.hasSelection ).toBe( true );
	} );

	it( "leaves the checkbox neutral when nothing is selected", () => {
		const view = getSelectionView( false, [], items, 3 );

		expect( view.isAllSelected ).toBe( false );
		expect( view.isIndeterminate ).toBe( false );
		expect( view.hasSelection ).toBe( false );
	} );

	it( "reports the selected and total counts", () => {
		const view = getSelectionView( false, [ 1, 2 ], items, 42 );

		expect( view.selectedCount ).toBe( 2 );
		expect( view.totalCount ).toBe( 42 );
	} );

	it( "treats only editable rows as selectable", () => {
		const mixed = [ { id: 1, editable: true }, { id: 2, editable: false }, { id: 3, editable: true } ];

		// Both editable rows are selected, so the master checkbox reads as fully selected even though a
		// locked row remains.
		const view = getSelectionView( false, [ 1, 3 ], mixed, 3 );

		expect( view.isAllSelected ).toBe( true );
		expect( view.isIndeterminate ).toBe( false );
	} );
} );

describe( "getSmartSelectItems", () => {
	/* eslint-disable camelcase -- the needs-improvement map is keyed by backend field params. */
	// id 3 is non-editable but needs improvement everywhere: it must never be selected.
	const searchItems = [
		{ id: 1, editable: true, needsImprovement: { seo_title: true, meta_description: false } },
		{ id: 2, editable: true, needsImprovement: { seo_title: false, meta_description: true } },
		{ id: 3, editable: false, needsImprovement: { seo_title: true, meta_description: true } },
	];
	// Both rows need improvement on the search fields, so a wrong social mapping would select both.
	const socialItems = [
		{ id: 10, editable: true, needsImprovement: { seo_title: true, meta_description: true, social_title: true, social_description: false } },
		{ id: 20, editable: true, needsImprovement: { seo_title: true, meta_description: true, social_title: false, social_description: true } },
	];
	/* eslint-enable camelcase -- the needs-improvement map is keyed by backend field params. */

	const build = ( activeFieldSet, items = [], isPending = false, selectAll = jest.fn() ) =>
		getSmartSelectItems( { activeFieldSet, items, isPending, selectAll } );

	it( "returns no items for an unknown tab", () => {
		expect( build( "unknown", searchItems ) ).toEqual( [] );
	} );

	it( "labels the items per tab", () => {
		const [ searchTitle, searchDescription ] = build( FIELD_SET_SEARCH );
		expect( searchTitle.label ).toBe( "SEO titles" );
		expect( searchDescription.label ).toBe( "Meta descriptions" );

		const [ socialTitle, socialDescription ] = build( FIELD_SET_SOCIAL );
		expect( socialTitle.label ).toBe( "Social titles" );
		expect( socialDescription.label ).toBe( "Social descriptions" );
	} );

	it( "selects only the editable rows whose SEO title needs improvement", () => {
		const selectAll = jest.fn();
		const [ title ] = build( FIELD_SET_SEARCH, searchItems, false, selectAll );

		title.onClick();

		// id 1 qualifies; id 2's title is fine; id 3 needs improvement but is not editable.
		expect( selectAll ).toHaveBeenCalledWith( [ 1 ] );
	} );

	it( "selects only the editable rows whose meta description needs improvement", () => {
		const selectAll = jest.fn();
		const [ , description ] = build( FIELD_SET_SEARCH, searchItems, false, selectAll );

		description.onClick();

		expect( selectAll ).toHaveBeenCalledWith( [ 2 ] );
	} );

	it( "does not select while the rows are still loading", () => {
		const selectAll = jest.fn();
		const [ title ] = build( FIELD_SET_SEARCH, searchItems, true, selectAll );

		title.onClick();

		expect( selectAll ).not.toHaveBeenCalled();
	} );

	it( "maps the Social tab items to the social fields, not the search fields", () => {
		const selectAll = jest.fn();
		const [ title, description ] = build( FIELD_SET_SOCIAL, socialItems, false, selectAll );

		title.onClick();
		expect( selectAll ).toHaveBeenLastCalledWith( [ 10 ] );

		description.onClick();
		expect( selectAll ).toHaveBeenLastCalledWith( [ 20 ] );
	} );
} );

describe( "BulkEditorContent tab-switch guard", () => {
	it( "switches immediately when nothing guards the switch", () => {
		renderContent();

		fireEvent.click( screen.getByRole( "tab", { name: "Social appearance" } ) );

		expect( screen.getByRole( "tab", { name: "Social appearance" } ) ).toHaveAttribute( "aria-selected", "true" );
		expect( screen.getByRole( "tab", { name: "Search appearance" } ) ).toHaveAttribute( "aria-selected", "false" );
	} );

	it( "defers the switch while an external plugin reports pending changes", () => {
		renderContent();
		setExternalPending( true );

		fireEvent.click( screen.getByRole( "tab", { name: "Social appearance" } ) );

		// The switch is held in pendingTab; the active tab does not change yet.
		expect( screen.getByRole( "tab", { name: "Search appearance" } ) ).toHaveAttribute( "aria-selected", "true" );
		expect( screen.getByRole( "tab", { name: "Social appearance" } ) ).toHaveAttribute( "aria-selected", "false" );
	} );

	it( "commits the deferred switch once the external flag clears (self-heal)", async() => {
		renderContent();
		setExternalPending( true );
		fireEvent.click( screen.getByRole( "tab", { name: "Social appearance" } ) );
		// The switch is still deferred at this point.
		expect( screen.getByRole( "tab", { name: "Search appearance" } ) ).toHaveAttribute( "aria-selected", "true" );

		setExternalPending( false );

		await waitFor( () =>
			expect( screen.getByRole( "tab", { name: "Social appearance" } ) ).toHaveAttribute( "aria-selected", "true" )
		);
	} );

	it( "opens the slot only while a switch is deferred, and onCommit completes it", async() => {
		renderContent();
		setExternalPending( true );

		// Closed until a switch is actually pending.
		expect( screen.getByTestId( "slot-probe" ) ).toHaveAttribute( "data-open", "false" );

		fireEvent.click( screen.getByRole( "tab", { name: "Social appearance" } ) );

		await waitFor( () => expect( screen.getByTestId( "slot-probe" ) ).toHaveAttribute( "data-open", "true" ) );

		// The add-on drives the commit via the slot's onCommit; the switch completes and the slot closes.
		fireEvent.click( screen.getByTestId( "slot-probe" ) );

		expect( screen.getByRole( "tab", { name: "Social appearance" } ) ).toHaveAttribute( "aria-selected", "true" );
		await waitFor( () => expect( screen.getByTestId( "slot-probe" ) ).toHaveAttribute( "data-open", "false" ) );
	} );
} );

describe( "BulkEditorContent pending changes across query changes", () => {
	it( "keeps the action band expanded across filter, search and page changes while an external plugin reports pending changes", () => {
		const { container } = renderContent();

		// Collapsed while nothing is pending or selected.
		expectBandExpanded( container, false );

		setExternalPending( true );
		expectBandExpanded( container, true );

		// A filter, search or page change resets the selection, but the pending suggestions must stay actionable.
		// The block bodies keep act() synchronous: the dispatch returns a promise, which a concise body would
		// hand to act and turn it into an unawaited async scope.
		act( () => {
			dispatch( STORE_NAME ).setStatuses( [ "draft" ] );
		} );
		expectBandExpanded( container, true );

		act( () => {
			dispatch( STORE_NAME ).setSearch( "seo" );
		} );
		expectBandExpanded( container, true );

		act( () => {
			dispatch( STORE_NAME ).setPage( 2 );
		} );
		expectBandExpanded( container, true );

		// A filter/search/page change is not a guarded view switch: the pending-changes slot stays closed.
		expect( screen.getByTestId( "slot-probe" ) ).toHaveAttribute( "data-open", "false" );
	} );

	it( "keeps pending manual edits and their action bar when a filter or search is applied", () => {
		const { container } = renderContent();

		act( () => {
			dispatch( STORE_NAME ).startEdit( { id: 1, draft: { seoTitle: "Draft title" } } );
		} );
		expectBandExpanded( container, true );

		act( () => {
			dispatch( STORE_NAME ).setStatuses( [ "draft" ] );
		} );
		act( () => {
			dispatch( STORE_NAME ).setSearch( "seo" );
		} );

		// The edit survives the query changes: the summary, the batch actions and the expanded band all remain.
		expect( screen.getByText( "1 row with unsaved changes" ) ).toBeInTheDocument();
		expect( screen.getByRole( "button", { name: "Save edits" } ) ).toBeInTheDocument();
		expect( screen.getByRole( "button", { name: "Cancel edits" } ) ).toBeInTheDocument();
		expectBandExpanded( container, true );

		// No unsaved-changes modal: filters never request a guarded switch.
		expect( screen.queryByRole( "dialog" ) ).not.toBeInTheDocument();
	} );
} );
