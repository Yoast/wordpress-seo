import { act, renderHook } from "@testing-library/react";
import { useDispatch, useSelect } from "@wordpress/data";
import { useInlineEdit } from "../../../src/bulk-editor/hooks/use-inline-edit";
import { getFieldSets } from "../../../src/bulk-editor/field-sets";
import { FIELD_SET_SEARCH } from "../../../src/bulk-editor/constants";

jest.mock( "@wordpress/data", () => ( { useSelect: jest.fn(), useDispatch: jest.fn() } ) );

describe( "useInlineEdit batch actions", () => {
	const fieldSets = getFieldSets();
	let editingRows;
	let dispatch;
	let dataProvider;
	let updateItem;

	beforeEach( () => {
		// Two rows editing search-appearance fields: row 7 has two open fields, row 9 has one.
		editingRows = {
			7: { openFields: [ "seoTitle", "metaDescription" ], draft: { seoTitle: "Title 7", metaDescription: "Desc 7" }, savingFields: {} },
			9: { openFields: [ "seoTitle" ], draft: { seoTitle: "Title 9" }, savingFields: {} },
		};
		dispatch = {
			startEdit: jest.fn(),
			updateDraftField: jest.fn(),
			setSavingField: jest.fn(),
			closeField: jest.fn(),
			discardEdit: jest.fn(),
			stopEdit: jest.fn(),
		};
		dataProvider = { getEndpoint: jest.fn( ( key ) => `https://example.com/${ key }` ) };
		updateItem = jest.fn();

		useSelect.mockImplementation( ( mapSelect ) => mapSelect( () => ( { selectEditingRows: () => editingRows } ) ) );
		useDispatch.mockReturnValue( dispatch );
	} );

	const renderEdit = ( remoteDataProvider ) => renderHook( () => useInlineEdit( {
		dataProvider,
		remoteDataProvider,
		fieldSets,
		activeFieldSet: FIELD_SET_SEARCH,
		items: [],
		updateItem,
	} ) );

	it( "batches every row's open drafts into one request per endpoint", async() => {
		const remoteDataProvider = { fetchJson: jest.fn( () => Promise.resolve( {} ) ) };
		const { result } = renderEdit( remoteDataProvider );

		await act( async() => {
			await result.current.editing.onApplyAll();
		} );

		// One request to the search endpoint, carrying one combined item per row.
		expect( remoteDataProvider.fetchJson ).toHaveBeenCalledTimes( 1 );
		const [ endpoint, , options ] = remoteDataProvider.fetchJson.mock.calls[ 0 ];
		expect( endpoint ).toBe( "https://example.com/update_search" );
		expect( JSON.parse( options.body ) ).toEqual( {
			/* eslint-disable camelcase -- The REST endpoint expects snake_case parameters. */
			items: [
				{ id: 7, seo_title: "Title 7", meta_description: "Desc 7" },
				{ id: 9, seo_title: "Title 9" },
			],
			/* eslint-enable camelcase -- The REST endpoint expects snake_case parameters. */
		} );
	} );

	it( "chunks a large batch to the server's item limit, one request per 20 rows", async() => {
		// Editing rows accumulate across pages, so a batch can exceed the 20-item server limit; 21 rows on one
		// endpoint must go out as two requests (20 + 1) rather than one oversized POST that would be rejected.
		editingRows = Object.fromEntries( Array.from( { length: 21 }, ( _row, index ) => {
			const id = index + 1;
			return [ id, { openFields: [ "seoTitle" ], draft: { seoTitle: `Title ${ id }` }, savingFields: {} } ];
		} ) );
		const remoteDataProvider = { fetchJson: jest.fn( () => Promise.resolve( {} ) ) };
		const { result } = renderEdit( remoteDataProvider );

		await act( async() => {
			await result.current.editing.onApplyAll();
		} );

		expect( remoteDataProvider.fetchJson ).toHaveBeenCalledTimes( 2 );
		const itemCounts = remoteDataProvider.fetchJson.mock.calls.map( ( call ) => JSON.parse( call[ 2 ].body ).items.length );
		expect( itemCounts ).toEqual( [ 20, 1 ] );
	} );

	it( "reflects every saved field and closes it after applying all", async() => {
		const remoteDataProvider = { fetchJson: jest.fn( () => Promise.resolve( {} ) ) };
		const { result } = renderEdit( remoteDataProvider );

		await act( async() => {
			await result.current.editing.onApplyAll();
		} );

		// Each saved field is reflected on its row and then closed; a row leaves edit mode once its fields all close.
		expect( updateItem ).toHaveBeenCalledWith( 7, "seoTitle", "Title 7" );
		expect( updateItem ).toHaveBeenCalledWith( 7, "metaDescription", "Desc 7" );
		expect( updateItem ).toHaveBeenCalledWith( 9, "seoTitle", "Title 9" );
		expect( dispatch.closeField ).toHaveBeenCalledWith( { id: 7, key: "seoTitle" } );
		expect( dispatch.closeField ).toHaveBeenCalledWith( { id: 7, key: "metaDescription" } );
		expect( dispatch.closeField ).toHaveBeenCalledWith( { id: 9, key: "seoTitle" } );
		expect( result.current.editing.hasSaveError ).toBe( false );
	} );

	it( "keeps the drafts and flags an error when the whole batch fails", async() => {
		const remoteDataProvider = { fetchJson: jest.fn( () => Promise.reject( new Error( "boom" ) ) ) };
		const { result } = renderEdit( remoteDataProvider );

		await act( async() => {
			await result.current.editing.onApplyAll();
		} );

		// Nothing reflected or closed, drafts stay open, and the save-error flag is raised for the inline notice.
		expect( updateItem ).not.toHaveBeenCalled();
		expect( dispatch.closeField ).not.toHaveBeenCalled();
		expect( result.current.editing.hasSaveError ).toBe( true );
	} );

	it( "flags a save error when a single per-row field save fails", async() => {
		const remoteDataProvider = { fetchJson: jest.fn( () => Promise.reject( new Error( "boom" ) ) ) };
		const { result } = renderEdit( remoteDataProvider );

		await act( async() => {
			await result.current.editing.onApplyField( { id: 7, key: "seoTitle" } );
		} );

		// A row's own Save must surface the same notice as the batch Save edits, not fail silently.
		expect( result.current.editing.hasSaveError ).toBe( true );
	} );

	it( "reflects the succeeded chunk and keeps the failed one open on a partial failure", async() => {
		// 21 rows on one endpoint → two chunks (20 + 1). The first chunk resolves, the second rejects.
		editingRows = Object.fromEntries( Array.from( { length: 21 }, ( _row, index ) => {
			const id = index + 1;
			return [ id, { openFields: [ "seoTitle" ], draft: { seoTitle: `Title ${ id }` }, savingFields: {} } ];
		} ) );
		const remoteDataProvider = {
			fetchJson: jest.fn()
				.mockImplementationOnce( () => Promise.resolve( {} ) )
				.mockImplementationOnce( () => Promise.reject( new Error( "boom" ) ) ),
		};
		const { result } = renderEdit( remoteDataProvider );

		await act( async() => {
			await result.current.editing.onApplyAll();
		} );

		// The 20 rows in the succeeded chunk are reflected and closed; the 21st (failed chunk) is not.
		expect( dispatch.closeField ).toHaveBeenCalledTimes( 20 );
		expect( dispatch.closeField ).toHaveBeenCalledWith( { id: 1, key: "seoTitle" } );
		expect( dispatch.closeField ).not.toHaveBeenCalledWith( { id: 21, key: "seoTitle" } );
		expect( result.current.editing.hasSaveError ).toBe( true );
	} );

	it( "dismisses the save error", async() => {
		const remoteDataProvider = { fetchJson: jest.fn( () => Promise.reject( new Error( "boom" ) ) ) };
		const { result } = renderEdit( remoteDataProvider );

		await act( async() => {
			await result.current.editing.onApplyAll();
		} );
		expect( result.current.editing.hasSaveError ).toBe( true );

		act( () => result.current.editing.dismissSaveError() );
		expect( result.current.editing.hasSaveError ).toBe( false );
	} );

	it( "discards all edits by leaving edit mode without saving", () => {
		const remoteDataProvider = { fetchJson: jest.fn() };
		const { result } = renderEdit( remoteDataProvider );

		result.current.editing.onDiscardAll();

		expect( dispatch.stopEdit ).toHaveBeenCalledTimes( 1 );
		expect( remoteDataProvider.fetchJson ).not.toHaveBeenCalled();
	} );

	it( "clears a lingering save error once edit mode is fully exited", async() => {
		const remoteDataProvider = { fetchJson: jest.fn( () => Promise.reject( new Error( "boom" ) ) ) };
		const { result, rerender } = renderEdit( remoteDataProvider );

		await act( async() => {
			await result.current.editing.onApplyAll();
		} );
		expect( result.current.editing.hasSaveError ).toBe( true );

		// Any exit path empties the editing rows; the error must not linger into the next edit session.
		editingRows = {};
		act( () => rerender() );

		expect( result.current.editing.hasSaveError ).toBe( false );
	} );

	it( "reports success or failure through its return value", async() => {
		const okProvider = { fetchJson: jest.fn( () => Promise.resolve( {} ) ) };
		const { result: okResult } = renderEdit( okProvider );
		let outcome;
		await act( async() => {
			outcome = await okResult.current.editing.onApplyAll();
		} );
		expect( outcome ).toBe( true );

		const failProvider = { fetchJson: jest.fn( () => Promise.reject( new Error( "boom" ) ) ) };
		const { result: failResult } = renderEdit( failProvider );
		await act( async() => {
			outcome = await failResult.current.editing.onApplyAll();
		} );
		expect( outcome ).toBe( false );
	} );

	it( "returns null for a re-entrant call while a save is already in flight", async() => {
		let resolveFirst;
		const remoteDataProvider = { fetchJson: jest.fn( () => new Promise( ( resolve ) => {
			resolveFirst = resolve;
		} ) ) };
		const { result } = renderEdit( remoteDataProvider );

		// Start a first save that stays pending, so the re-entrancy guard is active.
		let firstOutcome;
		act( () => {
			firstOutcome = result.current.editing.onApplyAll();
		} );

		// A second call while the first is in flight must report null (busy), not false (failure).
		let secondOutcome;
		await act( async() => {
			secondOutcome = await result.current.editing.onApplyAll();
		} );
		expect( secondOutcome ).toBe( null );

		// Let the first save finish so no promise is left dangling.
		await act( async() => {
			resolveFirst( {} );
			await firstOutcome;
		} );
	} );
} );
