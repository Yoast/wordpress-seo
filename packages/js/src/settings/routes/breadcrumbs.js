import { __ } from "@wordpress/i18n";
import { FormLayout } from "../components";

/**
 * @returns {JSX.Element} The breadcrumbs route.
 */
const Breadcrumbs = () => {
	return (
		<FormLayout
			title={ __( "Breadcrumbs", "wordpress-seo" ) }
		>
			Form fields start here
		</FormLayout>
	);
};

export default Breadcrumbs;
