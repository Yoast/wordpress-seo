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
		( state, postType ) => postType,
	],
	( shared, specific, postType ) => [ ...shared, ...get( specific, postType, [] ) ],
);
replacementVariablesSelectors.selectReplacementVariablesFor = createSelector(
	[
		replacementVariablesSelectors.selectReplacementVariables,
		replacementVariablesSelectors.selectSpecificReplacementVariablesFor,
	],
	( variables, specific ) => filter( variables, ( { name } ) => includes( specific, name ) ),
);
replacementVariablesSelectors.selectRecommendedReplacementVariablesFor = createSelector(
	[
		replacementVariablesSelectors.selectRecommendedReplacementVariables,
		( state, context ) => context,
	],
	( recommended, context ) => get( recommended, context, [] ),
);

export { replacementVariablesSelectors };

export const replacementVariablesActions = slice.actions;

export default slice.reducer;
