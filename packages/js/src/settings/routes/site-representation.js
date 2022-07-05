import { __ } from "@wordpress/i18n";
import { FormLayout } from "../components";

/**
 * @returns {JSX.Element} The site representation route.
 */
const SiteRepresentation = () => {
	return (
		<FormLayout
			title={ __( "Site representation", "wordpress-seo" ) }
			description={ __( "This info is intended to appear in Google's Knowledge Graph. You can be either an organization, or a person.", "wordpress-seo" ) }
		>
			Form fields start here
		</FormLayout>
	);
};

export default SiteRepresentation;
