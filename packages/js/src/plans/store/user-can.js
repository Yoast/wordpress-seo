import { createSlice } from "@reduxjs/toolkit";
import { get } from "lodash";

export const USER_CAN_NAME = "userCan";

const slice = createSlice( {
	name: USER_CAN_NAME,
	initialState: {},
	reducers: {},
} );

export const getInitialUserCanState = slice.getInitialState;

export const userCanSelectors = {
	selectUserCan: ( state, param, defaultValue = false ) => get( state, [ USER_CAN_NAME, param ], defaultValue ),
};

export const userCanActions = slice.actions;

export const userCanReducer = slice.reducer;
