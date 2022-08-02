import { __ } from "@wordpress/i18n";
import { FormLayout } from "../components";

/**
 * @returns {JSX.Element} The date archives route.
 */
const DateArchives = () => {
	return (
		<FormLayout
			title={ __( "Date archives", "wordpress-seo" ) }
		>
			Form fields start here
		</FormLayout>
	);
};

export default DateArchives;
