import { DEFAULT_MODE } from "yoast-components";
import {
	SWITCH_MODE,
	UPDATE_DATA,
	UPDATE_REPLACEMENT_VARIABLE,
	INSERT_REPLACEMENT_VARIABLE,
} from "../actions/snippetEditor";

const INITIAL_STATE = {
	mode: DEFAULT_MODE,
	data: {
		title: "",
		slug: "",
		description: "",
	},
	replacementVariables: [],
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

		case UPDATE_REPLACEMENT_VARIABLE:
			let newReplacementVariables = state.replacementVariables.map( ( replaceVar ) => {
				if( replaceVar.name === action.name ) {
					return {
						name: action.name,
						value: action.value,
					}
				}
				return replaceVar;
			} );
			return {
				...state,
				replacementVariables: newReplacementVariables,
			};

		case INSERT_REPLACEMENT_VARIABLE:
			return {
				...state,
				replacementVariables: [
					...state.replacementVariables,
					{
						name: action.name,
						value: action.value,
					},
				],
			};
	}

	return state;
}

export default snippetEditorReducer;
