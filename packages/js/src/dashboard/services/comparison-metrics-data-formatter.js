import { DataFormatterInterface } from "./data-formatter-interface";

/**
 * Knows how to format data.
 */
export class ComparisonMetricsDataFormatter extends DataFormatterInterface {
	/**
	 * @param {*} data The data.
	 * @param {string} name The name. Used to determine how to format.
	 * @param {Object} [context] Extra information to determine how to format.
	 * @returns {*} The formatted or original data.
	 */
	// eslint-disable-next-line no-unused-vars, complexity
	format( data, name, context = {} ) {
		switch ( name ) {
			case "impressions":
			case "clicks":
				return {
					formattedValue: this.safeNumberFormat( data.value, this.getNumberFormat().nonFractional ),
					delta: data.delta,
					formattedDelta: this.safeNumberFormat( data.delta, this.getNumberFormat().percentage ),
				};
			case "ctr":
				return {
					formattedValue: this.safeNumberFormat( data.value, this.getNumberFormat().percentage ),
					delta: data.delta,
					formattedDelta: this.safeNumberFormat( data.delta, this.getNumberFormat().percentage ),
				};
			case "position":
				return {
					formattedValue: this.safeNumberFormat( data.value, this.getNumberFormat().twoFractions ),
					delta: data.delta,
					formattedDelta: this.safeNumberFormat( data.delta, this.getNumberFormat().percentage ),
				};
			case "date":
				return new Date(
					Date.UTC( data.slice( 0, 4 ), data.slice( 4, 6 ) - 1, data.slice( 6, 8 ) )
				).toLocaleDateString(
					this.getLocale(),
					{ month: "short", day: "numeric" }
				);
			case "sessions":
				return this.safeNumberFormat( data || 0, this.getNumberFormat().nonFractional );
			case "difference":
				return this.safeNumberFormat( data, this.getNumberFormat().percentage );
			default:
				return data;
		}
	}
}
