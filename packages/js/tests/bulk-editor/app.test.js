import { dispatch } from "@wordpress/data";
import { act, fireEvent, render, screen, waitFor } from "../test-utils";
import App from "../../src/bulk-editor/app";
import { FIELD_SET_SEARCH, STORE_NAME } from "../../src/bulk-editor/constants";
import { getFieldSets } from "../../src/bulk-editor/field-sets";
import { DataProvider } from "../../src/bulk-editor/services";
import registerStore from "../../src/bulk-editor/store";


const dataProvider = new DataProvider( {
	contentTypes: [
		{ name: "page", label: "Pages" },
		{ name: "post", label: "Posts" },
	],
	endpoints: { posts: "https://example.com/wp-json/yoast/v1/bulk_editor/posts" },
	links: {},
} );
// The data layer is exercised by use-posts.test.js; here the request stays pending so the table
// renders its loading state and the assertions are unaffected by data.
const remoteDataProvider = { fetchJson: jest.fn( () => new Promise( () => {} ) ) };

// The rows the posts endpoint serves, in the API's snake_case shape (mapped by usePosts).
/* eslint-disable camelcase -- The REST endpoint returns snake_case keys. */
const postRows = [
	{ id: 1, title: "What Is SEO and How It Works", status: "publish", edit_link: "https://example.com/1", focus_keyphrase: "what is seo", seo_title: "What Is SEO? Complete Guide", meta_description: "Learn what SEO is.", social_title: "Social: What Is SEO", social_description: "Social description.", editable: true },
	{ id: 2, title: "Keyword Research for Beginners", status: "publish", edit_link: "https://example.com/2", focus_keyphrase: "keyword research", seo_title: "Keyword Research Guide", meta_description: "Find keywords.", social_title: "Social: Keyword Research", social_description: "Social description 2.", editable: true },
];
/* eslint-enable camelcase */

// A remote data provider that serves the posts list on GET and defers the save (POST) to `onSave`.
const buildRemote = ( onSave = () => Promise.resolve( {} ) ) => ( {
	// eslint-disable-next-line camelcase -- The REST endpoint returns snake_case keys.
	fetchJson: jest.fn( ( url, params, options ) => ( options?.method === "POST" ? onSave() : Promise.resolve( { posts: postRows, total: postRows.length, total_pages: 1 } ) ) ),
} );

