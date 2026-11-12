/* eslint-disable complexity */
import { noop } from "lodash";
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
 * @param {Object} props Component props.
 * @param {number} props.errorCode The error code.
 * @param {string} [props.errorIdentifier=""] The error identifier.
 * @param {boolean} [props.isOpen=true] Whether the modal is open.
 * @param {string[]} [props.invalidSubscriptions=[]] The products with an invalid subscription.
 * @param {boolean} [props.showActions=false] Whether to show retry/close actions for retryable errors.
 * @param {Function} [props.onRetry=noop] Called to retry the request.
 * @param {string} [props.errorMessage=""] The raw error message (WP request errors).
 * @param {Function} [props.onClose=noop] Dismisses the modal.
 *
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
