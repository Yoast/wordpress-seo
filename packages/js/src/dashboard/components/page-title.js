import { __, sprintf } from "@wordpress/i18n";
import { safeCreateInterpolateElement } from "../../helpers/i18n";
import { Alert, Link, Paper, Title } from "@yoast/ui-library";
import { OutboundLink } from "../../shared-admin/components";

/**
 * @type {import("../index").Features} Features
 * @type {import("../index").Links} Links
 */

/**
 * @param {string} userName The username.
 * @param {Features} features Whether features are enabled.
 * @param {Links} links The links.
 * @param {boolean} sitekitFeatureEnabled Whether the site kit feature is enabled.
 * @returns {JSX.Element} The element.
 */
// eslint-disable-next-line complexity
export const PageTitle = ( { userName, features, links, sitekitFeatureEnabled } ) => {
	/**
	 * translators: %1$s and %2$s expand to an opening and closing anchor tag, to the site features page.
	 * %3$s and %4$s expand to an opening and closing anchor tag, to the user profile page.
	 **/
	const sitekitEnabledMessage = __( "Welcome to your dashboard! Check your content's SEO performance, readability, and overall strengths and opportunities. Get even more insights by enabling the ‘SEO analysis’ and the ‘Readability analysis’ in your %1$sSite features%2$s or your %3$suser profile settings%4$s.", "wordpress-seo" );
	/**
	 * translators: %1$s and %2$s expand to an opening and closing anchor tag, to the site features page.
	 * %3$s and %4$s expand to an opening and closing anchor tag, to the user profile page.
	 **/
	const sitekitDisabledMessage = __( "It looks like the ‘SEO analysis’ and the ‘Readability analysis’ are currently disabled in your %1$sSite features%2$s or your %3$suser profile settings%4$s. Enable these features to start seeing all the insights you need right here!", "wordpress-seo" );
	const noAnalysisEnabledMessage = sitekitFeatureEnabled ? sitekitEnabledMessage : sitekitDisabledMessage;

	const noIndexablesEnabledMessage = sitekitFeatureEnabled
		? __( "Oops! You can’t see the overview of your SEO insights right now because you’re in a non-production environment.", "wordpress-seo" )
		: __( "Oops! You can’t see the overview of your SEO scores and readability scores right now because you’re in a non-production environment.", "wordpress-seo" );

	return (
		<Paper className="yst-shadow-md">
			<Paper.Content className="yst-flex yst-flex-col yst-gap-y-4 yst-max-w-screen-sm">
				<Title as="h1">
					{ sprintf(
						/* translators: %s expands to the username */
						__( "Hi %s,", "wordpress-seo" ),
						userName
					) }
				</Title>
				<p className="yst-text-tiny">
					{ features.indexables && ! features.seoAnalysis && ! features.readabilityAnalysis
						? safeCreateInterpolateElement(
							sprintf(
								noAnalysisEnabledMessage,
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
						: safeCreateInterpolateElement(
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
						{ noIndexablesEnabledMessage }
					</Alert>
				) }
			</Paper.Content>
		</Paper>
	);
};
