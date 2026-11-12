/* eslint-disable complexity */
import {
	BadWPRequestAlert,
	GenericAlert,
	RateLimitAlert,
} from "./errors";
import { SiteUnreachableAlert } from "./errors/site-unreachable-alert";

/**
 * @param {Object} props Component props.
 * @param {number} props.errorCode The error code.
 * @param {string} [props.errorIdentifier=""] The error identifier.
 * @param {string} [props.errorMessage=""] The error message.
 *
 * @returns {JSX.Element} The element.
 */
export const UsageCountError = ( {
	errorCode,
	errorIdentifier = "",
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
			return <RateLimitAlert />;
		default:
			return <GenericAlert />;
	}
};
