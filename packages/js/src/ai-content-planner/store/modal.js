import { createSlice } from "@reduxjs/toolkit";
import { get } from "lodash";
import { FEATURE_MODAL_STATUS } from "../constants";
import { FETCH_CONTENT_OUTLINE_ACTION_NAME } from "./content-outline";
import { FETCH_CONTENT_SUGGESTIONS_ACTION_NAME } from "./content-suggestions";
import { ASYNC_ACTION_NAMES } from "../../shared-admin/constants";

export const MODAL_NAME = "modal";

const slice = createSlice( {
	name: MODAL_NAME,
	initialState: {
		isOpen: false,
		featureModalStatus: null,
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
		} );
		builder.addCase( `${ FETCH_CONTENT_OUTLINE_ACTION_NAME }/${ ASYNC_ACTION_NAMES.success }`, ( state ) => {
			state.featureModalStatus = FEATURE_MODAL_STATUS.contentOutline;
		} );
		builder.addCase( `${ FETCH_CONTENT_SUGGESTIONS_ACTION_NAME }/${ ASYNC_ACTION_NAMES.request }`, ( state ) => {
			state.featureModalStatus = FEATURE_MODAL_STATUS.contentSuggestions;
		} );
		builder.addCase( `${ FETCH_CONTENT_SUGGESTIONS_ACTION_NAME }/${ ASYNC_ACTION_NAMES.success }`, ( state ) => {
			state.featureModalStatus = FEATURE_MODAL_STATUS.contentSuggestions;
		} );
		builder.addCase( `${ FETCH_CONTENT_OUTLINE_ACTION_NAME }/${ ASYNC_ACTION_NAMES.error }`, ( state ) => {
			state.featureModalStatus = FEATURE_MODAL_STATUS.error;
			state.isOpen = false;
		} );
		builder.addCase( `${ FETCH_CONTENT_SUGGESTIONS_ACTION_NAME }/${ ASYNC_ACTION_NAMES.error }`, ( state ) => {
			state.featureModalStatus = FEATURE_MODAL_STATUS.error;
			state.isOpen = false;
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
};
