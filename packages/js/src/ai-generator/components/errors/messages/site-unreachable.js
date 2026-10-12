import { __, sprintf } from "@wordpress/i18n";
import { safeCreateInterpolateElement } from "../../../../helpers/i18n";
import { OutboundLink } from "../../../../shared-admin/components";
import { Paragraph, useHelpLinks } from "./parts";

export const title = __( "Yoast AI cannot reach your site", "wordpress-seo" );

/**
 * The copy for the site-unreachable error (400 / SITE_UNREACHABLE).
 *
 * This is the informational-only variant used by the inline alert. The danger
 * modal renders three connection-aware variants instead (nudging the user to
 * connect to MyYoast); that variant logic lives in the modal, not here.
 *
 * @returns {JSX.Element} The element.
 */
export const Body = () => {
	const { commonErrorsLink, supportLink } = useHelpLinks();

	return (
		<Paragraph>
			{ safeCreateInterpolateElement(
				sprintf(
					/* translators: %1$s and %3$s expand to an opening tag. %2$s and %4$s expand to a closing tag. */
					__(
						"To use this feature, your site must be publicly accessible. This applies to both test sites and instances where your REST API is password-protected. Please ensure your site is accessible to the public and try again. Learn more on our page about %1$scommon AI feature problems and errors%2$s. In case you need further help, please %3$scontact our support team%4$s.",
						"wordpress-seo"
					),
					"<a1>",
					"</a1>",
					"<a2>",
					"</a2>"
				),
				{
					a1: <OutboundLink variant="error" href={ commonErrorsLink } />,
					a2: <OutboundLink variant="error" href={ supportLink } />,
				}
			) }
		</Paragraph>
	);
};
