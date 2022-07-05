import { __ } from "@wordpress/i18n";
import { FormLayout } from "../components";

/**
 * @returns {JSX.Element} The webmaster tools route.
 */
const WebmasterTools = () => {
	return (
		<FormLayout
			title={ __( "Webmaster tools", "wordpress-seo" ) }
			description={ __( "Verify your site with different webmaster tools. This will add a verification meta tag on your homepage. You can find instructions on how to verify your site for each platform by following the link in the description.", "wordpress-seo" ) }
		>
			Form fields start here
		</FormLayout>
	);
};

export default WebmasterTools;
