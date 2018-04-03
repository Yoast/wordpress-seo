/* global wp */
import { PREFIX } from "./prefix";

export const GET_REPLACEVAR_REQUEST = `${ PREFIX }GET_REPLACEVAR_REQUEST`;
export const GET_REPLACEVAR_SUCCESS = `${ PREFIX }GET_REPLACEVAR_SUCCESS`;
export const GET_REPLACEVAR_FAILURE = `${ PREFIX }GET_REPLACEVAR_FAILURE`;

export const getParentTitle = ( id ) => {
	return ( dispatch ) => {
		const type = "parentTitle";
		dispatch( {
			type: GET_REPLACEVAR_REQUEST,
			replacevar: {
				type,
				id,
			},
		} );
		const model = new wp.api.models.Page( { id: id } );
		model.fetch( { data: { _fields: [ "title" ] } } ).done( data => {
			dispatch( {
				type: GET_REPLACEVAR_SUCCESS,
				replacevar: {
					type,
					id,
					value: data.title.rendered,
				},
			} );
		} ).fail( () => {
			dispatch( {
				type: GET_REPLACEVAR_FAILURE,
				replacevar: {
					type,
					id,
				},
			} );
		} );
	};
};
