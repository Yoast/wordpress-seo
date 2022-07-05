import { __ } from "@wordpress/i18n";
import { FormLayout } from "../components";

/**
 * @returns {JSX.Element} The RSS route.
 */
const Rss = () => {
	return (
		<FormLayout
			title={ __( "RSS", "wordpress-seo" ) }
		>
			Form fields start here
		</FormLayout>
	);
};

export default Rss;