describe( "App", () => {
	beforeAll( () => {
		registerStore();
	} );

	beforeEach( () => {
		// The store lives in the global registry: reset the view state so tests stay order-independent.
		dispatch( STORE_NAME ).setActiveFieldSet( FIELD_SET_SEARCH );
		dispatch( STORE_NAME ).setActiveContentType( "" );
		dispatch( STORE_NAME ).stopEdit();
		dispatch( STORE_NAME ).clearPendingSwitch();
		dispatch( STORE_NAME ).setHasExternalPendingChanges( false );
	} );

	it( "renders the header, tabs and panel in a single card with the header separator", () => {
		const { container } = render( <App dataProvider={ dataProvider } remoteDataProvider={ remoteDataProvider } /> );

		const papers = container.querySelectorAll( ".yst-paper" );
		expect( papers ).toHaveLength( 1 );
		expect( screen.getByRole( "main" ) ).toBe( papers[ 0 ] );
		expect( papers[ 0 ] ).toContainElement( screen.getByRole( "heading", { level: 1 } ) );
		expect( papers[ 0 ] ).toContainElement( screen.getByRole( "tablist", { name: "Bulk editor views" } ) );
		expect( papers[ 0 ] ).toContainElement( screen.getByRole( "tabpanel" ) );
		// The header carries the separator line between itself and the content.
		expect( screen.getByRole( "banner" ) ).toHaveClass( "yst-border-b" );
	} );

	it( "renders the page header for the first content type", () => {
		render( <App dataProvider={ dataProvider } remoteDataProvider={ remoteDataProvider } /> );

		expect( screen.getByRole( "heading", { level: 1, name: "Bulk editor: Pages" } ) ).toBeInTheDocument();
		expect(
			screen.getByText( "The bulk editor for pages is a tool that you can use to quickly make changes to your search and social media appearance for multiple pages." )
		).toBeInTheDocument();
	} );

	it( "renders the content type navigation with the first content type active", () => {
		render( <App dataProvider={ dataProvider } remoteDataProvider={ remoteDataProvider } /> );

		expect( screen.getByRole( "navigation", { name: "Bulk editor menu" } ) ).toBeInTheDocument();
		// If data provider has no links, the link falls back to the WP admin home.
		expect( screen.getByRole( "link", { name: "Back to Tools" } ) ).toHaveAttribute( "href", "/wp-admin/" );
		expect( screen.getByRole( "button", { name: "Pages" } ) ).toHaveAttribute( "aria-current", "page" );
	} );

	it( "drives the header copy from the selected content type", () => {
		render( <App dataProvider={ dataProvider } remoteDataProvider={ remoteDataProvider } /> );

		fireEvent.click( screen.getByRole( "button", { name: "Posts" } ) );

		expect( screen.getByRole( "button", { name: "Posts" } ) ).toHaveAttribute( "aria-current", "page" );
		expect( screen.getByRole( "heading", { level: 1, name: "Bulk editor: Posts" } ) ).toBeInTheDocument();
		expect(
			screen.getByText( "The bulk editor for posts is a tool that you can use to quickly make changes to your search and social media appearance for multiple posts." )
		).toBeInTheDocument();
	} );

	it( "renders the tabs with Search appearance active by default", () => {
		render( <App dataProvider={ dataProvider } remoteDataProvider={ remoteDataProvider } /> );

		expect( screen.getByRole( "tab", { name: "Search appearance" } ) ).toHaveAttribute( "aria-selected", "true" );
		// The panel holds the field-set table for the active tab.
		expect( screen.getByRole( "columnheader", { name: "SEO title" } ) ).toBeInTheDocument();
		expect( screen.getByRole( "columnheader", { name: "Meta description" } ) ).toBeInTheDocument();
	} );

	it( "switches the panel when the Social appearance tab is activated", () => {
		render( <App dataProvider={ dataProvider } remoteDataProvider={ remoteDataProvider } /> );

		fireEvent.click( screen.getByRole( "tab", { name: "Social appearance" } ) );

		expect( screen.getByRole( "tab", { name: "Social appearance" } ) ).toHaveAttribute( "aria-selected", "true" );
		expect( screen.getByRole( "columnheader", { name: "Social title" } ) ).toBeInTheDocument();
		expect( screen.getByRole( "columnheader", { name: "Social description" } ) ).toBeInTheDocument();
	} );

	describe( "switching tabs with unsaved edits", () => {
		const rowTitle = "What Is SEO and How It Works";

		// Opens an edit on the Search tab, then clicks the Social tab to trigger the guard.
		const openEditAndSwitch = async() => {
			fireEvent.click( await screen.findByRole( "button", { name: `Edit ${ rowTitle }` } ) );
			expect( screen.getByRole( "textbox", { name: `SEO title for ${ rowTitle }` } ) ).toBeInTheDocument();
			fireEvent.click( screen.getByRole( "tab", { name: "Social appearance" } ) );
		};

		it( "shows the confirmation modal and stays on the current tab", async() => {
			render( <App dataProvider={ dataProvider } remoteDataProvider={ buildRemote() } /> );

			await openEditAndSwitch();

			expect( screen.getByText( "Unsaved changes" ) ).toBeInTheDocument();
			// The tab has not switched while the modal is open.
			expect( screen.getByRole( "tab", { name: "Search appearance" } ) ).toHaveAttribute( "aria-selected", "true" );
			expect( screen.getByRole( "tab", { name: "Social appearance" } ) ).toHaveAttribute( "aria-selected", "false" );
		} );

		it( "keeps the edit and stays when Cancel is clicked", async() => {
			render( <App dataProvider={ dataProvider } remoteDataProvider={ buildRemote() } /> );

			await openEditAndSwitch();
			fireEvent.click( screen.getByRole( "button", { name: "Cancel" } ) );

			expect( screen.queryByText( "Unsaved changes" ) ).not.toBeInTheDocument();
			expect( screen.getByRole( "tab", { name: "Search appearance" } ) ).toHaveAttribute( "aria-selected", "true" );
			// The edit is preserved.
			expect( screen.getByRole( "textbox", { name: `SEO title for ${ rowTitle }` } ) ).toBeInTheDocument();
		} );

		it( "discards the edit and switches when Continue without saving is clicked", async() => {
			render( <App dataProvider={ dataProvider } remoteDataProvider={ buildRemote() } /> );

			await openEditAndSwitch();
			fireEvent.click( screen.getByRole( "button", { name: "Continue without saving" } ) );

			expect( screen.queryByText( "Unsaved changes" ) ).not.toBeInTheDocument();
			expect( screen.getByRole( "tab", { name: "Social appearance" } ) ).toHaveAttribute( "aria-selected", "true" );
			// Back on Search the row is no longer in edit mode.
			fireEvent.click( screen.getByRole( "tab", { name: "Search appearance" } ) );
			expect( screen.queryByRole( "textbox", { name: `SEO title for ${ rowTitle }` } ) ).not.toBeInTheDocument();
			expect( screen.getByRole( "button", { name: `Edit ${ rowTitle }` } ) ).toBeEnabled();
		} );

		it( "saves the edits and switches when Save changes is clicked", async() => {
			const searchSet = getFieldSets()[ FIELD_SET_SEARCH ];
			const endpointUrl = "https://example.com/wp-json/yoast/v1/bulk_editor/update_search";
			const savingDataProvider = new DataProvider( {
				contentTypes: [ { name: "post", label: "Posts" } ],
				endpoints: { posts: "https://example.com/wp-json/yoast/v1/bulk_editor/posts", [ searchSet.endpoint ]: endpointUrl },
				links: {},
			} );
			const remote = buildRemote( () => Promise.resolve( {} ) );
			render( <App dataProvider={ savingDataProvider } remoteDataProvider={ remote } /> );

			await openEditAndSwitch();
			fireEvent.click( screen.getByRole( "button", { name: "Save changes" } ) );

			// The open fields are posted to the active tab's save endpoint.
			expect( remote.fetchJson ).toHaveBeenCalledWith(
				endpointUrl,
				{},
				expect.objectContaining( { method: "POST" } )
			);
			// The batch save is async, so the modal closes once the request settles rather than synchronously.
			await waitFor( () => expect( screen.queryByText( "Unsaved changes" ) ).not.toBeInTheDocument() );
			await waitFor( () => expect( screen.getByRole( "tab", { name: "Social appearance" } ) ).toHaveAttribute( "aria-selected", "true" ) );
		} );
	} );

	it( "edits multiple rows at once without disabling the other rows' Edit", async() => {
		render( <App dataProvider={ dataProvider } remoteDataProvider={ buildRemote() } /> );

		fireEvent.click( await screen.findByRole( "button", { name: "Edit What Is SEO and How It Works" } ) );

		// Editing one row leaves another row's Edit enabled.
		const secondEdit = screen.getByRole( "button", { name: "Edit Keyword Research for Beginners" } );
		expect( secondEdit ).toBeEnabled();
		fireEvent.click( secondEdit );

		// Both rows are in edit mode simultaneously.
		expect( screen.getByRole( "textbox", { name: "SEO title for What Is SEO and How It Works" } ) ).toBeInTheDocument();
		expect( screen.getByRole( "textbox", { name: "SEO title for Keyword Research for Beginners" } ) ).toBeInTheDocument();
	} );

	describe( "saving a row (Save)", () => {
		const searchSet = getFieldSets()[ FIELD_SET_SEARCH ];
		const seoTitleParam = searchSet.fields.find( ( field ) => field.key === "seoTitle" ).param;
		const endpointUrl = "https://example.com/wp-json/yoast/v1/bulk_editor/update_search";
		const savingDataProvider = new DataProvider( {
			contentTypes: [ { name: "post", label: "Posts" } ],
			endpoints: { posts: "https://example.com/wp-json/yoast/v1/bulk_editor/posts", [ searchSet.endpoint ]: endpointUrl },
			links: {},
		} );
		const rowTitle = "What Is SEO and How It Works";

		it( "posts the edited field to the active tab's endpoint and collapses it on success", async() => {
			const remote = buildRemote( () => Promise.resolve( {} ) );
			render( <App dataProvider={ savingDataProvider } remoteDataProvider={ remote } /> );

			fireEvent.click( await screen.findByRole( "button", { name: `Edit ${ rowTitle }` } ) );
			fireEvent.change(
				screen.getByRole( "textbox", { name: `SEO title for ${ rowTitle }` } ),
				{ target: { value: "New SEO title" } }
			);
			fireEvent.click( screen.getByRole( "button", { name: `Save ${ rowTitle }` } ) );

			expect( remote.fetchJson ).toHaveBeenCalledWith(
				endpointUrl,
				{},
				{ method: "POST", body: JSON.stringify( { items: [ { id: 1, [ seoTitleParam ]: "New SEO title" } ] } ) }
			);
			// On success the field collapses/closes back to text.
			await waitFor( () => expect( screen.queryByRole( "textbox", { name: `SEO title for ${ rowTitle }` } ) ).not.toBeInTheDocument() );
		} );

		it( "keeps the field open and re-enables it when the save fails", async() => {
			const remote = buildRemote( () => Promise.reject( new Error( "save failed" ) ) );
			render( <App dataProvider={ savingDataProvider } remoteDataProvider={ remote } /> );

			fireEvent.click( await screen.findByRole( "button", { name: `Edit ${ rowTitle }` } ) );
			fireEvent.click( screen.getByRole( "button", { name: `Save ${ rowTitle }` } ) );

			// The field stays open and becomes editable again once the failed save settles.
			await waitFor( () => expect( screen.getByRole( "textbox", { name: `SEO title for ${ rowTitle }` } ) ).toBeEnabled() );
		} );

		it( "does not post to the save endpoint when it is unavailable", async() => {
			const remote = buildRemote();
			render( <App dataProvider={ dataProvider } remoteDataProvider={ remote } /> );

			fireEvent.click( await screen.findByRole( "button", { name: `Edit ${ rowTitle }` } ) );
			fireEvent.click( screen.getByRole( "button", { name: `Save ${ rowTitle }` } ) );

			// The active tab's save endpoint is not configured, so no POST is made and the field stays open.
			expect( remote.fetchJson ).not.toHaveBeenCalledWith(
				expect.anything(),
				expect.anything(),
				expect.objectContaining( { method: "POST" } )
			);
			expect( screen.getByRole( "textbox", { name: `SEO title for ${ rowTitle }` } ) ).toBeInTheDocument();
		} );
	} );

	describe( "switching content types with pending changes", () => {
		const rowTitle = "What Is SEO and How It Works";

		it( "shows the confirmation modal and stays on the content type when there are unsaved edits", async() => {
			render( <App dataProvider={ dataProvider } remoteDataProvider={ buildRemote() } /> );

			fireEvent.click( await screen.findByRole( "button", { name: `Edit ${ rowTitle }` } ) );
			expect( screen.getByRole( "textbox", { name: `SEO title for ${ rowTitle }` } ) ).toBeInTheDocument();
			fireEvent.click( screen.getByRole( "button", { name: "Posts" } ) );

			expect( screen.getByText( "Unsaved changes" ) ).toBeInTheDocument();
			// The content type has not switched while the modal is open.
			expect( screen.getByRole( "button", { name: "Pages" } ) ).toHaveAttribute( "aria-current", "page" );
			expect( screen.getByRole( "heading", { level: 1, name: "Bulk editor: Pages" } ) ).toBeInTheDocument();
		} );

		it( "defers the switch while an external plugin reports pending changes", async() => {
			render( <App dataProvider={ dataProvider } remoteDataProvider={ buildRemote() } /> );
			await screen.findByRole( "button", { name: `Edit ${ rowTitle }` } );

			await act( async() => {
				dispatch( STORE_NAME ).setHasExternalPendingChanges( true );
			} );
			fireEvent.click( screen.getByRole( "button", { name: "Posts" } ) );

			// The switch is held (Premium would fill the slot to resolve it); the content type does not change.
			expect( screen.getByRole( "button", { name: "Pages" } ) ).toHaveAttribute( "aria-current", "page" );
			expect( screen.getByRole( "heading", { level: 1, name: "Bulk editor: Pages" } ) ).toBeInTheDocument();
		} );

		it( "can switch back to the first content type after switching away with pending edits discarded", async() => {
			render( <App dataProvider={ dataProvider } remoteDataProvider={ buildRemote() } /> );

			// Edit on the first (resolved) content type while its stored name is still empty.
			fireEvent.click( await screen.findByRole( "button", { name: `Edit ${ rowTitle }` } ) );
			expect( screen.getByRole( "button", { name: "Pages" } ) ).toHaveAttribute( "aria-current", "page" );

			// Switch to Posts and discard the edit.
			fireEvent.click( screen.getByRole( "button", { name: "Posts" } ) );
			fireEvent.click( screen.getByRole( "button", { name: "Continue without saving" } ) );
			await waitFor( () => expect( screen.getByRole( "button", { name: "Posts" } ) ).toHaveAttribute( "aria-current", "page" ) );

			// Switching back to Pages must still work: the click handler reads the current active id, not a stale one.
			fireEvent.click( screen.getByRole( "button", { name: "Pages" } ) );
			await waitFor( () => expect( screen.getByRole( "button", { name: "Pages" } ) ).toHaveAttribute( "aria-current", "page" ) );
			expect( screen.getByRole( "heading", { level: 1, name: "Bulk editor: Pages" } ) ).toBeInTheDocument();
		} );

		it( "does not guard clicking the already-active first content type while the stored name is still empty", async() => {
			render( <App dataProvider={ dataProvider } remoteDataProvider={ buildRemote() } /> );

			// Enter edit mode so any spurious switch would be guarded by the modal.
			fireEvent.click( await screen.findByRole( "button", { name: `Edit ${ rowTitle }` } ) );
			expect( screen.getByRole( "textbox", { name: `SEO title for ${ rowTitle }` } ) ).toBeInTheDocument();

			// "Pages" is the resolved default while the stored active name is still "" (never switched).
			expect( screen.getByRole( "button", { name: "Pages" } ) ).toHaveAttribute( "aria-current", "page" );
			fireEvent.click( screen.getByRole( "button", { name: "Pages" } ) );

			// Clicking the content type you are already on is a no-op: no confirmation modal, the edit stays open.
			expect( screen.queryByText( "Unsaved changes" ) ).not.toBeInTheDocument();
			expect( screen.getByRole( "textbox", { name: `SEO title for ${ rowTitle }` } ) ).toBeInTheDocument();
		} );
	} );

	describe( "guarding hard-navigation paths", () => {
		const rowTitle = "What Is SEO and How It Works";
		const beforeUnloadCount = ( addSpy ) => addSpy.mock.calls.filter( ( [ type ] ) => type === "beforeunload" ).length;

		it( "attaches the native beforeunload guard only while there are unsaved changes", async() => {
			const addSpy = jest.spyOn( window, "addEventListener" );
			render( <App dataProvider={ dataProvider } remoteDataProvider={ buildRemote() } /> );
			await screen.findByRole( "button", { name: `Edit ${ rowTitle }` } );

			// Nothing pending: no beforeunload listener is attached.
			expect( beforeUnloadCount( addSpy ) ).toBe( 0 );

			await act( async() => {
				dispatch( STORE_NAME ).setHasExternalPendingChanges( true );
			} );
			// A pending change attaches the native unload guard for refresh/close/back.
			expect( beforeUnloadCount( addSpy ) ).toBeGreaterThan( 0 );

			addSpy.mockRestore();
		} );

		it( "guards the Back to Tools link with the unsaved-changes modal when there are edits", async() => {
			render( <App dataProvider={ dataProvider } remoteDataProvider={ buildRemote() } /> );

			fireEvent.click( await screen.findByRole( "button", { name: `Edit ${ rowTitle }` } ) );
			expect( screen.getByRole( "textbox", { name: `SEO title for ${ rowTitle }` } ) ).toBeInTheDocument();

			fireEvent.click( screen.getByRole( "link", { name: "Back to Tools" } ) );

			// The click is intercepted (no full page navigation) and the confirmation modal is shown instead.
			expect( screen.getByText( "Unsaved changes" ) ).toBeInTheDocument();
		} );
	} );
} );
