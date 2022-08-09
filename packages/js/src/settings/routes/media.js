import { __ } from "@wordpress/i18n";
import { FormLayout } from "../components";

/**
 * @returns {JSX.Element} The media route.
 */
const Media = () => {
	return (
		<FormLayout
			title={ __( "Media", "wordpress-seo" ) }
		>
			Form fields start here
		</FormLayout>
	);
};

export default Media;
