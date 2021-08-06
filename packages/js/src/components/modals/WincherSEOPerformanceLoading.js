/* External dependencies */
import { __, sprintf } from "@wordpress/i18n";

/* Yoast dependencies */
import { SvgIcon } from "@yoast/components";

/**
 * Creates the loading content for the WincherSEOPerformance modal.
 *
 * @returns {wp.Element} The WincherSEOPerformance loading content.
 */
const WincherSEOPerformanceLoading = () => {
	return (
		<p className="yoast-wincher-seo-performance-modal__loading-message">
			{
				sprintf(
					/* translators: %1$s expands to "Yoast SEO", %2$s expands to "Wincher". */
					__( "Please wait while %1$s connects to %2$s to get SEO performance...", "wordpress-seo" ),
					"Yoast SEO",
					"Wincher"
				)
			}
			&nbsp;
			<SvgIcon icon="loading-spinner" />
		</p>
	);
};

export default WincherSEOPerformanceLoading;
