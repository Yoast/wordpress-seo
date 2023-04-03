import { createSlice } from "@reduxjs/toolkit";
import { get } from "lodash";

const NAME = "shared";

/**
 * @returns {Object} The initial state.
 */
export const createInitialState = () => ( {
	...get( window, "wpseoScriptData.shared", {} ),
} );

const slice = createSlice( {
	name: NAME,
	initialState: createInitialState(),
	reducers: {},
} );

export const selectors = {
	selectFromShared: ( state, name, defaultValue = {} ) => get( state, `${ NAME }.${ name }`, defaultValue ),
	selectAllShared: state => get( state, NAME, {} ),
};

export const actions = slice.actions;

export const reducer = slice.reducer;
