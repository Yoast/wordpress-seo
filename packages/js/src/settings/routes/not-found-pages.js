import { __ } from "@wordpress/i18n";
import { FormLayout } from "../components";

/**
 * @returns {JSX.Element} The 404 pages route.
 */
const NotFoundPages = () => {
	return (
		<FormLayout
			title={ __( "404 pages", "wordpress-seo" ) }
		>
			Form fields start here
		</FormLayout>
	);
};

export default NotFoundPages;
