import { Button } from "@yoast/ui-library";
import { __ } from "@wordpress/i18n";
import { ExternalLinkIcon } from "@heroicons/react/outline";

/**
 * The xml sitemap button component for the feature row in the Site Features settings.
 *
 * @param {string} href The URL to navigate to when the button is clicked.
 * @returns {JSX.Element} The xml sitemap button component.
 */
export const XmlSitemapButton = ( { href } ) => ( <Button
	as="a"
	id="link-xml-sitemaps"
	href={ href }
	variant="secondary"
	target="_blank"
	rel="noopener"
	size="small"
	className="yst-self-start yst-mt-4"
>
	{ __( "View the XML sitemap", "wordpress-seo" ) }
	<ExternalLinkIcon className="yst--me-1 yst-ms-1 yst-h-4 yst-w-4 yst-text-slate-400 rtl:yst-rotate-[270deg]" />
</Button> );
