import { useSelect } from "@wordpress/data";
import { __, sprintf } from "@wordpress/i18n";
import { Alert } from "@yoast/ui-library";
import { safeCreateInterpolateElement } from "../../../helpers/i18n";
import { OutboundLink } from "../../../shared-admin/components";
import { STORE_NAME_EDITOR } from "../../constants";

/**
 * @returns {JSX.Element} The element.
 */
export const GenericAlert = () => {
	const commonErrorsLink = useSelect( select => select( STORE_NAME_EDITOR ).selectLink( "https://yoa.st/ai-common-errors" ), [] );
	const supportLink = useSelect( select => select( STORE_NAME_EDITOR ).selectAdminLink( "?page=wpseo_page_support" ), [] );

	return (
		<Alert variant="error">
			<span className="yst-block yst-font-medium">{ __( "Something went wrong", "wordpress-seo" ) }</span>
			<p className="yst-mt-2">
				{ safeCreateInterpolateElement(
					sprintf(
						/* translators: %1$s and %3$s expand to an opening tag. %2$s and %4$s expand to a closing tag. */
						__(
							"Please try again later. If this issue persists, you can learn more about possible reasons for this error on our page about %1$scommon AI feature problems and errors%2$s. In case you need further help, please %3$scontact our support team%4$s.", "wordpress-seo" ),
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
			</p>
		</Alert>
	);
};
