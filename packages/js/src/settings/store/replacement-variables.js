import { createSelector, createSlice } from "@reduxjs/toolkit";
import { filter, get, includes } from "lodash";

/**
 * @returns {Object} The initial state.
 */
export const createInitialReplacementVariablesState = () => ( {
	recommended: get( window, "wpseoScriptData.replacementVariables.recommended", {} ),
	shared: get( window, "wpseoScriptData.replacementVariables.shared", [] ),
	specific: get( window, "wpseoScriptData.replacementVariables.specific", {} ),
	variables: get( window, "wpseoScriptData.replacementVariables.variables", [] ),
} );

const slice = createSlice( {
	name: "replacementVariables",
	initialState: createInitialReplacementVariablesState(),
	reducers: {},
} );

const replacementVariablesSelectors = {
	selectRecommendedReplacementVariables: state => get( state, "replacementVariables.recommended", {} ),
	selectSharedReplacementVariables: state => get( state, "replacementVariables.shared", [] ),
	selectSpecificReplacementVariables: state => get( state, "replacementVariables.specific", {} ),
	selectReplacementVariables: state => get( state, "replacementVariables.variables", [] ),
};
replacementVariablesSelectors.selectSpecificReplacementVariablesFor = createSelector(
	[
		replacementVariablesSelectors.selectSharedReplacementVariables,
		replacementVariablesSelectors.selectSpecificReplacementVariables,
		( state, context ) => context,
		( state, context, fallback ) => fallback,
	],
	( shared, specific, context, fallback ) => [ ...shared, ...get( specific, context, get( specific, fallback, [] ) ) ]
);
replacementVariablesSelectors.selectReplacementVariablesFor = createSelector(
	[
		replacementVariablesSelectors.selectReplacementVariables,
		replacementVariablesSelectors.selectSpecificReplacementVariablesFor,
	],
	( variables, specific ) => filter( variables, ( { name } ) => includes( specific, name ) )
);
replacementVariablesSelectors.selectRecommendedReplacementVariablesFor = createSelector(
	[
		replacementVariablesSelectors.selectRecommendedReplacementVariables,
		( state, context ) => context,
		( state, context, fallback ) => fallback,
	],
	( recommended, context, fallback ) => get( recommended, context, get( recommended, fallback, [] ) )
);

export { replacementVariablesSelectors };

export const replacementVariablesActions = slice.actions;

export default slice.reducer;
