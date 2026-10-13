import { __, sprintf } from "@wordpress/i18n";
import { safeCreateInterpolateElement } from "../../../../helpers/i18n";
import { OutboundLink } from "../../../../shared-admin/components";
import { Paragraph, useHelpLinks } from "./parts";

export const title = __( "Not enough content", "wordpress-seo" );

/**
 * The copy for the not-enough-content error (400 / NOT_ENOUGH_CONTENT).
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
						"Please add more content to ensure a valuable AI suggestion. Learn more on our page about %1$scommon AI feature problems and errors%2$s. In case you need further help, please %3$scontact our support team%4$s.",
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
