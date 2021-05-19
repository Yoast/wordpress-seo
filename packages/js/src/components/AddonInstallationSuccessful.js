import { Alert } from "@yoast/components";
import { __, sprintf } from "@wordpress/i18n";

/**
 * Plugin installation successful alert.
 *
 * @returns {React.Element} The plugin installation successful alert.
 */
const AddonInstallationSuccessful = () => {
	const text = sprintf(
		/* translators: %s expands to Yoast */
		__( "Installation successful! We hope you enjoy %s SEO premium.", "wordpress-seo" ),
		"Yoast"
	);

	return (
		<Alert type={ "success" }>
			<span> { text } </span>
		</Alert>
	);
};

export default AddonInstallationSuccessful;
