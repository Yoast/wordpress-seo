import { createSlice } from "@reduxjs/toolkit";
import { get } from "lodash";

/**
 * @returns {Object} The initial edits state: no rows are being edited.
 */
export const createInitialEditsState = () => ( {
	// Edit state per row id; a row is in edit mode while it has an entry here. Several rows can edit at once.
	rows: {},
} );

const slice = createSlice( {
	name: "edits",
	initialState: createInitialEditsState(),
	reducers: {
		// Enters edit mode for a row, opening the given fields.
		startEdit: ( state, { payload } ) => {
			state.rows[ payload.id ] = {
				openFields: Object.keys( payload.draft ),
				draft: { ...payload.draft },
				savingFields: {},
			};
		},
		// Updates a single open field's draft value for a row.
		updateDraftField: ( state, { payload } ) => {
			const row = state.rows[ payload.id ];
			if ( row ) {
				row.draft[ payload.key ] = payload.value;
			}
		},
		// Flags or clears a single field's saving state, so a row's fields can save independently.
		setSavingField: ( state, { payload } ) => {
			const row = state.rows[ payload.id ];
			if ( ! row ) {
				return;
			}
			if ( payload.isSaving ) {
				row.savingFields[ payload.key ] = true;
			} else {
				delete row.savingFields[ payload.key ];
			}
		},
		// Resolves a field (after Apply or Discard): closes its input. The row leaves edit mode once none remain.
		closeField: ( state, { payload } ) => {
			const row = state.rows[ payload.id ];
			if ( ! row ) {
				return;
			}
			row.openFields = row.openFields.filter( ( key ) => key !== payload.key );
			delete row.draft[ payload.key ];
			delete row.savingFields[ payload.key ];
			if ( row.openFields.length === 0 ) {
				delete state.rows[ payload.id ];
			}
		},
		// With Cancel button
		discardEdit: ( state, { payload } ) => {
			delete state.rows[ payload.id ];
		},
		// Leaves edit mode for every row and clears the drafts (e.g. when switching tabs).
		stopEdit: () => createInitialEditsState(),
	},
} );

export const editsSelectors = {
	selectEditingRows: ( state ) => get( state, "edits.rows", {} ),
};

export const editsActions = slice.actions;

export default slice.reducer;
