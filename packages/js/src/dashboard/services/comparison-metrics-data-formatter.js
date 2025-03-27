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
					formattedValue: DataFormatterInterface.safeNumberFormat( data.value, this.numberFormat.nonFractional ),
					delta: data.delta,
					formattedDelta: DataFormatterInterface.safeNumberFormat( data.delta, this.numberFormat.percentage ),
				};
			case "ctr":
				if ( data === null ) {
					return {
						formattedValue: "-",
						delta: null,
						formattedDelta: "-",
					};
				}
				return {
					formattedValue: DataFormatterInterface.safeNumberFormat( data.value, this.numberFormat.percentage ),
					delta: data.delta,
					formattedDelta: DataFormatterInterface.safeNumberFormat( data.delta, this.numberFormat.percentage ),
				};
			case "position":
				if ( data === null ) {
					return {
						formattedValue: "-",
						delta: null,
						formattedDelta: "-",
					};
				}
				return {
					formattedValue: DataFormatterInterface.safeNumberFormat( data.value, this.numberFormat.twoFractions ),
					delta: data.delta,
					formattedDelta: DataFormatterInterface.safeNumberFormat( data.delta, this.numberFormat.percentage ),
				};
			case "date":
				return new Date(
					Date.UTC( data.slice( 0, 4 ), data.slice( 4, 6 ) - 1, data.slice( 6, 8 ) )
				).toLocaleDateString(
					this.locale,
					{ month: "short", day: "numeric" }
				);
			case "sessions":
				return DataFormatterInterface.safeNumberFormat( data || 0, this.numberFormat.nonFractional );
			case "difference":
				return DataFormatterInterface.safeNumberFormat( data, this.numberFormat.percentage );
			default:
				return data;
		}
	}
}
