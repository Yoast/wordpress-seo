import { __ } from "@wordpress/i18n";
import { Paper } from "@yoast/ui-library";
import { RouteLayout } from "../components";

/**
 * @returns {JSX.Element} The regex redirects route.
 */
export const RegexRedirects = () => {
	return (
		<Paper>
			<RouteLayout
				title={ __( "Regex Redirects", "wordpress-seo" ) }
				description={ __( "Regex Redirects desc", "wordpress-seo" ) }
			>
				<div id="yoast-configuration" className="yst-p-8 yst-max-w-[715px]">
					Regex redirects
				</div>
			</RouteLayout>
		</Paper>
	);
};
