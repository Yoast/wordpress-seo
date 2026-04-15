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
		skipApprove: false,
		featureModalStatus: null,
	},
	reducers: {
		openModal: ( state, { payload } ) => {
			state.isOpen = true;
			state.skipApprove = Boolean( payload );
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
		} );
		builder.addCase( `${ FETCH_CONTENT_SUGGESTIONS_ACTION_NAME }/${ ASYNC_ACTION_NAMES.error }`, ( state ) => {
			state.featureModalStatus = FEATURE_MODAL_STATUS.error;
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
	selectShouldSkipApprove: ( state ) => get( state, [ MODAL_NAME, "skipApprove" ], slice.getInitialState().skipApprove ),
	selectFeatureModalStatus: ( state ) => get( state, [ MODAL_NAME, "featureModalStatus" ], slice.getInitialState().featureModalStatus ),
};
