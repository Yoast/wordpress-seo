import { useSelect } from "@wordpress/data";
import { __, sprintf } from "@wordpress/i18n";
import { Alert } from "@yoast/ui-library";
import { OutboundLink } from "../../../shared-admin/components";
import { STORE_NAME_AI } from "../../constants";
import { safeCreateInterpolateElement } from "../../../helpers/safeCreateInterpolateElement";

/**
 * @returns {JSX.Element} The element.
 */
export const UpgradeAlert = () => {
	const pluginsLink = useSelect( select => select( STORE_NAME_AI ).selectAdminLink( "plugins.php" ), [] );

	return (
		<Alert variant="error">
			<span className="yst-block yst-font-medium">{ __( "Something went wrong", "wordpress-seo-premium" ) }</span>
			<p className="yst-mt-2">
				{ safeCreateInterpolateElement(
					sprintf(
						/* translators: %1$s expands to Yoast SEO Premium. %2$s expands to an opening link tag. %3$s expands to a closing link tag. */
						__( "The version of %1$s is outdated. Please upgrade %1$s %2$shere%3$s!", "wordpress-seo-premium" ),
						"Yoast SEO Premium",
						"<a>",
						"</a>",
					),
					{
						a: <OutboundLink variant="error" href={ pluginsLink } />,
					},
				) }
			</p>
		</Alert>
	);
};
