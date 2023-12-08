import getDefaultReplacementVariables from "../../values/defaultReplaceVariables";
import {
	SWITCH_MODE,
	UPDATE_DATA,
	UPDATE_REPLACEMENT_VARIABLE,
	UPDATE_REPLACEMENT_VARIABLES_BATCH,
	HIDE_REPLACEMENT_VARIABLES,
	REMOVE_REPLACEMENT_VARIABLE,
	CUSTOM_FIELD_RESULTS,
	REFRESH,
	UPDATE_WORDS_TO_HIGHLIGHT,
	LOAD_SNIPPET_EDITOR_DATA,
} from "../actions/snippetEditor";
import { pushNewReplaceVar, replaceSpaces, createLabelFromName } from "../../helpers/replacementVariableHelpers";
import { firstToUpperCase } from "../../helpers/stringHelpers";

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
 * Updates a replacement variable, adding it if it doesn't exist.
 *
 * @param {Object} state The current state.
 * @param {Object} action The action that was just dispatched.
 *
 * @returns {Object} The new state.
 */
function updateReplacementVariable( state, action ) {
	let isNewReplaceVar = true;
	let nextReplacementVariables = state.replacementVariables.map( ( replaceVar ) => {
		if ( replaceVar.name === action.name ) {
			isNewReplaceVar = false;
			return {
				name: action.name,
				label: action.label || replaceVar.label,
				value: action.value,
				hidden: replaceVar.hidden,
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

/**
 * Updates a replacement variables in batch, adding it if it doesn't exist.
 *
 * @param {Object} state The current state.
 * @param {Object} action The action that was just dispatched.
 *
 * @returns {Object} The new state.
 */
function updateReplacementVariablesBatch( state, action ) {
	const existingVariables = {};
	const nextReplacementVariables = state.replacementVariables.map( ( replaceVar ) => {
		const updatedVariable = action.updatedVariables[ replaceVar.name ];
		if ( updatedVariable ) {
			existingVariables[ replaceVar.name ] = true;
			return {
				name: replaceVar.name,
				label: updatedVariable.label || replaceVar.label,
				value: updatedVariable.value,
				hidden: replaceVar.hidden,
			};
		}

		return replaceVar;
	} );

	Object.keys( action.updatedVariables ).forEach( ( name ) => {
		if ( ! existingVariables[ name ] ) {
			nextReplacementVariables.push( {
				name,
				label: action.updatedVariables[ name ].label || createLabelFromName( name ),
				value: action.updatedVariables[ name ].value,
				hidden: false,
			} );
		}
	} );

	return {
		...state,
		replacementVariables: nextReplacementVariables,
	};
}

/**
 * Updates replacement variables based off search results.
 *
 * @param {Object} state The current state.
 * @param {Object} action The action that was just dispatched.
 *
 * @returns {Object} The new state.
 */
function customFieldResults( state, action ) {
	// Filter out any already existing custom fields as data from server is outdated by default.
	const results = action.results.filter( meta => {
		return ! state.replacementVariables.some( replaceVar => replaceVar.name === ( "cf_" + meta.key ) );
	} );

	if ( results.length === 0 ) {
		return state;
	}

	const nextReplacementVariables = [
		...results.map( meta => ( {
			name: "cf_" + replaceSpaces( meta.key ),
			label: firstToUpperCase( meta.key + " (custom field)" ),
			value: meta.value,
			hidden: false,
		} ) ),
		...state.replacementVariables,
	];


	return {
		...state,
		replacementVariables: nextReplacementVariables,
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

		case UPDATE_REPLACEMENT_VARIABLE:
			return updateReplacementVariable( state, action );

		case UPDATE_REPLACEMENT_VARIABLES_BATCH:
			return updateReplacementVariablesBatch( state, action );

		case CUSTOM_FIELD_RESULTS:
			return customFieldResults( state, action );

		case HIDE_REPLACEMENT_VARIABLES: {
			const nextReplacementVariables = state.replacementVariables.map( ( replaceVar ) => {
				return {
					name: replaceVar.name,
					label: replaceVar.label,
					value: replaceVar.value,
					hidden: action.data.includes( replaceVar.name ),
				};
			} );

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
