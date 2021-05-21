import { Alert } from "@yoast/components";
import { __, sprintf } from "@wordpress/i18n";
import interpolateComponents from "interpolate-components";
import PropTypes from "prop-types";

/**
 * Plugin installation successful alert.
 *
 * @param {Object} props The props.
 *
 * @returns {React.Element} The plugin installation successful alert.
 */
const AddonInstallationSuccessful = props => {
	let text = sprintf(
		/* translators: %1$s expands to Yoast, %2$s to a 'link' open tag, %2$s to a 'link' close tag. */
		__( "Installation successful! We hope you'll enjoy %1$s SEO Premium. " +
			"You can get started by running through %2$sour configuration wizard.%3$s", "wordpress-seo" ),
		"Yoast",
		"{{a}}",
		"{{/a}}"
	);

	text = interpolateComponents( {
		mixedString: text,
		components: {
			// eslint-disable-next-line jsx-a11y/anchor-has-content
			a: <a href={ props.configurationWizardUrl } />,
		},
	} );

	return (
		<Alert type={ "success" }>
			<span>{ text }</span>
		</Alert>
	);
};

AddonInstallationSuccessful.propTypes = {
	configurationWizardUrl: PropTypes.string,
};

AddonInstallationSuccessful.defaultProps = {
	configurationWizardUrl: "/wp-admin/admin.php?page=wpseo_configurator",
};

export default AddonInstallationSuccessful;
