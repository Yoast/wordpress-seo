import {
	GET_REPLACEVAR_REQUEST,
	GET_REPLACEVAR_SUCCESS,
	GET_REPLACEVAR_FAILURE,
} from "../actions";

const INITIAL_STATE = {};

const reducer = ( state = INITIAL_STATE, action ) => {
	switch( action.type ) {
		case GET_REPLACEVAR_REQUEST:
			return {
				...state,
				[ action.replacevar.type ]: {
					...( state[ action.replacevar.type ] || {} ),
					[ action.replacevar.id ]: {
						value: action.replacevar.value,
						isLoading: true,
						isLoaded: false,
						hasError: false,
					},
				},
			};
		case GET_REPLACEVAR_SUCCESS:
			return {
				...state,
				[ action.replacevar.type ]: {
					...( state[ action.replacevar.type ] || {} ),
					[ action.replacevar.id ]: {
						value: action.replacevar.value,
						isLoading: false,
						isLoaded: true,
						hasError: false,
					},
				},
			};
		case GET_REPLACEVAR_FAILURE:
			return {
				...state,
				[ action.replacevar.type ]: {
					...( state[ action.replacevar.type ] || {} ),
					[ action.replacevar.id ]: {
						value: action.replacevar.value,
						isLoading: false,
						isLoaded: false,
						hasError: true,
					},
				},
			};
	}
	return state;
};

export default reducer;
