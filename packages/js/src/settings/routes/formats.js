import { __ } from "@wordpress/i18n";
import { FormLayout } from "../components";

/**
 * @returns {JSX.Element} The formats route.
 */
const Formats = () => {
	return (
		<FormLayout
			title={ __( "Formats", "wordpress-seo" ) }
		>
			Form fields start here
		</FormLayout>
	);
};

export default Formats;
