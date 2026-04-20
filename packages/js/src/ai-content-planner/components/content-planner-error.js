/* eslint-disable complexity */
import { __ } from "@wordpress/i18n";
import { Button, useModalContext } from "@yoast/ui-library";
import { noop } from "lodash";
import PropTypes from "prop-types";
import {
	BadWPRequestAlert,
	GenericAlert,
	RateLimitAlert,
	TimeoutAlert,
} from "../../ai-generator/components/errors";
import { SiteUnreachableAlert } from "../../ai-generator/components/errors/site-unreachable-alert";

/**
 * @param {number} errorCode The error code.
 * @param {string} [errorIdentifier=""] The error identifier.
 * @param {string} [errorMessage=""] The error message.
 * @param {function} [onRetry=noop] Called to retry.
 * @returns {JSX.Element} The element.
 */
export const ContentPlannerError = ( {
	errorCode,
	errorIdentifier = "",
	errorMessage = "",
	onRetry = noop,
} ) => {
	const { onClose } = useModalContext();

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

ContentPlannerError.propTypes = {
	errorCode: PropTypes.number.isRequired,
	errorIdentifier: PropTypes.string,
	errorMessage: PropTypes.string,
	onRetry: PropTypes.func,
};
