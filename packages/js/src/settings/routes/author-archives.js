import { __ } from "@wordpress/i18n";
import { FormLayout } from "../components";

/**
 * @returns {JSX.Element} The author archives route.
 */
const AuthorArchives = () => {
	return (
		<FormLayout
			title={ __( "Author archives", "wordpress-seo" ) }
		>
			Form fields start here
		</FormLayout>
	);
};

export default AuthorArchives;
