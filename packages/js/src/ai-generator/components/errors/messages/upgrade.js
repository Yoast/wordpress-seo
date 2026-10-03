import { useSelect } from "@wordpress/data";
import { __, sprintf } from "@wordpress/i18n";
import { safeCreateInterpolateElement } from "../../../../helpers/i18n";
import { OutboundLink } from "../../../../shared-admin/components";
import { STORE_NAME_EDITOR } from "../../../constants";
import { Paragraph } from "./parts";

export const title = __( "Something went wrong", "wordpress-seo" );

/**
 * The copy for the outdated-version error (410).
 *
 * @returns {JSX.Element} The element.
 */
export const Body = () => {
	const pluginsLink = useSelect( select => select( STORE_NAME_EDITOR ).selectAdminLink( "plugins.php" ), [] );

	return (
		<Paragraph>
			{ safeCreateInterpolateElement(
				sprintf(
					/* translators: %1$s expands to Yoast SEO Premium. %2$s expands to an opening link tag. %3$s expands to a closing link tag. */
					__( "The version of %1$s is outdated. Please upgrade %1$s %2$shere%3$s!", "wordpress-seo" ),
					"Yoast SEO Premium",
					"<a>",
					"</a>"
				),
				{ a: <OutboundLink variant="error" href={ pluginsLink } /> }
			) }
		</Paragraph>
	);
};
