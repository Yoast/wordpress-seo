import { DEFAULT_MODE } from "yoast-components";
import {
	SNIPPET_EDITOR_SWITCH_MODE,
	SNIPPET_EDITOR_UPDATE_DATA,
	SNIPPET_EDITOR_UPDATE_REPLACEMENT_VARIABLE,
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
 * Reduces the dispatches action for the snippet editor state.
 *
 * @param {Object} state The current state.
 * @param {Object} action The action that was just dispatched.
 *
 * @returns {Object} The new state.
 */
function snippetEditorReducer( state = INITIAL_STATE, action ) {
	switch ( action.type ) {
		case SNIPPET_EDITOR_SWITCH_MODE:
			return {
				...state,
				mode: action.mode,
			};

		case SNIPPET_EDITOR_UPDATE_DATA:
			return {
				...state,
				data: {
					...state.data,
					...action.data,
				},
			};

		case SNIPPET_EDITOR_UPDATE_REPLACEMENT_VARIABLE:
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
