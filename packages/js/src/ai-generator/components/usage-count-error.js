/* eslint-disable complexity */
import PropTypes from "prop-types";
import {
	BadWPRequestAlert,
	GenericAlert,
	RateLimitAlert,
} from "./errors";
import { SiteUnreachableAlert } from "./errors/site-unreachable-alert";

/**
 * @param {number} errorCode The error code.
 * @param {string} errorIdentifier The error identifier.
 * @param {string[]} [invalidSubscriptions=[]] The array with names of products with an invalid subscription.
 * @param {string} [errorMessage=""] The error message.
 * @returns {JSX.Element} The element.
 */
export const UsageCountError = ( {
	errorCode,
	errorIdentifier,
	invalidSubscriptions = [],
	errorMessage = "",
} ) => {
	switch ( errorCode ) {
		case 400:
			switch ( errorIdentifier ) {
				case "SITE_UNREACHABLE":
					return <SiteUnreachableAlert />;
				case "WP_HTTP_REQUEST_ERROR":
					return <BadWPRequestAlert errorMessage={ errorMessage } />;
				default:
					return <GenericAlert />;
			}
		case 429:
			// If we get 429 with subscription then we show the alert, otherwise lets show the upsell.
			return invalidSubscriptions.length ? <RateLimitAlert /> : null;
		default:
			return <GenericAlert />;
	}
};
UsageCountError.propTypes = {
	errorCode: PropTypes.number.isRequired,
	errorIdentifier: PropTypes.string.isRequired,
	invalidSubscriptions: PropTypes.arrayOf( PropTypes.string ),
	errorMessage: PropTypes.string,
};
