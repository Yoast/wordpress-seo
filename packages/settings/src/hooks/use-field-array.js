import { useSelect, useDispatch } from "@wordpress/data";

import { REDUX_STORE_KEY } from "../constants";

/**
 * @param {String} path Dot syntax path to location in store, ie. key.nestedKey.index
 * @returns {FieldArrayInterface} Current items at path in store and some dispatch helpers for modifying items
 */
export default ( path ) => {
	const items = useSelect( ( select ) => select( REDUX_STORE_KEY ).getData( path ) );
	const { replaceArrayData } = useDispatch( REDUX_STORE_KEY );

	/**
     * @param {String|Number} item Item to add to field
     * @returns {void}
     */
	const add = ( item = "" ) => replaceArrayData( path, [ ...items, item ] );
	/**
     * @param {Number} index Index to insert item at
     * @param {String|Number} item Item to insert in field array
     * @returns {void}
     */
	const insert = ( index, item = "" ) => {
		// Do not modify reference to actual state
		const newState = [ ...items ];
		newState.splice( index, 0, item );
		replaceArrayData( path, newState );
	};
	/**
     * @param {Number} index Index to remove item from field array
     * @returns {void}
     */
	const remove = ( index ) => {
		// Do not modify reference to actual state
		const newState = [ ...items ];
		newState.splice( index, 1 );
		replaceArrayData( path, newState );
	};

	return {
		items,
		add,
		insert,
		remove,
	};
};
