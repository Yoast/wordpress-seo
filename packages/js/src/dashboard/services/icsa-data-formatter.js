import { DataFormatterInterface } from "./data-formatter-interface";

/**
 * Knows how to format data.
 */
export class IcsaDataFormatter  extends DataFormatterInterface {
	/**
	 * @param {*} data The data.
	 * @param {string} name The name. Used to determine how to format.
	 * @param {Object} [context] Extra information to determine how to format.
	 * @returns {*} The formatted or original data.
	 */
	// eslint-disable-next-line no-unused-vars
	format( data, name, context = {} ) {
		switch ( name ) {
			case "impressions":
			case "clicks":
				return {
					value: this.safeNumberFormat( data.value, this.getNumberFormat().nonFractional ),
					delta: this.safeNumberFormat( data.delta, this.getNumberFormat().twoFractions ),
				};
			case "ctr":
				return {
					value: this.safeNumberFormat( data.value, this.getNumberFormat().percentage ),
					delta: this.safeNumberFormat( data.delta, this.getNumberFormat().twoFractions ),
				};
			case "position":
				return {
					value: this.safeNumberFormat( data.value, this.getNumberFormat().twoFractions ),
					delta: this.safeNumberFormat( data.delta, this.getNumberFormat().twoFractions ),
				};
			default:
				return data;
		}
	}
}
