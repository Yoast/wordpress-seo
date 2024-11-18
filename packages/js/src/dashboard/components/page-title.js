import { createInterpolateElement } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { Alert, Link, Paper, Title } from "@yoast/ui-library";

/**
 * @type {import("../index").Features} Features
 */

/**
 * @param {string} userName The user name.
 * @param {Features} features Whether features are enabled.
 * @returns {JSX.Element} The element.
 */
export const PageTitle = ( { userName, features } ) => (
	<Paper>
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
							/* translators: %1$s and %2$s expand to an opening and closing anchor tag. */
							__( "It seems that the SEO analysis and the Readability analysis are currently disabled in your %1$sSite features%2$s. Once you enable these features, you'll be able to see the insights you need right here!", "wordpress-seo" ),
							"<link>",
							"</link>"
						),
						{
							// Added dummy space as content to prevent children prop warnings in the console.
							link: <Link href="admin.php?page=wpseo_page_settings#/site-features"> </Link>,
						}
					)
					: __( "Welcome to our SEO dashboard!", "wordpress-seo" )
				}
			</p>
			{ ! features.indexables && (
				<Alert type="info">
					{ __( "The overview of your SEO scores and Readability scores is not available because you're on a non-production environment.", "wordpress-seo" ) }
				</Alert>
			) }
		</Paper.Content>
	</Paper>
);
