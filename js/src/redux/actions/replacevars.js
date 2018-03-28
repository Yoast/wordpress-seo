import { PREFIX } from "./prefix";

export const ADD_REPLACEVAR = `${ PREFIX }ADD_REPLACEVAR`;

export const addReplacevar = ( type, id, value ) => {
	return {
		type: ADD_REPLACEVAR,
		replacevar: {
			type,
			id,
			value,
		},
	};
};
