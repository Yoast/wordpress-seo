import { createSlice } from "@reduxjs/toolkit";
import { get } from "lodash";

export const DUPLICATE_POST_NAME = "duplicatePost";

const slice = createSlice( {
	name: DUPLICATE_POST_NAME,
	initialState: {},
	reducers: {},
} );

export const getInitialDuplicatePostState = slice.getInitialState;

export const duplicatePostSelectors = {
	selectDuplicatePostParam: ( state, param, defaultValue = false ) => get( state, [ DUPLICATE_POST_NAME, param ], defaultValue ),
};

export const duplicatePostActions = slice.actions;

export const duplicatePostReducer = slice.reducer;
