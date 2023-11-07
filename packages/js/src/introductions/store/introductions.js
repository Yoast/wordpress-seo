import { createEntityAdapter, createSelector, createSlice, nanoid } from "@reduxjs/toolkit";
import { get, map } from "lodash";

export const INTRODUCTIONS_NAME = "introductions";

const adapter = createEntityAdapter( {
	selectId: introduction => introduction.id,
	sortComparer: ( a, b ) => {
		if ( a.priority === b.priority ) {
			return 0;
		}
		return a.priority < b.priority ? -1 : 1;
	},
} );

/**
 * @param {Object} introduction The introduction.
 * @returns {{id: string, priority: number}} The prepared introduction.
 */
const prepareIntroduction = introduction => ( {
	id: introduction.id || nanoid(),
	priority: introduction.priority || 0,
} );

const slice = createSlice( {
	name: INTRODUCTIONS_NAME,
	initialState: adapter.getInitialState( {
		current: 0,
	} ),
	reducers: {
		addIntroduction: { reducer: adapter.addOne, prepare: introduction => ( { payload: prepareIntroduction( introduction ) } ) },
		addIntroductions: { reducer: adapter.addMany, prepare: introductions => ( { payload: map( introductions, prepareIntroduction ) } ) },
		setIntroductions: { reducer: adapter.setAll, prepare: introductions => ( { payload: map( introductions, prepareIntroduction ) } ) },
	},
} );

export const getInitialIntroductionsState = slice.getInitialState;

const adapterSelectors = adapter.getSelectors( state => get( state, INTRODUCTIONS_NAME, {} ) );
export const introductionsSelectors = {
	selectCurrentIntroductionIndex: state => get( state, [ INTRODUCTIONS_NAME, "current" ], 0 ),
	selectIntroduction: adapterSelectors.selectById,
	selectIntroductions: adapterSelectors.selectAll,
};
introductionsSelectors.selectCurrentIntroduction = createSelector(
	[
		introductionsSelectors.selectCurrentIntroductionIndex,
		introductionsSelectors.selectIntroductions,
	],
	( current, introductions ) => introductions[ current ]
);

export const introductionsActions = slice.actions;

export const introductionsReducer = slice.reducer;
