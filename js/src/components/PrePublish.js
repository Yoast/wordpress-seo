import PropTypes from "prop-types";
import { __ } from "@wordpress/i18n";
import { Fragment } from "@wordpress/element";
import { SvgIcon } from "@yoast/components";
import { getIconForScore } from "./contentAnalysis/mapResults";
import { Button } from "@yoast/components";

/**
 * Renders the PrePublish Yoast integration.
 *
 * @returns {wp.Element} The PrePublish panel.
 */
export default function PrePublish( { focusKeyphrase, seoScore, seoScoreLabel, readabilityScore, readabilityScoreLabel, onClick } ) {
	const noFocusKeyphrase = ! focusKeyphrase;
	const noFocusKeyphraseEl = <div>
		<SvgIcon { ...getIconForScore( "bad" ) } /> { __( "No focus keyword was entered", "wordpress-seo" ) }
	</div>;

	let intro;
	const perfectScore = seoScore === "good" && readabilityScore === "good";
	if ( perfectScore ) {
		intro = <p>{ __( "We've analyzed your post. Everything looks good. Well done!", "wordpress-seo" ) }</p>;
	} else {
		intro = <p>{ __( "We've analyzed your post. There is still room for improvement!", "wordpress-seo" ) }</p>;
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
		<br />
		{ ! perfectScore && <Button onClick={ onClick }>{ __( "Improve your post with Yoast SEO", "wordpress-seo" ) }</Button> }
	</Fragment>;
}

PrePublish.propTypes = {
	focusKeyphrase: PropTypes.string.isRequired,
	seoScore: PropTypes.string.isRequired,
	seoScoreLabel: PropTypes.string.isRequired,
	readabilityScore: PropTypes.string.isRequired,
	readabilityScoreLabel: PropTypes.string.isRequired,
	onClick: PropTypes.func.isRequired,
};
