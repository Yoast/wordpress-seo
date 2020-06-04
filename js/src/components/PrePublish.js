import { __ } from "@wordpress/i18n";
import { Fragment } from "react";
import { SvgIcon } from "@yoast/components";
import { getIconForScore } from "./contentAnalysis/mapResults";

/**
 * Renders the PrePublish Yoast integration.
 *
 * @returns {wp.Element} The PrePublish panel.
 */
export default function PrePublish( { focusKeyphrase, seoScore, seoScoreLabel, readabilityScore, readabilityScoreLabel } ) {
	const noFocusKeyphrase = ! focusKeyphrase;
	const noFocusKeyphraseEl = <div>
		<SvgIcon { ...getIconForScore( "bad" ) } /> { __( "No focus keyword was entered", "wordpress-seo" ) }
	</div>;

	let intro;
	if ( seoScore === "good" && readabilityScore === "good" ) {
		intro = <p>{ __( "We've analyzed your post. Everything looks good. Well done!" ) }</p>
	} else {
		intro = <p>{ __( "We've analyzed your post. There is still room for improvement!" ) }</p>
	}

	return <Fragment>
		{ intro }
		{ noFocusKeyphrase && noFocusKeyphraseEl }
		<div>
			<SvgIcon { ...getIconForScore( readabilityScore ) } />
			<span> { __( "Readability analysis:", "wordpress-seo" ) } <strong>{ readabilityScoreLabel }</strong></span>
		</div>
		<div>
			<SvgIcon { ...getIconForScore( seoScore ) } />
			<span> { __( "SEO analysis:", "wordpress-seo" ) } <strong>{ seoScoreLabel }</strong></span>
		</div>
	</Fragment>;
}
