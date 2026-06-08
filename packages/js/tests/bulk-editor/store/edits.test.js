import reducer, { createInitialEditsState, editsActions, editsSelectors } from "../../../src/bulk-editor/store/edits";

describe( "edits slice", () => {
	it( "defaults to no rows being edited", () => {
		expect( createInitialEditsState() ).toEqual( { rows: {} } );
	} );

	it( "enters edit mode for a row, opening its fields seeded with their values", () => {
		const state = reducer(
			createInitialEditsState(),
			editsActions.startEdit( { id: 7, draft: { seoTitle: "Title", metaDescription: "Description" } } )
		);

		expect( state.rows[ 7 ] ).toEqual( {
			openFields: [ "seoTitle", "metaDescription" ],
			draft: { seoTitle: "Title", metaDescription: "Description" },
			savingField: null,
		} );
	} );

	it( "lets several rows be edited at once", () => {
		let state = reducer( createInitialEditsState(), editsActions.startEdit( { id: 7, draft: { seoTitle: "A" } } ) );
		state = reducer( state, editsActions.startEdit( { id: 9, draft: { seoTitle: "B" } } ) );

		expect( Object.keys( state.rows ) ).toEqual( [ "7", "9" ] );
	} );

	it( "copies the seeded draft so later edits do not mutate the source", () => {
		const source = { seoTitle: "Title" };
		const state = reducer( createInitialEditsState(), editsActions.startEdit( { id: 7, draft: source } ) );

		reducer( state, editsActions.updateDraftField( { id: 7, key: "seoTitle", value: "Changed" } ) );

		expect( source.seoTitle ).toBe( "Title" );
	} );

	it( "updates a single field for the targeted row only", () => {
		let state = reducer( createInitialEditsState(), editsActions.startEdit( { id: 7, draft: { seoTitle: "A", metaDescription: "B" } } ) );
		state = reducer( state, editsActions.startEdit( { id: 9, draft: { seoTitle: "C" } } ) );

		state = reducer( state, editsActions.updateDraftField( { id: 7, key: "metaDescription", value: "B2" } ) );

		expect( state.rows[ 7 ].draft ).toEqual( { seoTitle: "A", metaDescription: "B2" } );
		expect( state.rows[ 9 ].draft ).toEqual( { seoTitle: "C" } );
	} );

	it( "flags and clears the saving field for a row", () => {
		let state = reducer( createInitialEditsState(), editsActions.startEdit( { id: 7, draft: { seoTitle: "A" } } ) );

		state = reducer( state, editsActions.setSavingField( { id: 7, key: "seoTitle" } ) );
		expect( state.rows[ 7 ].savingField ).toBe( "seoTitle" );

		state = reducer( state, editsActions.setSavingField( { id: 7, key: null } ) );
		expect( state.rows[ 7 ].savingField ).toBeNull();
	} );

	it( "closes one field but keeps the row editing while another remains open", () => {
		let state = reducer( createInitialEditsState(), editsActions.startEdit( { id: 7, draft: { seoTitle: "A", metaDescription: "B" } } ) );
		state = reducer( state, editsActions.setSavingField( { id: 7, key: "seoTitle" } ) );

		state = reducer( state, editsActions.closeField( { id: 7, key: "seoTitle" } ) );

		expect( state.rows[ 7 ].openFields ).toEqual( [ "metaDescription" ] );
		expect( state.rows[ 7 ].draft ).toEqual( { metaDescription: "B" } );
		expect( state.rows[ 7 ].savingField ).toBeNull();
	} );

	it( "leaves edit mode for a row once its last field closes", () => {
		let state = reducer( createInitialEditsState(), editsActions.startEdit( { id: 7, draft: { seoTitle: "A" } } ) );

		state = reducer( state, editsActions.closeField( { id: 7, key: "seoTitle" } ) );

		expect( state.rows[ 7 ] ).toBeUndefined();
	} );

	it( "clears every editing row on stopEdit", () => {
		let state = reducer( createInitialEditsState(), editsActions.startEdit( { id: 7, draft: { seoTitle: "A" } } ) );
		state = reducer( state, editsActions.startEdit( { id: 9, draft: { seoTitle: "B" } } ) );

		expect( reducer( state, editsActions.stopEdit() ) ).toEqual( createInitialEditsState() );
	} );

	it( "selects the editing rows map, defaulting to empty when missing", () => {
		const rows = { 7: { openFields: [ "seoTitle" ], draft: { seoTitle: "A" }, savingField: null } };

		expect( editsSelectors.selectEditingRows( { edits: { rows } } ) ).toEqual( rows );
		expect( editsSelectors.selectEditingRows( {} ) ).toEqual( {} );
	} );
} );
