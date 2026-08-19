import { createSelector, createSlice } from "@reduxjs/toolkit";
import { filter, get, includes } from "lodash";

export const REPLACEMENT_VARIABLES_NAME = "replacementVariables";

/**
 * Maps the raw replacementVariables window payload to store initial state.
 *
 * @param {Object} payload The replacementVariables value from the window data object.
 * @returns {Object} The initial state shape for the replacementVariables slice.
 */
export const getReplacementVariablesInitialState = ( payload ) => ( {
	recommended: get( payload, "recommended", {} ),
	shared: get( payload, "shared", [] ),
	specific: get( payload, "specific", {} ),
	variables: get( payload, "variables", [] ),
} );

const slice = createSlice( {
	name: REPLACEMENT_VARIABLES_NAME,
	initialState: getReplacementVariablesInitialState( {} ),
	reducers: {},
} );

const selectRecommendedReplacementVariables = state => get( state, [ REPLACEMENT_VARIABLES_NAME, "recommended" ], {} );
const selectSharedReplacementVariables = state => get( state, [ REPLACEMENT_VARIABLES_NAME, "shared" ], [] );
const selectSpecificReplacementVariables = state => get( state, [ REPLACEMENT_VARIABLES_NAME, "specific" ], {} );
const selectReplacementVariables = state => get( state, [ REPLACEMENT_VARIABLES_NAME, "variables" ], [] );

const selectSpecificReplacementVariablesFor = createSelector(
	[
		selectSharedReplacementVariables,
		selectSpecificReplacementVariables,
		( _state, context ) => context,
		( _state, _context, fallback ) => fallback,
	],
	( shared, specific, context, fallback ) => [ ...shared, ...get( specific, context, get( specific, fallback, [] ) ) ]
);

const selectReplacementVariablesFor = createSelector(
	[
		selectReplacementVariables,
		selectSpecificReplacementVariablesFor,
	],
	( variables, specific ) => filter( variables, ( { name } ) => includes( specific, name ) )
);

const selectRecommendedReplacementVariablesFor = createSelector(
	[
		selectRecommendedReplacementVariables,
		( _state, context ) => context,
		( _state, _context, fallback ) => fallback,
	],
	( recommended, context, fallback ) => get( recommended, context, get( recommended, fallback, [] ) )
);

export const replacementVariablesSelectors = {
	selectRecommendedReplacementVariables,
	selectSharedReplacementVariables,
	selectSpecificReplacementVariables,
	selectReplacementVariables,
	selectSpecificReplacementVariablesFor,
	selectReplacementVariablesFor,
	selectRecommendedReplacementVariablesFor,
};

export const replacementVariablesActions = slice.actions;

export const replacementVariablesReducer = slice.reducer;
