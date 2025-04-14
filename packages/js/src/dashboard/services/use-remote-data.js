import { createSlice } from "@reduxjs/toolkit";
import { useEffect, useReducer, useRef } from "@wordpress/element";
import { identity } from "lodash";

const slice = createSlice( {
	name: "data",
	initialState: {
		data: undefined, // eslint-disable-line no-undefined
		error: undefined, // eslint-disable-line no-undefined
		isPending: true,
	},
	reducers: {
		setData( state, action ) {
			state.data = action.payload;
			state.error = undefined; // eslint-disable-line no-undefined
			state.isPending = false;
		},
		setError( state, action ) {
			state.error = action.payload;
			state.isPending = false;
		},
		setIsPending( state, action ) {
			state.isPending = Boolean( action.payload );
		},
	},
} );

/**
 * @param {function(RequestInit): any} doFetch The fetch function.
 * @param {function(any): any} prepareData Process data.
 * @returns {{data?: any, error?: Error, isPending: boolean}} The data state.
 */
export const useRemoteData = ( doFetch, prepareData = identity ) => {
	const [ state, dispatch ] = useReducer( slice.reducer, {}, slice.getInitialState );
	/** @type {MutableRefObject<AbortController>} */
	const controller = useRef();

	useEffect( () => {
		// Abort any ongoing request first.
		controller.current?.abort();
		controller.current = new AbortController();

		dispatch( slice.actions.setIsPending( true ) );
		doFetch( { signal: controller.current?.signal } )
			.then( ( response ) => dispatch( slice.actions.setData( prepareData( response ) ) ) )
			.catch( ( e ) => {
				// Ignore abort errors, because they are expected and not to be reflected in the UI.
				if ( e?.name !== "AbortError" ) {
					dispatch( slice.actions.setError( e ) );
				}
			} );

		return () => controller.current?.abort();
	}, [ doFetch ] );

	return state;
};
