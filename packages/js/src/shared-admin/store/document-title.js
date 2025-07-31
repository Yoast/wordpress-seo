import { createSlice } from "@reduxjs/toolkit";
import { defaultTo, get } from "lodash";

export const DOCUMENT_TITLE_NAME = "documentTitle";

const slice = createSlice( {
	name: DOCUMENT_TITLE_NAME,
	initialState: defaultTo( document?.title, "test" ),
	reducers: {
		setDocumentTitle: ( state, { payload } ) => payload,
	},
} );

export const getInitialDocumentTitleState = slice.getInitialState;

export const documentTitleSelectors = {
	selectDocumentTitle: state => get( state, DOCUMENT_TITLE_NAME, "" ),
	selectDocumentFullTitle: ( state, { prefix = "" } = {} ) => {
		const title = get( state, DOCUMENT_TITLE_NAME, "" );

		if ( title.startsWith( prefix ) ) {
			return title;
		}

		return `${prefix} < ${title}`;
	},
};

export const documentTitleActions = slice.actions;

export const documentTitleReducer = slice.reducer;
