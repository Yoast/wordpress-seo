import { __, sprintf } from "@wordpress/i18n";
import { Alert } from "@yoast/ui-library";
import { useSelect } from "@wordpress/data";
import { STORE_NAME_EDITOR } from "../../../shared-admin/constants";
import { OutboundLink } from "../../../shared-admin/components";
import { safeCreateInterpolateElement } from "../../../helpers/safeCreateInterpolateElement";

/**
 * @returns {JSX.Element} The element.
 */
export const SiteUnreachableAlert = () => {
	const commonErrorsLink = useSelect( select => select( STORE_NAME_EDITOR.free ).selectLink( "https://yoa.st/ai-common-errors" ), [] );
	const supportLink = useSelect( select => select( STORE_NAME_EDITOR.free ).selectAdminLink( "?page=wpseo_page_support" ), [] );

	return (
		<Alert variant="error">
			<span className="yst-block yst-font-medium">{ __( "Yoast AI cannot reach your site", "wordpress-seo-premium" ) }</span>
			<p className="yst-mt-2">
				{ safeCreateInterpolateElement(
					sprintf(
						/* translators: %1$s and %3$s expand to an opening tag. %2$s and %4$s expand to a closing tag. */
						__(
							// eslint-disable-next-line max-len
							"To use this feature, your site must be publicly accessible. This applies to both test sites and instances where your REST API is password-protected. Please ensure your site is accessible to the public and try again. Learn more on our page about %1$scommon AI feature problems and errors%2$s. In case you need further help, please %3$scontact our support team%4$s.",
							"wordpress-seo-premium",
						),
						"<a1>",
						"</a1>",
						"<a2>",
						"</a2>",
					),
					{
						a1: <OutboundLink variant="error" href={ commonErrorsLink } />,
						a2: <OutboundLink variant="error" href={ supportLink } />,
					},
				) }
			</p>
		</Alert>
	);
};
