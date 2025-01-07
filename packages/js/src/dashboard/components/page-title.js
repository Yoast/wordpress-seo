import { createInterpolateElement } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { Alert, Link, Paper, Title } from "@yoast/ui-library";
import { OutboundLink } from "../../shared-admin/components";

/**
 * @type {import("../index").Features} Features
 * @type {import("../index").Links} Links
 */

/**
 * @param {string} userName The user name.
 * @param {Features} features Whether features are enabled.
 * @param {Links} links The links.
 * @returns {JSX.Element} The element.
 */
export const PageTitle = ( { userName, features, links } ) => (
	<Paper className="yst-shadow-md">
		<Paper.Content className="yst-flex yst-flex-col yst-gap-y-4 yst-max-w-screen-sm">
			<Title as="h1">
				{ sprintf(
					__( "Hi %s,", "wordpress-seo" ),
					userName
				) }
			</Title>
			<p className="yst-text-tiny">
				{ features.indexables && ! features.seoAnalysis && ! features.readabilityAnalysis
					? createInterpolateElement(
						sprintf(
							/**
							 * translators: %1$s and %2$s expand to an opening and closing anchor tag, to the site features page.
							 * %3$s and %4$s expand to an opening and closing anchor tag, to the user profile page.
							 **/
							__( "It looks like the ‘SEO analysis’ and the ‘Readability analysis’ are currently disabled in your %1$sSite features%2$s or your %3$suser profile settings%4$s. Enable these features to start seeing all the insights you need right here!", "wordpress-seo" ),
							"<link>",
							"</link>",
							"<profilelink>",
							"</profilelink>"
						),
						{
							// Added dummy space as content to prevent children prop warnings in the console.
							link: <Link href="admin.php?page=wpseo_page_settings#/site-features"> </Link>,
							profilelink: <Link href="profile.php"> </Link>,
						}
					)
					: createInterpolateElement(
						sprintf(
							/* translators: %1$s and %2$s expand to an opening and closing anchor tag. */
							__( "Welcome to your dashboard! Check your content's SEO performance, readability, and overall strengths and opportunities. %1$sLearn more about the dashboard%2$s.", "wordpress-seo" ),
							"<link>",
							"</link>"
						),
						{
							// Added dummy space as content to prevent children prop warnings in the console.
							link: <OutboundLink href={ links.dashboardLearnMore }> </OutboundLink>,
						}
					)
				}
			</p>
			{ ! features.indexables && (
				<Alert type="info">
					{ __( "Oops! You can’t see the overview of your SEO scores and readability scores right now because you’re in a non-production environment.", "wordpress-seo" ) }
				</Alert>
			) }
		</Paper.Content>
	</Paper>
);
