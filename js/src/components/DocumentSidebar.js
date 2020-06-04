import { __ } from "@wordpress/i18n";
import { Fragment } from "react";
import { SvgIcon } from "@yoast/components";
import { getIconForScore } from "./contentAnalysis/mapResults";
import { Button } from "@yoast/components";

/**
 * Renders the Document Sidebar Yoast integration.
 *
 * @returns {wp.Element} The Document sidebar panel.
 */
export default function DocumentSidebar( { focusKeyphrase, seoScore, seoScoreLabel, readabilityScore, readabilityScoreLabel, onClick } ) {
	const noFocusKeyphrase = ! focusKeyphrase;
	const noFocusKeyphraseEl = <div>
		<SvgIcon { ...getIconForScore( "bad" ) } /> { __( "No focus keyword was entered", "wordpress-seo" ) }
	</div>;
	const perfectScore = seoScore === "good" && readabilityScore === "good";

	return <Fragment>
		{ noFocusKeyphrase && noFocusKeyphraseEl }
		<div>
			<SvgIcon { ...getIconForScore( readabilityScore ) } />
			<span> { __( "Readability analysis:", "wordpress-seo" ) } <strong>{ readabilityScoreLabel }</strong></span>
		</div>
		<div>
			<SvgIcon { ...getIconForScore( seoScore ) } />
			<span> { __( "SEO analysis:", "wordpress-seo" ) } <strong>{ seoScoreLabel }</strong></span>
		</div>
		<br />
		{  ! perfectScore && <Button onClick={ onClick }>Improve your post with Yoast SEO</Button> }
	</Fragment>;
}
