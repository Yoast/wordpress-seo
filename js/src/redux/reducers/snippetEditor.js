import { DEFAULT_MODE } from "yoast-components";
import defaultReplaceVariables from "../../values/defaultReplaceVariables";
import {
	SWITCH_MODE,
	UPDATE_DATA,
	UPDATE_REPLACEMENT_VARIABLE,
} from "../actions/snippetEditor";

const INITIAL_STATE = {
	mode: DEFAULT_MODE,
	data: {
		title: "",
		slug: "",
		description: "",
	},
	replacementVariables: defaultReplaceVariables,
};

/**
 * Reduces the dispatched action for the snippet editor state.
 *
 * @param {Object} state The current state.
 * @param {Object} action The action that was just dispatched.
 *
 * @returns {Object} The new state.
 */
function snippetEditorReducer( state = INITIAL_STATE, action ) {
	switch ( action.type ) {
		case SWITCH_MODE:
			return {
				...state,
				mode: action.mode,
			};

		case UPDATE_DATA:
			return {
				...state,
				data: {
					...state.data,
					...action.data,
				},
			};

		case UPDATE_REPLACEMENT_VARIABLE: {
			let isNewReplaceVar = true;
			let nextReplacementVariables = state.replacementVariables.map( ( replaceVar ) => {
				if ( replaceVar.name === action.name ) {
					isNewReplaceVar = false;
					return {
						name: action.name,
						value: action.value,
					};
				}
				return replaceVar;
			} );
			if ( isNewReplaceVar ) {
				nextReplacementVariables.push( {
					name: action.name,
					value: action.value,
				} );
			}
			return {
				...state,
				replacementVariables: nextReplacementVariables,
			};
		}
	}

	return state;
}

export default snippetEditorReducer;
