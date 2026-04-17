import { createSlice } from "@reduxjs/toolkit";
import { get } from "lodash";
import { FEATURE_MODAL_STATUS } from "../constants";
import { FETCH_CONTENT_OUTLINE_ACTION_NAME } from "./content-outline";
import { FETCH_CONTENT_SUGGESTIONS_ACTION_NAME } from "./content-suggestions";
import { ASYNC_ACTION_NAMES } from "../../shared-admin/constants";

export const MODAL_NAME = "modal";

/**
 * Normalizes an error payload to the structured shape expected by `ContentPlannerError`.
 * Handles plain `Error` instances, raw strings, and partial error objects by filling in defaults.
 *
 * @param {*} payload The raw error payload from the fetch generator.
 * @returns {{ errorCode: number, errorIdentifier: string, errorMessage: string }} The structured error.
 */
const normalizeError = ( payload ) => {
	const source = payload || {};
	return {
		errorCode: source.errorCode || 500,
		errorIdentifier: source.errorIdentifier || "",
		errorMessage: source.errorMessage || source.message || "",
	};
};

const slice = createSlice( {
	name: MODAL_NAME,
	initialState: {
		isOpen: false,
		featureModalStatus: null,
		error: null,
	},
	reducers: {
		openModal: ( state ) => {
			state.isOpen = true;
		},
		closeModal: () => slice.getInitialState(),
		setFeatureModalStatus: ( state, { payload } ) => {
			state.featureModalStatus = payload;
		},
	},
	extraReducers: ( builder ) => {
		builder.addCase( `${ FETCH_CONTENT_OUTLINE_ACTION_NAME }/${ ASYNC_ACTION_NAMES.request }`, ( state ) => {
			state.featureModalStatus = FEATURE_MODAL_STATUS.contentOutline;
			state.error = null;
		} );
		builder.addCase( `${ FETCH_CONTENT_OUTLINE_ACTION_NAME }/${ ASYNC_ACTION_NAMES.success }`, ( state ) => {
			state.featureModalStatus = FEATURE_MODAL_STATUS.contentOutline;
		} );
		builder.addCase( `${ FETCH_CONTENT_SUGGESTIONS_ACTION_NAME }/${ ASYNC_ACTION_NAMES.request }`, ( state ) => {
			state.featureModalStatus = FEATURE_MODAL_STATUS.contentSuggestions;
			state.error = null;
		} );
		builder.addCase( `${ FETCH_CONTENT_SUGGESTIONS_ACTION_NAME }/${ ASYNC_ACTION_NAMES.success }`, ( state ) => {
			state.featureModalStatus = FEATURE_MODAL_STATUS.contentSuggestions;
		} );
		builder.addCase( `${ FETCH_CONTENT_SUGGESTIONS_ACTION_NAME }/${ ASYNC_ACTION_NAMES.error }`, ( state, { payload } ) => {
			state.featureModalStatus = FEATURE_MODAL_STATUS.contentSuggestionsError;
			state.error = normalizeError( payload );
		} );
		builder.addCase( `${ FETCH_CONTENT_OUTLINE_ACTION_NAME }/${ ASYNC_ACTION_NAMES.error }`, ( state, { payload } ) => {
			state.featureModalStatus = FEATURE_MODAL_STATUS.contentOutlineError;
			state.error = normalizeError( payload );
		} );
	},
} );

export const getInitialModalState = slice.getInitialState;

export const modalReducer = slice.reducer;

export const modalActions = {
	...slice.actions,
};

export const modalSelectors = {
	selectIsModalOpen: ( state ) => get( state, [ MODAL_NAME, "isOpen" ], slice.getInitialState().isOpen ),
	selectFeatureModalStatus: ( state ) => get( state, [ MODAL_NAME, "featureModalStatus" ], slice.getInitialState().featureModalStatus ),
	selectModalError: ( state ) => get( state, [ MODAL_NAME, "error" ], slice.getInitialState().error ),
};
