import { useSelect } from "@wordpress/data";
import { __, sprintf } from "@wordpress/i18n";
import { safeCreateInterpolateElement } from "../../../../helpers/i18n";
import { OutboundLink } from "../../../../shared-admin/components";
import { STORE_NAME_EDITOR } from "../../../constants";
import { Paragraph } from "./parts";

export const title = __( "SEO analysis required", "wordpress-seo" );

/**
 * The copy for the SEO-analysis-inactive error (SEO_ANALYSIS_INACTIVE).
 *
 * The "Refresh page" action that accompanies this error lives in the alert and
 * modal chrome, not here.
 *
 * @returns {JSX.Element} The element.
 */
export const Body = () => {
	const seoAnalysisFeatureToggleLink = useSelect( select => select( STORE_NAME_EDITOR )
		.selectAdminLink( "?page=wpseo_page_settings#/site-features#card-wpseo-keyword_analysis_active" ), [] );

	return (
		<Paragraph>
			{ safeCreateInterpolateElement(
				sprintf(
					/**
					 * translators:
					 * %1$s expands to Yoast SEO.
					 * %2$s and %3$s expand to an opening and closing anchor tag, respectively, that links to the settings page.
					 * %4$s expands to Yoast AI.
					 */
					__(
						"%4$s requires the SEO analysis to be enabled. To enable it, please navigate to %2$sSite features%3$s in %1$s, turn on the SEO analysis, and click 'Save changes'. If it's disabled in your WordPress user profile, access your profile and enable it there. Please contact your administrator if you don't have access to these settings.",
						"wordpress-seo"
					),
					"Yoast SEO",
					"<a>",
					"</a>",
					"Yoast AI"
				),
				{ a: <OutboundLink variant="error" href={ seoAnalysisFeatureToggleLink } /> }
			) }
		</Paragraph>
	);
};
