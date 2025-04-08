/* External dependencies */
import { __, sprintf } from "@wordpress/i18n";
import PropTypes from "prop-types";

/* Yoast dependencies */
import { Alert } from "@yoast/components";

/**
 * Creates the content for the Wincher currently tracking alert in the Track SEO Performance modal.
 *
 * @param {Object} props The props to use.
 *
 * @returns {wp.Element} The Wincher currently tracking alert.
 */
const WincherNoTrackedKeyphrasesAlert = ( props ) => {
	return (
		<Alert type="warning" className={ props.className }>
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

WincherNoTrackedKeyphrasesAlert.defaultProps = {
	className: "",
};

export default WincherNoTrackedKeyphrasesAlert;
