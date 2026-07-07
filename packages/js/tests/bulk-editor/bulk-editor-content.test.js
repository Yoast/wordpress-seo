import { Fill, SlotFillProvider } from "@wordpress/components";
import { dispatch } from "@wordpress/data";
import { act, fireEvent, render, screen, waitFor } from "../test-utils";
import { BulkEditorContent, getSelectionView } from "../../src/bulk-editor/components/bulk-editor-content";
import { FIELD_SET_SEARCH, PENDING_CHANGES_MODAL_SLOT, STORE_NAME } from "../../src/bulk-editor/constants";
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

describe( "getSelectionView", () => {
	const items = [ { id: 1 }, { id: 2 }, { id: 3 } ];

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
} );

describe( "BulkEditorContent tab-switch guard", () => {
	beforeAll( () => {
		registerStore();
	} );

	beforeEach( () => {
		// The store lives in the global registry: reset the guard state so tests stay order-independent.
		dispatch( STORE_NAME ).setActiveFieldSet( FIELD_SET_SEARCH );
		dispatch( STORE_NAME ).setHasExternalPendingChanges( false );
	} );

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
