import { Alert } from "@yoast/components";
import { __, sprintf } from "@wordpress/i18n";
import interpolateComponents from "interpolate-components";

/**
 * Plugin installation successful alert.
 *
 * @returns {React.Element} The plugin installation successful alert.
 */
const AddonInstallationSuccessful = () => {
	let text = sprintf(
		/* translators: %1$s expands to Yoast, %2$s to a 'link' open tag, %2$s to a 'link' close tag. */
		__( "Installation successful! We hope you'll enjoy %1$s SEO Premium." +
			"You can get started by running through %2$sour configuration wizard.%3$s", "wordpress-seo" ),
		"Yoast",
		"{{a}}",
		"{{/a}}"
	);

	text = interpolateComponents( {
		mixedString: text,
		components: {
			// eslint-disable-next-line jsx-a11y/anchor-has-content
			a: <a href="/wp-admin/admin.php?page=wpseo_configurator" />,
		},
	} );

	return (
		<Alert type={ "success" }>
			<span> { text } </span>
		</Alert>
	);
};

export default AddonInstallationSuccessful;
