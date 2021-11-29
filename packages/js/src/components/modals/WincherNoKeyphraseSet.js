/* External dependencies */
import { __ } from "@wordpress/i18n";

/* Yoast dependencies */
import { Alert } from "@yoast/components";

/**
 * Creates the content for the Wincher no keyphrase setmodal.
 *
 * @returns {wp.Element} The Wincherno keyphrase modal content.
 */
const WincherNoKeyphraseSet = () => {
	return (
		<Alert type="error">
			{ __(
				"No keyphrase has been set. Please set a keyphrase first.",
				"wordpress-seo"
			) }
		</Alert>
	);
};

export default WincherNoKeyphraseSet;
