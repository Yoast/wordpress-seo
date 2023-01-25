/* External dependencies */
import { __ } from "@wordpress/i18n";

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
			{ __( "Tracking the ranking position...", "wordpress-seo" )	}
			&nbsp;
			<SvgIcon icon="loading-spinner" />
		</p>
	);
};

export default WincherSEOPerformanceLoading;
