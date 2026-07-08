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

	it( "reflects every saved field and leaves edit mode after applying all", async() => {
		const remoteDataProvider = { fetchJson: jest.fn( () => Promise.resolve( {} ) ) };
		const { result } = renderEdit( remoteDataProvider );

		await act( async() => {
			await result.current.editing.onApplyAll();
		} );

		expect( updateItem ).toHaveBeenCalledWith( 7, "seoTitle", "Title 7" );
		expect( updateItem ).toHaveBeenCalledWith( 7, "metaDescription", "Desc 7" );
		expect( updateItem ).toHaveBeenCalledWith( 9, "seoTitle", "Title 9" );
		expect( dispatch.stopEdit ).toHaveBeenCalledTimes( 1 );
	} );

	it( "keeps the drafts and stays in edit mode when the batch save fails", async() => {
		const remoteDataProvider = { fetchJson: jest.fn( () => Promise.reject( new Error( "boom" ) ) ) };
		const { result } = renderEdit( remoteDataProvider );

		await act( async() => {
			await result.current.editing.onApplyAll();
		} );

		expect( updateItem ).not.toHaveBeenCalled();
		expect( dispatch.stopEdit ).not.toHaveBeenCalled();
	} );

	it( "discards all edits by leaving edit mode without saving", () => {
		const remoteDataProvider = { fetchJson: jest.fn() };
		const { result } = renderEdit( remoteDataProvider );

		result.current.editing.onDiscardAll();

		expect( dispatch.stopEdit ).toHaveBeenCalledTimes( 1 );
		expect( remoteDataProvider.fetchJson ).not.toHaveBeenCalled();
	} );
} );
