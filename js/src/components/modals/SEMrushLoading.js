/* External dependencies */
import { __, sprintf } from "@wordpress/i18n";

/* Yoast dependencies */
import { SvgIcon } from "@yoast/components";

/**
 * Creates the loading content for the SEMrush related keywords modal.
 *
 * @returns {wp.Element} The SEMrush loading content.
 */
const SEMrushLoading = () => {
	return (
		<p className="yoast-related-keyphrases-modal__loading-message">
			{
				sprintf(
					/* translators: %1$s expands to "Yoast SEO", %2$s expands to "SEMrush". */
					__( "Please wait while %1$s is connecting to %2$s to get related keyphrases...", "wordpress-seo" ),
					"Yoast SEO",
					"SEMrush"
				)
			}
			&nbsp;
			<SvgIcon icon="loading-spinner" />
		</p>
	);
};

export default SEMrushLoading;
