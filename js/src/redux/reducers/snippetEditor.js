import { DEFAULT_MODE } from "yoast-components";
import {
	SNIPPET_EDITOR_SWITCH_MODE,
	SNIPPET_EDITOR_UPDATE_DATA
} from "../actions/snippetEditor";

const INITIAL_STATE = {
	mode: DEFAULT_MODE,
	data: {
		title: "",
		slug: "",
		description: "",
	},
};

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
	}

	return state;
}

export default snippetEditorReducer;
