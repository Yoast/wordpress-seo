import { __ } from "@wordpress/i18n";
import { Paper } from "@yoast/ui-library";
import { RouteLayout } from "../components";

/**
 * @returns {JSX.Element} The redirect method route.
 */
export const RedirectMethod = () => {
	return (
		<Paper>
			<RouteLayout
				title={ __( "Redirect Method", "wordpress-seo" ) }
				description={ __( "Redirect Method desc", "wordpress-seo" ) }
			>
				<div id="yoast-configuration" className="yst-p-8 yst-max-w-[715px]">
					{ __( "Redirect method", "wordpress-seo" ) }
				</div>
			</RouteLayout>
		</Paper>
	);
};
