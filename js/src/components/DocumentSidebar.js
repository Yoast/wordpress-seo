import PropTypes from "prop-types";
import { __ } from "@wordpress/i18n";
import { Fragment } from "@wordpress/element";
import { SvgIcon } from "@yoast/components";
import { getIconForScore } from "./contentAnalysis/mapResults";
import { Button } from "@yoast/components";

/**
 * Renders the Document Sidebar Yoast integration.
 *
 * @returns {wp.Element} The Document sidebar panel.
 */
export default function DocumentSidebar( { seoScore, seoScoreLabel, readabilityScore, readabilityScoreLabel, onClick } ) {
	const perfectScore = seoScore === "good" && readabilityScore === "good";

	return <Fragment>
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

DocumentSidebar.propTypes = {
	seoScore: PropTypes.string.isRequired,
	seoScoreLabel: PropTypes.string.isRequired,
	readabilityScore: PropTypes.string.isRequired,
	readabilityScoreLabel: PropTypes.string.isRequired,
	onClick: PropTypes.func.isRequired,
};
