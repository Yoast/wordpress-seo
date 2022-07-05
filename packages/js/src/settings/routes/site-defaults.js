import { __ } from "@wordpress/i18n";
import { FormLayout } from "../components";

/**
 * @returns {JSX.Element} The site defaults route.
 */
const SiteDefaults = () => {
	return (
		<FormLayout
			title={ __( "Site defaults", "wordpress-seo" ) }
		>
			Form fields start here
		</FormLayout>
	);
};

export default SiteDefaults;
