import { useSelect } from "@wordpress/data";
import { __, sprintf } from "@wordpress/i18n";
import { safeCreateInterpolateElement } from "../../../../helpers/i18n";
import { OutboundLink } from "../../../../shared-admin/components";
import { STORE_NAME_EDITOR } from "../../../constants";
import { Paragraph } from "./parts";

export const title = __( "Usage policy violation", "wordpress-seo" );

/**
 * The copy for the content-filter error (400 / AI_CONTENT_FILTER).
 *
 * @returns {JSX.Element} The element.
 */
export const Body = () => {
	const supportLink = useSelect( select => select( STORE_NAME_EDITOR ).selectAdminLink( "?page=wpseo_page_support" ), [] );

	return (
		<Paragraph>
			{ safeCreateInterpolateElement(
				sprintf(
					/* translators: %1$s, %2$s, %3$s, %4$s are anchor tags. %5$s expands to OpenAI. */
					__(
						"Due to %5$s's strict ethical guidelines and %1$susage policies%2$s, we cannot generate suggestions for the content on this page. If you intend to use AI, kindly avoid the use of explicit, violent, copyrighted, or sexually explicit content. In case you need further help, please %3$scontact our support team%4$s.",
						"wordpress-seo"
					),
					"<a1>",
					"</a1>",
					"<a2>",
					"</a2>",
					"OpenAI"
				),
				{
					a1: <OutboundLink variant="error" href="https://openai.com/policies/usage-policies" />,
					a2: <OutboundLink variant="error" href={ supportLink } />,
				}
			) }
		</Paragraph>
	);
};
