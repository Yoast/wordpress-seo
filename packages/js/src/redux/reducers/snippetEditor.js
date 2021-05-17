import getDefaultReplacementVariables from "../../values/defaultReplaceVariables";
import {
	SWITCH_MODE,
	UPDATE_DATA,
	UPDATE_REPLACEMENT_VARIABLE,
	REMOVE_REPLACEMENT_VARIABLE,
	REFRESH,
	UPDATE_WORDS_TO_HIGHLIGHT,
	LOAD_SNIPPET_EDITOR_DATA,
} from "../actions/snippetEditor";
import { pushNewReplaceVar } from "../../helpers/replacementVariableHelpers";

/**
 * Returns the initial state for the snippetEditorReducer.
 *
 * @returns {Object} The initial state.
 */
function getInitialState() {
	return {
		mode: "mobile",
		data: {
			title: "",
			description: "",
			slug: "",
		},
		wordsToHighlight: [],
		replacementVariables: getDefaultReplacementVariables(),
		uniqueRefreshValue: "",
		templates: {
			title: "",
			description: "",
		},
		isLoading: true,
	};
}

/**
 * Reduces the dispatched action for the snippet editor state.
 *
 * @param {Object} state The current state.
 * @param {Object} action The action that was just dispatched.
 *
 * @returns {Object} The new state.
 */
function snippetEditorReducer( state = getInitialState(), action ) {
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
						label: action.label || replaceVar.label,
						value: action.value,
					};
				}
				return replaceVar;
			} );

			if ( isNewReplaceVar ) {
				nextReplacementVariables = pushNewReplaceVar( nextReplacementVariables, action );
			}

			return {
				...state,
				replacementVariables: nextReplacementVariables,
			};
		}

		case REMOVE_REPLACEMENT_VARIABLE: {
			return {
				...state,
				replacementVariables: state.replacementVariables.filter( replacementVariable => {
					return replacementVariable.name !== action.name;
				} ),
			};
		}

		case REFRESH: {
			return {
				...state,
				uniqueRefreshValue: action.time,
			};
		}

		case UPDATE_WORDS_TO_HIGHLIGHT: {
			return {
				...state,
				wordsToHighlight: action.wordsToHighlight,
			};
		}

		case LOAD_SNIPPET_EDITOR_DATA:
			return {
				...state,
				data: {
					...state.data,
					title: action.data.title,
					description: action.data.description,
					slug: action.data.slug,
				},
				templates: {
					...state.templates,
					title: action.templates.title,
					description: action.templates.description,
				},
				isLoading: false,
			};
	}

	return state;
}

export default snippetEditorReducer;
