import { createSlice } from "@reduxjs/toolkit";
import { get } from "lodash";

export const DEFAULT_METADATA_NAME = "defaultMetadata";

const slice = createSlice( {
	name: DEFAULT_METADATA_NAME,
	initialState: {},
	reducers: {},
} );

export const getInitialDefaultMetadataState = slice.getInitialState;

export const defaultMetadataSelectors = {
	selectDefaultMetadata: ( state, key, defaultValue = "" ) => get( state, [ DEFAULT_METADATA_NAME, key ], defaultValue ),
	selectAllDefaultMetadata: state => get( state, DEFAULT_METADATA_NAME, getInitialDefaultMetadataState() ),
};

export const defaultMetadataActions = slice.actions;

export const defaultMetadataReducer = slice.reducer;
