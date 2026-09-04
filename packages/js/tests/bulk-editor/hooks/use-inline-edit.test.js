import { act, renderHook } from "@testing-library/react";
import { useDispatch, useSelect } from "@wordpress/data";
import { useInlineEdit } from "../../../src/bulk-editor/hooks/use-inline-edit";
import { getFieldSets } from "../../../src/bulk-editor/field-sets";
import { FIELD_SET_SEARCH, FIELD_SET_SOCIAL } from "../../../src/bulk-editor/constants";

jest.mock( "@wordpress/data", () => ( { useSelect: jest.fn(), useDispatch: jest.fn() } ) );

// The scorers are exercised in their own service test; here they are mocked so we can assert the hook wires
// them up. The factory returns lazy getters, so the "mock"-prefixed vars are only read at call time (safe with
// the static import above).
const mockScoreFields = jest.fn();
const mockScoreField = jest.fn();
jest.mock( "../../../src/bulk-editor/services/field-scores", () => ( {
	createFieldScorer: () => mockScoreFields,
	createSingleFieldScorer: () => mockScoreField,
} ) );

// eslint-disable-next-line max-statements
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

		mockScoreFields.mockClear();
		mockScoreField.mockClear();
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

	it( "batches all open fields of a row into one request per endpoint via onApplyRow", async() => {
		// Row 7 has seoTitle and metaDescription open — both go to the same endpoint, so one request.
		const remoteDataProvider = { fetchJson: jest.fn( () => Promise.resolve( {} ) ) };
		const { result } = renderEdit( remoteDataProvider );

		await act( async() => {
			await result.current.editing.onApplyRow( 7 );
		} );

		expect( remoteDataProvider.fetchJson ).toHaveBeenCalledTimes( 1 );
		const [ endpoint, , options ] = remoteDataProvider.fetchJson.mock.calls[ 0 ];
		expect( endpoint ).toBe( "https://example.com/update_search" );
		expect( JSON.parse( options.body ) ).toEqual( {
			/* eslint-disable camelcase -- The REST endpoint expects snake_case parameters. */
			items: [ { id: 7, seo_title: "Title 7", meta_description: "Desc 7" } ],
			/* eslint-enable camelcase -- The REST endpoint expects snake_case parameters. */
		} );
	} );

	it( "reflects and closes every field after onApplyRow succeeds", async() => {
		const remoteDataProvider = { fetchJson: jest.fn( () => Promise.resolve( {} ) ) };
		const { result } = renderEdit( remoteDataProvider );

		await act( async() => {
			await result.current.editing.onApplyRow( 7 );
		} );

		expect( updateItem ).toHaveBeenCalledWith( 7, "seoTitle", "Title 7" );
		expect( updateItem ).toHaveBeenCalledWith( 7, "metaDescription", "Desc 7" );
		expect( dispatch.closeField ).toHaveBeenCalledWith( { id: 7, key: "seoTitle" } );
		expect( dispatch.closeField ).toHaveBeenCalledWith( { id: 7, key: "metaDescription" } );
		expect( result.current.editing.hasSaveError ).toBe( false );
	} );

	it( "re-scores after onApplyRow succeeds on the search tab", async() => {
		const rendered = { seo_title: "Title 7 rendered", meta_description: "Desc 7 rendered" }; // eslint-disable-line camelcase -- server-side field name
		const remoteDataProvider = { fetchJson: jest.fn( () => Promise.resolve( { results: [ { id: 7, success: true, rendered } ] } ) ) };
		const { result } = renderEdit( remoteDataProvider );

		await act( async() => {
			await result.current.editing.onApplyRow( 7 );
		} );

		expect( mockScoreFields ).toHaveBeenCalledTimes( 1 );
	} );

	it( "flags a save error and clears saving state when onApplyRow fails", async() => {
		const remoteDataProvider = { fetchJson: jest.fn( () => Promise.reject( new Error( "boom" ) ) ) };
		const { result } = renderEdit( remoteDataProvider );

		await act( async() => {
			await result.current.editing.onApplyRow( 7 );
		} );

		expect( updateItem ).not.toHaveBeenCalled();
		expect( dispatch.closeField ).not.toHaveBeenCalled();
		expect( dispatch.setSavingField ).toHaveBeenCalledWith( { id: 7, key: "seoTitle", isSaving: false } );
		expect( dispatch.setSavingField ).toHaveBeenCalledWith( { id: 7, key: "metaDescription", isSaving: false } );
		expect( result.current.editing.hasSaveError ).toBe( true );
	} );

	it( "does not re-score when other fields of the same row are still open", async() => {
		// Row 7 has two open fields: seoTitle and metaDescription. Applying seoTitle leaves metaDescription open.
		// Scoring at this point is pointless — the score is immediately stale once metaDescription saves —
		// and it fires an extra network request. Scoring must be deferred to the final apply.
		const remoteDataProvider = { fetchJson: jest.fn( () => Promise.resolve( { results: [ { id: 7, success: true, rendered: { seo_title: "T", meta_description: "D" } } ] } ) ) }; // eslint-disable-line camelcase -- server-side field name
		const { result } = renderEdit( remoteDataProvider );

		await act( async() => {
			await result.current.editing.onApplyField( { id: 7, key: "seoTitle" } );
		} );

		expect( mockScoreFields ).not.toHaveBeenCalled();
	} );

	it( "re-scores after the last open field of a row is applied", async() => {
		// Row 9 has only one open field: seoTitle. Applying it is the final edit for that row, so scoring fires.
		const rendered = { seo_title: "Title 9 rendered", meta_description: "Desc 9 rendered" }; // eslint-disable-line camelcase -- server-side field name
		const remoteDataProvider = { fetchJson: jest.fn( () => Promise.resolve( { results: [ { id: 9, success: true, rendered } ] } ) ) };
		const { result } = renderEdit( remoteDataProvider );

		await act( async() => {
			await result.current.editing.onApplyField( { id: 9, key: "seoTitle" } );
		} );

		expect( mockScoreFields ).toHaveBeenCalledTimes( 1 );
	} );

	it( "uses the server-sanitized focus_keyphrase in a per-field apply", async() => {
		editingRows = {
			9: { openFields: [ "focusKeyphrase" ], draft: { focusKeyphrase: "<b>seo</b>" }, savingFields: {} },
		};
		/* eslint-disable camelcase -- server-side field name */
		const sanitized = { focus_keyphrase: "seo" };
		const remoteDataProvider = { fetchJson: jest.fn( () => Promise.resolve( { results: [ { id: 9, success: true, sanitized } ] } ) ) };
		/* eslint-enable camelcase */
		const { result } = renderEdit( remoteDataProvider );

		await act( async() => {
			await result.current.editing.onApplyField( { id: 9, key: "focusKeyphrase" } );
		} );

		expect( updateItem ).toHaveBeenCalledWith( 9, "focusKeyphrase", "seo" );
	} );

	it( "re-scores using the sanitized focus_keyphrase after onApplyRow when the server stripped HTML", async() => {
		editingRows = {
			9: { openFields: [ "focusKeyphrase" ], draft: { focusKeyphrase: "<b>seo</b>" }, savingFields: {} },
		};
		/* eslint-disable camelcase -- server-side field names */
		const rendered = { seo_title: "Title 9 rendered", meta_description: "Desc 9 rendered" };
		const sanitized = { focus_keyphrase: "seo" };
		/* eslint-enable camelcase */
		const remoteDataProvider = { fetchJson: jest.fn( () => Promise.resolve( { results: [ { id: 9, success: true, rendered, sanitized } ] } ) ) };
		const { result } = renderEdit( remoteDataProvider );

		await act( async() => {
			await result.current.editing.onApplyRow( 9 );
		} );

		expect( mockScoreFields ).toHaveBeenCalledTimes( 1 );
		expect( mockScoreFields.mock.calls[ 0 ][ 0 ].keyphrase ).toBe( "seo" );
	} );

	it( "re-scores using the sanitized focus_keyphrase after onApplyAll when the server stripped HTML", async() => {
		editingRows = {
			9: { openFields: [ "focusKeyphrase" ], draft: { focusKeyphrase: "<b>seo</b>" }, savingFields: {} },
		};
		/* eslint-disable camelcase -- server-side field names */
		const rendered = { seo_title: "Title 9 rendered", meta_description: "Desc 9 rendered" };
		const sanitized = { focus_keyphrase: "seo" };
		/* eslint-enable camelcase */
		const remoteDataProvider = { fetchJson: jest.fn( () => Promise.resolve( { results: [ { id: 9, success: true, rendered, sanitized } ] } ) ) };
		const { result } = renderEdit( remoteDataProvider );

		await act( async() => {
			await result.current.editing.onApplyAll();
		} );

		expect( mockScoreFields ).toHaveBeenCalledTimes( 1 );
		expect( mockScoreFields.mock.calls[ 0 ][ 0 ].keyphrase ).toBe( "seo" );
	} );

	it( "re-scores using the sanitized focus_keyphrase after the last open field is applied when the server stripped HTML", async() => {
		editingRows = {
			9: { openFields: [ "focusKeyphrase" ], draft: { focusKeyphrase: "<b>seo</b>" }, savingFields: {} },
		};
		/* eslint-disable camelcase -- server-side field names */
		const rendered = { seo_title: "Title 9 rendered", meta_description: "Desc 9 rendered" };
		const sanitized = { focus_keyphrase: "seo" };
		/* eslint-enable camelcase */
		const remoteDataProvider = { fetchJson: jest.fn( () => Promise.resolve( { results: [ { id: 9, success: true, rendered, sanitized } ] } ) ) };
		const { result } = renderEdit( remoteDataProvider );

		await act( async() => {
			await result.current.editing.onApplyField( { id: 9, key: "focusKeyphrase" } );
		} );

		expect( mockScoreFields ).toHaveBeenCalledTimes( 1 );
		expect( mockScoreFields.mock.calls[ 0 ][ 0 ].keyphrase ).toBe( "seo" );
	} );

	it( "does not re-score on a social batch save that carries only a focus_keyphrase in sanitized", async() => {
		// The social field set includes focusKeyphrase. A social save returns sanitized: { focus_keyphrase }
		// but no rendered payload. rescoreBatchResult is gated on rendered being present, so this is a
		// structural no-op rather than relying solely on the activeFieldSet guard.
		editingRows = {
			9: { openFields: [ "focusKeyphrase" ], draft: { focusKeyphrase: "<b>seo</b>" }, savingFields: {} },
		};
		/* eslint-disable camelcase -- server-side field name */
		const sanitized = { focus_keyphrase: "seo" };
		const remoteDataProvider = { fetchJson: jest.fn( () => Promise.resolve( { results: [ { id: 9, success: true, sanitized } ] } ) ) };
		/* eslint-enable camelcase */
		const { result } = renderHook( () => useInlineEdit( {
			dataProvider,
			remoteDataProvider,
			fieldSets: getFieldSets(),
			activeFieldSet: FIELD_SET_SOCIAL,
			items: [],
			updateItem,
		} ) );

		await act( async() => {
			await result.current.editing.onApplyAll();
		} );

		expect( mockScoreFields ).not.toHaveBeenCalled();
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

	it( "reflects and re-scores just the applied field when a fill saves it onto a row", () => {
		// Premium's AI apply saves through the same route, then reflects the value via onFieldApplied; that must
		// also re-score the one applied field so the needs-improvement filter reflects the AI-generated value.
		const remoteDataProvider = { fetchJson: jest.fn() };
		const items = [ { id: 7, focusKeyphrase: "seo" } ];
		const { result } = renderHook( () => useInlineEdit( {
			dataProvider,
			remoteDataProvider,
			fieldSets,
			activeFieldSet: FIELD_SET_SEARCH,
			items,
			updateItem,
		} ) );

		act( () => result.current.editing.onFieldApplied( 7, "seoTitle", "An AI title" ) );

		expect( updateItem ).toHaveBeenCalledWith( 7, "seoTitle", "An AI title" );
		expect( mockScoreField ).toHaveBeenCalledWith( { id: 7, fieldKey: "seoTitle", value: "An AI title", keyphrase: "seo" } );
	} );

	it( "uses the server-sanitized focus_keyphrase when present, so HTML stripped on save is not shown as saved", async() => {
		// Row 9 submits a keyphrase with HTML; the server strips it and returns the clean value.
		editingRows = {
			9: { openFields: [ "focusKeyphrase" ], draft: { focusKeyphrase: "<b>seo</b>" }, savingFields: {} },
		};
		/* eslint-disable camelcase -- server-side field name */
		const sanitized = { focus_keyphrase: "seo" };
		const remoteDataProvider = { fetchJson: jest.fn( () => Promise.resolve( { results: [ { id: 9, success: true, sanitized } ] } ) ) };
		/* eslint-enable camelcase */
		const { result } = renderEdit( remoteDataProvider );

		await act( async() => {
			await result.current.editing.onApplyRow( 9 );
		} );

		// The local item must reflect what the server actually stored, not the HTML-containing draft.
		expect( updateItem ).toHaveBeenCalledWith( 9, "focusKeyphrase", "seo" );
	} );

	it( "uses the server-sanitized focus_keyphrase in a batch save", async() => {
		editingRows = {
			9: { openFields: [ "focusKeyphrase" ], draft: { focusKeyphrase: "<b>seo</b>" }, savingFields: {} },
		};
		/* eslint-disable camelcase -- server-side field name */
		const sanitized = { focus_keyphrase: "seo" };
		const remoteDataProvider = { fetchJson: jest.fn( () => Promise.resolve( { results: [ { id: 9, success: true, sanitized } ] } ) ) };
		/* eslint-enable camelcase */
		const { result } = renderEdit( remoteDataProvider );

		await act( async() => {
			await result.current.editing.onApplyAll();
		} );

		expect( updateItem ).toHaveBeenCalledWith( 9, "focusKeyphrase", "seo" );
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

describe( "useInlineEdit with a read-only field", () => {
	// With the SEO analysis off the focus keyphrase column stays visible but is no longer editable.
	const fieldSets = getFieldSets( { isKeywordAnalysisActive: false } );
	const item = { id: 7, focusKeyphrase: "what is seo", seoTitle: "Title 7", metaDescription: "Desc 7" };
	let editingRows;
	let dispatch;
	let dataProvider;

	beforeEach( () => {
		editingRows = {};
		dispatch = {
			startEdit: jest.fn(),
			updateDraftField: jest.fn(),
			setSavingField: jest.fn(),
			closeField: jest.fn(),
			discardEdit: jest.fn(),
			stopEdit: jest.fn(),
		};
		dataProvider = { getEndpoint: jest.fn( ( key ) => `https://example.com/${ key }` ) };

		useSelect.mockImplementation( ( mapSelect ) => mapSelect( () => ( { selectEditingRows: () => editingRows } ) ) );
		useDispatch.mockReturnValue( dispatch );
	} );

	const renderEdit = ( remoteDataProvider ) => renderHook( () => useInlineEdit( {
		dataProvider,
		remoteDataProvider,
		fieldSets,
		activeFieldSet: FIELD_SET_SEARCH,
		items: [ item ],
		updateItem: jest.fn(),
	} ) );

	it( "leaves the read-only field out of the draft when a row starts editing", () => {
		const { result } = renderEdit( { fetchJson: jest.fn() } );

		act( () => {
			result.current.editing.onStartEdit( 7 );
		} );

		expect( dispatch.startEdit ).toHaveBeenCalledWith( { id: 7, draft: { seoTitle: "Title 7", metaDescription: "Desc 7" } } );
	} );

	it( "never sends the read-only field, so an existing keyphrase cannot be blanked", async() => {
		// A read-only field that somehow reached the open fields must still be kept out of the request body.
		editingRows = {
			7: {
				openFields: [ "focusKeyphrase", "seoTitle" ],
				draft: { focusKeyphrase: "", seoTitle: "Title 7" },
				savingFields: {},
			},
		};
		const remoteDataProvider = { fetchJson: jest.fn( () => Promise.resolve( {} ) ) };
		const { result } = renderEdit( remoteDataProvider );

		await act( async() => {
			await result.current.editing.onApplyRow( 7 );
		} );

		const [ , , options ] = remoteDataProvider.fetchJson.mock.calls[ 0 ];
		// eslint-disable-next-line camelcase -- The REST endpoint expects snake_case parameters.
		expect( JSON.parse( options.body ) ).toEqual( { items: [ { id: 7, seo_title: "Title 7" } ] } );

		await act( async() => {
			await result.current.editing.onApplyField( { id: 7, key: "focusKeyphrase" } );
		} );

		// The per-field apply bails out entirely, so no second request goes out.
		expect( remoteDataProvider.fetchJson ).toHaveBeenCalledTimes( 1 );
	} );
} );
