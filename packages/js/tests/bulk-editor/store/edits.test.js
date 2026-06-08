import reducer, { createInitialEditsState, editsActions, editsSelectors } from "../../../src/bulk-editor/store/edits";

describe( "edits slice", () => {
	it( "defaults to no row being edited", () => {
		expect( createInitialEditsState() ).toEqual( { editingId: null, draft: {}, isSaving: false } );
	} );

	it( "enters edit mode and seeds the draft from the row's values", () => {
		const state = reducer(
			createInitialEditsState(),
			editsActions.startEdit( { id: 7, draft: { seoTitle: "Old title" } } )
		);

		expect( state ).toEqual( { editingId: 7, draft: { seoTitle: "Old title" }, isSaving: false } );
	} );

	it( "copies the seeded draft so later edits do not mutate the source row", () => {
		const source = { seoTitle: "Old title" };
		const state = reducer( createInitialEditsState(), editsActions.startEdit( { id: 7, draft: source } ) );

		reducer( state, editsActions.updateDraftField( { key: "seoTitle", value: "New title" } ) );

		expect( source.seoTitle ).toBe( "Old title" );
	} );

	it( "updates a single draft field, leaving the others untouched", () => {
		const initial = { editingId: 7, draft: { seoTitle: "Title", metaDescription: "Description" }, isSaving: false };

		const state = reducer( initial, editsActions.updateDraftField( { key: "metaDescription", value: "New" } ) );

		expect( state.draft ).toEqual( { seoTitle: "Title", metaDescription: "New" } );
	} );

	it( "flags and clears the saving state", () => {
		const saving = reducer( createInitialEditsState(), editsActions.setSaving( true ) );
		expect( saving.isSaving ).toBe( true );

		const done = reducer( saving, editsActions.setSaving( false ) );
		expect( done.isSaving ).toBe( false );
	} );

	it( "leaves edit mode and clears the draft on stopEdit", () => {
		const editing = { editingId: 7, draft: { seoTitle: "Title" }, isSaving: true };

		expect( reducer( editing, editsActions.stopEdit() ) ).toEqual( createInitialEditsState() );
	} );

	it( "selects the editing id, the draft and the saving state", () => {
		const state = { edits: { editingId: 7, draft: { seoTitle: "Title" }, isSaving: true } };

		expect( editsSelectors.selectEditingId( state ) ).toBe( 7 );
		expect( editsSelectors.selectEditDraft( state ) ).toEqual( { seoTitle: "Title" } );
		expect( editsSelectors.selectIsSaving( state ) ).toBe( true );
	} );

	it( "falls back to safe defaults when the slice state is missing", () => {
		expect( editsSelectors.selectEditingId( {} ) ).toBeNull();
		expect( editsSelectors.selectEditDraft( {} ) ).toEqual( {} );
		expect( editsSelectors.selectIsSaving( {} ) ).toBe( false );
	} );
} );
