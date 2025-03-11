import { DataFormatterInterface } from "../../../src/dashboard/services/data-formatter-interface";

/**
 * Fake implementation of the data formatter interface.
 */
export class FakeDataFormatter extends DataFormatterInterface {
	/**
	 * @param {*} data The data.
	 * @param {string} name The name. Used to determine how to format.
	 * @param {Object} [context] Extra information to determine how to format.
	 * @returns {*} The formatted or original
	 */
	// eslint-disable-next-line no-unused-vars
	format( data, name, context = {} ) {
		return data;
	}
}
