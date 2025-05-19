import { useSelect } from "@wordpress/data";
import { useCallback } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { Alert, Button, useModalContext } from "@yoast/ui-library";
import { safeCreateInterpolateElement } from "../../../helpers/i18n";
import { OutboundLink } from "../../../shared-admin/components";
import { STORE_NAME_EDITOR } from "../../constants";

/**
 * @returns {JSX.Element} The element.
 */
export const SeoAnalysisInactiveError = () => {
	const seoAnalysisFeatureToggleLink = useSelect( select => select( STORE_NAME_EDITOR )
		.selectAdminLink( "?page=wpseo_page_settings#/site-features#card-wpseo-keyword_analysis_active" ), [] );

	const handleRefresh = useCallback( () => {
		window.location.reload();
	}, [] );

	const { onClose } = useModalContext();

	return (
		<>
			<Alert variant="error">
				<span className="yst-block yst-font-medium">{ __( "SEO analysis required", "wordpress-seo" ) }</span>
				<p className="yst-mt-2">
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
								"wordpress-seo-premium"
							),
							"Yoast SEO",
							"<a>",
							"</a>",
							"Yoast AI"
						),
						{
							a: <OutboundLink variant="error" href={ seoAnalysisFeatureToggleLink } />,
						}
					) }
				</p>
			</Alert>
			<div className="yst-mt-6 yst-mb-1 yst-flex yst-space-x-3 rtl:yst-space-x-reverse yst-place-content-end">
				<Button variant="secondary" onClick={ onClose }>
					{ __( "Close", "wordpress-seo" ) }
				</Button>
				<Button className="yst-revoke-button" variant="primary" onClick={ handleRefresh }>
					{ __( "Refresh page", "wordpress-seo" ) }
				</Button>
			</div>
		</>
	);
};
