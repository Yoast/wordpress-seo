import { useSelect } from "@wordpress/data";
import { __, sprintf } from "@wordpress/i18n";
import { Alert } from "@yoast/ui-library";
import { safeCreateInterpolateElement } from "../../../helpers/i18n";
import { OutboundLink } from "../../../shared-admin/components";
import { STORE_NAME_EDITOR } from "../../constants";

/**
 * @returns {JSX.Element} The element.
 */
export const RateLimitAlert = () => {
	const ratelimitLink = useSelect( select => select( STORE_NAME_EDITOR ).selectLink( "https://yoa.st/ai-generator-rate-limit-help" ), [] );

	return (
		<Alert variant="error">
			<span className="yst-block yst-font-medium">{ __( "You've reached the Yoast AI rate limit", "wordpress-seo" ) }</span>
			<p className="yst-mt-2">
				{ safeCreateInterpolateElement(
					sprintf(
						/* translators: %1$s expands to an opening tag. %2$s expands to a closing tag. */
						__(
							"You might have reached your Yoast AI rate limit for a specific time frame or your sparks limit for this month. If you have reached your rate limit, please reduce the frequency of your requests to continue using Yoast AI features. Our %1$shelp article%2$s provides guidance on effectively planning and pacing your requests for an optimized workflow.",
							"wordpress-seo-premium"
						),
						"<a>",
						"</a>"
					), {
						a: <OutboundLink variant="error" href={ ratelimitLink } />,
					}
				) }
			</p>
		</Alert>
	);
};
