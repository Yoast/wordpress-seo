import { __, sprintf } from "@wordpress/i18n";
import { safeCreateInterpolateElement } from "../../../../helpers/i18n";
import { OutboundLink } from "../../../../shared-admin/components";
import { Paragraph, useHelpLinks } from "./parts";

export const title = __( "Connection timeout", "wordpress-seo" );

/**
 * The copy for the connection-timeout error (408).
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
						"It seems that a connection timeout has occurred. Please check your internet connection and try again later. Learn more on our page about %1$scommon AI feature problems and errors%2$s. In case you need further help, please %3$scontact our support team%4$s.",
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
