import { createSlice } from "@reduxjs/toolkit";
import { get } from "lodash";

/**
 * @returns {Object} The initial edits state: no row is being edited.
 */
export const createInitialEditsState = () => ( {
	editingId: null,
	draft: {},
	isSaving: false,
} );

const slice = createSlice( {
	name: "edits",
	initialState: createInitialEditsState(),
	reducers: {
		// Enters edit mode for a row, seeding the draft with its current field values.
		startEdit: ( state, { payload } ) => {
			state.editingId = payload.id;
			state.draft = { ...payload.draft };
			state.isSaving = false;
		},
		// Updates a single field of the in-progress draft.
		updateDraftField: ( state, { payload } ) => {
			state.draft[ payload.key ] = payload.value;
		},
		// Flags an in-progress save so the UI can disable the inputs and actions while it runs.
		setSaving: ( state, { payload } ) => {
			state.isSaving = payload;
		},
		// Leaves edit mode and clears the draft; used by Cancel and after a successful save.
		stopEdit: () => createInitialEditsState(),
	},
} );

export const editsSelectors = {
	selectEditingId: ( state ) => get( state, "edits.editingId", null ),
	selectEditDraft: ( state ) => get( state, "edits.draft", {} ),
	selectIsSaving: ( state ) => get( state, "edits.isSaving", false ),
};

export const editsActions = slice.actions;

export default slice.reducer;
