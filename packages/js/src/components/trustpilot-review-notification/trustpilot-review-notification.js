import { useSelect } from "@wordpress/data";
import { __ } from "@wordpress/i18n";
import { useRootContext } from "@yoast/externals/contexts";
import { makeOutboundLink } from "@yoast/helpers";
import { PersistentDismissableNotification } from "../../containers/PersistentDismissableNotification";
import { ALERT_KEY, STORE_NAME } from "./constants";
import { useTrustpilotReviewNotification } from "./hooks";

const OutboundLink = makeOutboundLink();

/**
 * The Trustpilot review notification.
 * @returns {JSX.Element|null} The notification or null.
 */
export const TrustpilotReviewNotification = () => {
	const { shouldShow, dismiss } = useTrustpilotReviewNotification();
	const { locationContext } = useRootContext();
	const trustpilotLink = useSelect( ( select ) => select( STORE_NAME ).selectLink( "https://yoa.st/trustpilot-review", { context: locationContext } ), [ locationContext ] );

	return (
		<PersistentDismissableNotification
			alertKey={ ALERT_KEY }
			store={ STORE_NAME }
			id={ ALERT_KEY }
			title={ __( "Show Yoast SEO some love!", "wordpress-seo" ) }
			hasIcon={ false }
			isAlertDismissed={ ! shouldShow }
			onDismissed={ dismiss }
		>
			{ __( "Happy with the plugin?", "wordpress-seo" ) }
			{ " " }
			<OutboundLink href={ trustpilotLink } rel="noopener noreferrer">
				{ __( "Leave a quick review", "wordpress-seo" ) }
			</OutboundLink>
			{ "." }
		</PersistentDismissableNotification>
	);
};
