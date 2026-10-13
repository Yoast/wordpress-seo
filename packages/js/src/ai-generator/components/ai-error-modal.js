/* eslint-disable complexity */
import { noop } from "lodash";
import PropTypes from "prop-types";
import {
	BadWPRequestModal,
	GenericModal,
	NotEnoughContentModal,
	RateLimitModal,
	SeoAnalysisInactiveModal,
	SiteUnreachableModal,
	SubscriptionModal,
	TimeoutModal,
	UnethicalRequestModal,
	UpgradeModal,
} from "./errors";

/**
 * Renders an AI generator error as a danger modal.
 *
 * This is the modal counterpart to `SuggestionError` (which renders the same
 * error categories as an inline alert and remains in use by other consumers).
 * Both route on the same (errorCode, errorIdentifier) pairs and draw their copy
 * from `./errors/messages`; they keep separate routing so the modal and the
 * inline alert can evolve independently. A drift-guardrail test keeps the case
 * coverage aligned.
 *
 * @param {number} errorCode The error code.
 * @param {string} [errorIdentifier=""] The error identifier.
 * @param {boolean} [isOpen=true] Whether the modal is open.
 * @param {string[]} [invalidSubscriptions=[]] The products with an invalid subscription.
 * @param {boolean} [showActions=false] Whether to show retry/close actions for retryable errors.
 * @param {function} [onRetry=noop] Called to retry the request.
 * @param {string} [errorMessage=""] The raw error message (WP request errors).
 * @param {function} [onClose=noop] Dismisses the modal.
 * @returns {JSX.Element} The element.
 */
export const AIErrorModal = ( {
	errorCode,
	errorIdentifier = "",
	isOpen = true,
	invalidSubscriptions = [],
	showActions = false,
	onRetry = noop,
	errorMessage = "",
	onClose = noop,
} ) => {
	if ( errorIdentifier === "SEO_ANALYSIS_INACTIVE" ) {
		return <SeoAnalysisInactiveModal isOpen={ isOpen } onClose={ onClose } />;
	}
	if ( errorCode === 402 || ( errorCode === 429 && errorIdentifier === "USAGE_LIMIT_REACHED" ) ) {
		return <SubscriptionModal isOpen={ isOpen } invalidSubscriptions={ invalidSubscriptions } onClose={ onClose } />;
	}

	switch ( errorCode ) {
		case 400:
			switch ( errorIdentifier ) {
				case "AI_CONTENT_FILTER":
					return <UnethicalRequestModal isOpen={ isOpen } onClose={ onClose } />;
				case "NOT_ENOUGH_CONTENT":
					return <NotEnoughContentModal isOpen={ isOpen } onClose={ onClose } />;
				case "SITE_UNREACHABLE":
					return <SiteUnreachableModal isOpen={ isOpen } onClose={ onClose } />;
				case "WP_HTTP_REQUEST_ERROR":
					return (
						<BadWPRequestModal
							isOpen={ isOpen }
							errorMessage={ errorMessage }
							showActions={ showActions }
							onRetry={ onRetry }
							onClose={ onClose }
						/>
					);
				default:
					return <GenericModal isOpen={ isOpen } showActions={ showActions } onRetry={ onRetry } onClose={ onClose } />;
			}
		case 408:
			return <TimeoutModal isOpen={ isOpen } showActions={ showActions } onRetry={ onRetry } onClose={ onClose } />;
		case 429:
			return <RateLimitModal isOpen={ isOpen } onClose={ onClose } />;
		case 410:
			return <UpgradeModal isOpen={ isOpen } onClose={ onClose } />;
		case 403:
		case 503:
		default:
			return <GenericModal isOpen={ isOpen } showActions={ showActions } onRetry={ onRetry } onClose={ onClose } />;
	}
};
AIErrorModal.propTypes = {
	errorCode: PropTypes.number.isRequired,
	errorIdentifier: PropTypes.string,
	isOpen: PropTypes.bool,
	invalidSubscriptions: PropTypes.arrayOf( PropTypes.string ),
	showActions: PropTypes.bool,
	onRetry: PropTypes.func,
	errorMessage: PropTypes.string,
	onClose: PropTypes.func,
};
