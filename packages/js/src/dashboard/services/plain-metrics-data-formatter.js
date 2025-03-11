import { SCORE_META } from "../scores/score-meta";
import { DataFormatterInterface } from "./data-formatter-interface";

/**
 * Knows how to format data.
 */
export class PlainMetricsDataFormatter extends DataFormatterInterface {
	/**
	 * @param {string} link The link.
	 * @returns {string} The formatted or original link.
	 */
	formatLandingPage( link ) {
		const url = DataFormatterInterface.safeUrl( link );
		if ( url === null ) {
			return link;
		}

		// Dropping: hostname, protocol, port, search and hash.
		return url.pathname;
	}

	/**
	 * @param {*} data The data.
	 * @param {string} name The name. Used to determine how to format.
	 * @param {Object} [context] Extra information to determine how to format.
	 * @returns {*} The formatted or original data.
	 */
	format( data, name, context = {} ) { // eslint-disable-line complexity
		switch ( name ) {
			case "subject":
				switch ( context.widget ) {
					case "topPages":
						return this.formatLandingPage( data );
					case "topQueries":
						return String( data );
					default:
						return data;
				}
			case "clicks":
			case "impressions":
				return DataFormatterInterface.safeNumberFormat( data, this.numberFormat.nonFractional );
			case "ctr":
				return DataFormatterInterface.safeNumberFormat( data, this.numberFormat.percentage );
			case "position":
				return DataFormatterInterface.safeNumberFormat( data, this.numberFormat.twoFractions );
			case "seoScore":
				return Object.keys( SCORE_META ).includes( data ) ? data : "notAnalyzed";
			default:
				return data;
		}
	}
}
