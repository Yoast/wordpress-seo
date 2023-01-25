/* External dependencies */
import { __ } from "@wordpress/i18n";

/* Yoast dependencies */
import { Alert } from "@yoast/components";

/**
 * Creates the content for the Wincher no permalink alert in the Track SEO Performance modal.
 *
 * @returns {wp.Element} The Wincher no permalink alert.
 */
const WincherNoPermalinkAlert = () => {
	return (
		<Alert type="error">
			{ __(
				// eslint-disable-next-line max-len
				"Before you can track your SEO performance make sure to set either the post’s title and save it as a draft or manually set the post’s slug.",
				"wordpress-seo"
			) }
		</Alert>
	);
};

export default WincherNoPermalinkAlert;
