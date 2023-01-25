import PropTypes from "prop-types";
import { Fragment } from "@wordpress/element";
import { __ } from "@wordpress/i18n";

import AnalysisChecklist from "./AnalysisChecklist";

/**
 * Renders the analysis checklist.
 *
 * @returns {wp.Element} The PrePublish panel.
 */
export default function PrePublish( {
	checklist,
	onClick,
} ) {
	let intro;

	const perfectScore = checklist.every( item => item.score === "good" );

	if ( perfectScore ) {
		intro = __( "We've analyzed your post. Everything looks good. Well done!", "wordpress-seo" );
	} else {
		intro = __( "We've analyzed your post. There is still room for improvement!", "wordpress-seo" );
	}

	return <Fragment>
		<p>{ intro }</p>
		<AnalysisChecklist checklist={ checklist } onClick={ onClick } />
	</Fragment>;
}

PrePublish.propTypes = {
	checklist: PropTypes.array.isRequired,
	onClick: PropTypes.func.isRequired,
};
