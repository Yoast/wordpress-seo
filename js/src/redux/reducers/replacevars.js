import {
	ADD_REPLACEVAR,
} from "../actions";

const INITIAL_STATE = {};

const reducer = ( state = INITIAL_STATE, action ) => {
	switch( action.type ) {
		case ADD_REPLACEVAR:
			return {
				...state,
				[ action.replacevar.type ]: {
					...( state[ action.replacevar.type ] || {} ),
					[ action.replacevar.id ]: action.replacevar.value,
				},
			};
	}
	return state;
};

export default reducer;
