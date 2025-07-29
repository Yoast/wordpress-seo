import { useSelect } from "@wordpress/data";
import { __, sprintf } from "@wordpress/i18n";
import { Alert } from "@yoast/ui-library";
import PropTypes from "prop-types";
import { safeCreateInterpolateElement } from "../../../helpers/i18n";
import { OutboundLink } from "../../../shared-admin/components";
import { STORE_NAME_EDITOR } from "../../constants";

/**
 * @param {string} [errorMessage=""] The error message to display.
 * @returns {JSX.Element} The element.
 */
export const BadWPRequestAlert = ( { errorMessage = "" } ) => {
	const supportLink = useSelect( select => select( STORE_NAME_EDITOR ).selectAdminLink( "?page=wpseo_page_support" ), [] );

	return (
		<Alert variant="error">
			<span className="yst-block yst-font-medium">{ __( "Something went wrong", "wordpress-seo" ) }</span>
			<p className="yst-mt-2">
				{
					sprintf(
						/* translators: %s is the error response of the request. */
						__( "The request came back with the following error: '%s'.", "wordpress-seo" ),
						errorMessage
					)
				}
			</p>
			<p className="yst-mt-2">
				{ safeCreateInterpolateElement(
					sprintf(
						/* translators: %1$s expands to an opening tag. %2$s expands to a closing tag. */
						__( "Please try again later. If the issue persists, please %1$scontact our support team%2$s.", "wordpress-seo" ),
						"<a>",
						"</a>"
					),
					{
						a: <OutboundLink variant="error" href={ supportLink } />,
					}
				) }
			</p>
		</Alert>
	);
};

BadWPRequestAlert.propTypes = {
	errorMessage: PropTypes.string,
};
