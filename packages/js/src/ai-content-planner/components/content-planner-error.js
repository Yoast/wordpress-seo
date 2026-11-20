/* eslint-disable complexity */
import { useSelect } from "@wordpress/data";
import { __ } from "@wordpress/i18n";
import { Button, useModalContext } from "@yoast/ui-library";
import { noop } from "lodash";
import {
	BadWPRequestAlert,
	GenericAlert,
	RateLimitAlert,
	SubscriptionError,
	TimeoutAlert,
} from "../../ai-generator/components/errors";
import { SiteUnreachableAlert } from "../../ai-generator/components/errors/site-unreachable-alert";

/**
 * @param {Object} props Component props.
 * @param {number} props.errorCode The error code.
 * @param {string} [props.errorIdentifier=""] The error identifier.
 * @param {string} [props.errorMessage=""] The error message.
 * @param {string[]} [props.missingLicenses=[]] Products with an invalid subscription.
 * @param {Function} [props.onRetry=noop] Called to retry.
 *
 * @returns {JSX.Element} The element.
 */
export const ContentPlannerError = ( {
	errorCode,
	errorIdentifier = "",
	errorMessage = "",
	missingLicenses = [],
	onRetry = noop,
} ) => {
	const { onClose } = useModalContext();
	const isPremium = useSelect( ( select ) => select( "yoast-seo/editor" ).getIsPremium(), [] );

	// Premium installed but licence missing/expired: surface the renew/activate flow.
	// The backend returns 402 when the licence is invalid, and 429 with USAGE_LIMIT_REACHED
	// once a no-licence Premium user exhausts the free sparks (Too_Many_Requests_Exception
	// extends Payment_Required_Exception in the PHP layer).
	// Free-only sites are handled earlier by the Approve modal upsell, so they fall through here.
	const isSubscriptionRequired = isPremium && (
		errorCode === 402 ||
		( errorCode === 429 && errorIdentifier === "USAGE_LIMIT_REACHED" )
	);
	if ( isSubscriptionRequired ) {
		// If the backend response has no `missingLicenses` we fall back to "Yoast SEO Premium" so the alert
		// always renders with a product name, instead of "active undefined subscription".
		const invalidSubscriptions = missingLicenses.length > 0 ? missingLicenses : [ "Yoast SEO Premium" ];
		return <SubscriptionError invalidSubscriptions={ invalidSubscriptions } />;
	}

	let alert;
	switch ( errorCode ) {
		case 400:
			switch ( errorIdentifier ) {
				case "SITE_UNREACHABLE":
					alert = <SiteUnreachableAlert />;
					break;
				case "WP_HTTP_REQUEST_ERROR":
					alert = <BadWPRequestAlert errorMessage={ errorMessage } />;
					break;
				default:
					alert = <GenericAlert />;
			}
			break;
		case 408:
			alert = <TimeoutAlert />;
			break;
		case 429:
			alert = <RateLimitAlert />;
			break;
		default:
			alert = <GenericAlert />;
	}

	return (
		<>
			{ alert }
			<div className="yst-mt-6 yst-mb-1 yst-flex yst-space-x-3 rtl:yst-space-x-reverse yst-place-content-end">
				<Button variant="secondary" onClick={ onClose }>
					{ __( "Close", "wordpress-seo" ) }
				</Button>
				<Button variant="primary" onClick={ onRetry }>
					{ __( "Try again", "wordpress-seo" ) }
				</Button>
			</div>
		</>
	);
};
