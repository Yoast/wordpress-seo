import { __ } from "@wordpress/i18n";
import { FormLayout } from "../components";

/**
 * @returns {JSX.Element} The search pages route.
 */
const SearchPages = () => {
	return (
		<FormLayout
			title={ __( "Search pages", "wordpress-seo" ) }
		>
			Form fields start here
		</FormLayout>
	);
};

export default SearchPages;
