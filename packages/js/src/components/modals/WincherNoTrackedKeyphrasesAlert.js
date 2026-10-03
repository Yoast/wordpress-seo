import { __, sprintf } from "@wordpress/i18n";
import { Alert } from "@yoast/components";
import PropTypes from "prop-types";

/**
 * Creates the content for the Wincher currently tracking alert in the Track SEO Performance modal.
 *
 * @param {string} [className=""] Optional className for the alert.
 *
 * @returns {JSX.Element} The Wincher currently tracking alert.
 */
const WincherNoTrackedKeyphrasesAlert = ( { className = "" } ) => {
	return (
		<Alert type="warning" className={ className }>
			{
				sprintf(
					/* translators: %s: Expands to "Wincher". */
					__(
						"Your %s account does not contain any keyphrases for this website yet. You can track keyphrases by using the \"Track SEO Performance\" button in the post editor.",
						"wordpress-seo"
					),
					"Wincher"
				)
			}
		</Alert>
	);
};

WincherNoTrackedKeyphrasesAlert.propTypes = {
	className: PropTypes.string,
};

export default WincherNoTrackedKeyphrasesAlert;
