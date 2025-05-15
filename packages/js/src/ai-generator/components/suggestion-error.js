/* eslint-disable complexity */
import { Fragment } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { Button, useModalContext } from "@yoast/ui-library";
import { noop } from "lodash";
import PropTypes from "prop-types";
import {
	BadWPRequestAlert,
	GenericAlert,
	NotEnoughContentAlert,
	RateLimitAlert,
	SubscriptionError,
	TimeoutAlert,
	UnethicalRequestAlert,
	UpgradeAlert,
} from "./errors";
import { SiteUnreachableAlert } from "./errors/site-unreachable-alert";

/**
 * @param {JSX.node} children The content.
 * @param {function} onRetry Called to retry.
 * @returns {JSX.Element} The element.
 */
export const WithActions = ( { children, onRetry } ) => {
	const { onClose } = useModalContext();

	return (
		<Fragment>
			{ children }
			<div className="yst-mt-6 yst-mb-1 yst-flex yst-space-x-3 rtl:yst-space-x-reverse yst-place-content-end">
				<Button variant="secondary" onClick={ onClose }>
					{ __( "Close", "wordpress-seo-premium" ) }
				</Button>
				<Button variant="primary" onClick={ onRetry }>
					{ __( "Try again", "wordpress-seo-premium" ) }
				</Button>
			</div>
		</Fragment>
	);
};
WithActions.propTypes = {
	children: PropTypes.node.isRequired,
	onRetry: PropTypes.func.isRequired,
};

/**
 * @param {number} errorCode The error code.
 * @param {string} errorIdentifier The error identifier.
 * @param {string[]} invalidSubscriptions The array with names of products with an invalid subscription.
 * @param {boolean} [showActions=false] Whether to show actions.
 * @param {function} [onRetry] Called to retry.
 * @param {string} [errorMessage] The error message.
 * @returns { JSX.Element } The element.
 */
export const SuggestionError = ( { errorCode, errorIdentifier, invalidSubscriptions, showActions, onRetry, errorMessage } ) => {
	switch ( errorCode ) {
		case 400:
			switch ( errorIdentifier ) {
				case "AI_CONTENT_FILTER":
					return <UnethicalRequestAlert />;
				case "NOT_ENOUGH_CONTENT":
					return <NotEnoughContentAlert />;
				case "SITE_UNREACHABLE":
					return <SiteUnreachableAlert />;
				case "WP_HTTP_REQUEST_ERROR":
					return showActions
						? <WithActions onRetry={ onRetry }><BadWPRequestAlert errorMessage={ errorMessage } /></WithActions>
						: <BadWPRequestAlert errorMessage={ errorMessage } />;
				default:
					return showActions
						? <WithActions onRetry={ onRetry }><GenericAlert /></WithActions>
						: <GenericAlert />;
			}
		case 402:
			// Note: this error always has actions. There is an exception outside of here to handle this.
			return <SubscriptionError invalidSubscriptions={ invalidSubscriptions } />;
		case 408:
			return showActions
				? <WithActions onRetry={ onRetry }><TimeoutAlert /></WithActions>
				: <TimeoutAlert />;
		case 429:
			return <RateLimitAlert />;
		case 410:
			return <UpgradeAlert />;
		case 403:
		case 503:
		default:
			return showActions
				? <WithActions onRetry={ onRetry }><GenericAlert /></WithActions>
				: <GenericAlert />;
	}
};
SuggestionError.propTypes = {
	errorCode: PropTypes.number.isRequired,
	errorIdentifier: PropTypes.string.isRequired,
	invalidSubscriptions: PropTypes.array,
	showActions: PropTypes.bool,
	onRetry: PropTypes.func,
	errorMessage: PropTypes.string,
};
SuggestionError.defaultProps = {
	showActions: false,
	onRetry: noop,
	invalidSubscriptions: [],
	errorMessage: "",
};
