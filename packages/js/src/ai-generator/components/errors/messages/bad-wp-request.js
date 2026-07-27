import { useSelect } from "@wordpress/data";
import { __, sprintf } from "@wordpress/i18n";
import PropTypes from "prop-types";
import { safeCreateInterpolateElement } from "../../../../helpers/i18n";
import { OutboundLink } from "../../../../shared-admin/components";
import { STORE_NAME_EDITOR } from "../../../constants";
import { Paragraph } from "./parts";

export const title = __( "Something went wrong", "wordpress-seo" );

/**
 * The copy for the bad-WP-request error (400 / WP_HTTP_REQUEST_ERROR).
 *
 * @param {string} [errorMessage=""] The raw error message returned by the request.
 * @returns {JSX.Element} The element.
 */
export const Body = ( { errorMessage = "" } ) => {
	const supportLink = useSelect( select => select( STORE_NAME_EDITOR ).selectAdminLink( "?page=wpseo_page_support" ), [] );

	return (
		<>
			<Paragraph>
				{ sprintf(
					/* translators: %s is the error response of the request. */
					__( "The request came back with the following error: '%s'.", "wordpress-seo" ),
					errorMessage
				) }
			</Paragraph>
			<Paragraph>
				{ safeCreateInterpolateElement(
					sprintf(
						/* translators: %1$s expands to an opening tag. %2$s expands to a closing tag. */
						__( "Please try again later. If the issue persists, please %1$scontact our support team%2$s.", "wordpress-seo" ),
						"<a>",
						"</a>"
					),
					{ a: <OutboundLink variant="error" href={ supportLink } /> }
				) }
			</Paragraph>
		</>
	);
};
Body.propTypes = { errorMessage: PropTypes.string };
