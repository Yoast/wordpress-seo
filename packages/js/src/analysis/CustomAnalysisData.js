import {
	isFunction,
	merge,
} from "lodash-es";

/**
 * Gets data from custom callback functions.
 */
export default class CustomAnalysisData {
	/**
	 * Initializes the CustomAnalysisData class.
	 */
	constructor() {
		this._callbacks = [];
		this.register = this.register.bind( this );
	}

	/**
	 * Registers a function as custom analysis data retriever.
	 *
	 * Checks whether the callback is a function and if so, adds it to the array
	 * of callbacks. Each callback should return a data object.
	 *
	 * @param {Function} callback The callback function to add.
	 *
	 * @returns {void}
	 */
	register( callback ) {
		if ( isFunction( callback ) ) {
			this._callbacks.push( callback );
		}
	}

	/**
	 * Merges the data of all callback functions.
	 *
	 * @returns {Object} The combined data of all callback functions.
	 */
	getData() {
		let data = {};
		this._callbacks.forEach( ( fetchData ) => {
			data = merge( data, fetchData() );
		} );
		return data;
	}
}
