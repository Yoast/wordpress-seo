import { SCORE_META } from "../scores/score-meta";
import { DataFormatterInterface } from "./data-formatter-interface";

/**
 * Knows how to format data.
 */
export class TopPagesDataFormatter  extends DataFormatterInterface {
	/**
	 * @param {*} data The data.
	 * @param {string} name The name. Used to determine how to format.
	 * @param {Object} [context] Extra information to determine how to format.
	 * @returns {*} The formatted or original data.
	 */
	// eslint-disable-next-line no-unused-vars
	format( data, name, context = {} ) { // eslint-disable-line complexity
		switch ( name ) {
			case "subject":
				return this.formatLandingPage( data );
			case "clicks":
			case "impressions":
				return this.safeNumberFormat( data, this.getNumberFormat().nonFractional );
			case "ctr":
				return this.safeNumberFormat( data, this.getNumberFormat().percentage );
			case "position":
				return this.safeNumberFormat( data, this.getNumberFormat().twoFractions );
			case "seoScore":
				return Object.keys( SCORE_META ).includes( data ) ? data : "notAnalyzed";
			default:
				return data;
		}
	}
}
