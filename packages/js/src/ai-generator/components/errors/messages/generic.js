import { useSelect } from "@wordpress/data";
import { __, sprintf } from "@wordpress/i18n";
import PropTypes from "prop-types";
import { safeCreateInterpolateElement } from "../../../../helpers/i18n";
import { OutboundLink } from "../../../../shared-admin/components";
import { STORE_NAME_EDITOR } from "../../../constants";
import { Paragraph } from "./parts";

export const title = __( "Something went wrong", "wordpress-seo" );

/**
 * The copy for the generic fallback error (400 default, 403, 503, and any
 * unmapped code).
 *
 * @param {string} [linkStoreName] The store to read the common-errors and support links from.
 *                                  Defaults to the block editor's store; pass a different store
 *                                  name when rendering outside the block editor (e.g. the AI
 *                                  consent screen on the user profile page).
 * @returns {JSX.Element} The element.
 */
export const Body = ( { linkStoreName = STORE_NAME_EDITOR } ) => {
	const commonErrorsLink = useSelect( select => select( linkStoreName ).selectLink( "https://yoa.st/ai-common-errors" ), [ linkStoreName ] );
	const supportLink = useSelect( select => select( linkStoreName ).selectAdminLink( "?page=wpseo_page_support" ), [ linkStoreName ] );

	return (
		<Paragraph>
			{ safeCreateInterpolateElement(
				sprintf(
					/* translators: %1$s and %3$s expand to an opening tag. %2$s and %4$s expand to a closing tag. */
					__(
						"Please try again later. If this issue persists, you can learn more about possible reasons for this error on our page about %1$scommon AI feature problems and errors%2$s. In case you need further help, please %3$scontact our support team%4$s.",
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
Body.propTypes = { linkStoreName: PropTypes.string };
