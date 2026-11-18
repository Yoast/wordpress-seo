import PropTypes from "prop-types";
import { __ } from "@wordpress/i18n";
import { Fragment } from "@wordpress/element";
import { Button, Root } from "@yoast/ui-library";

import AnalysisCheck from "./AnalysisCheck";

/**
 * Renders the analysis checklist.
 *
 * @returns {wp.Element} The analysis checklist.
 */
export default function AnalysisChecklist( {
	checklist,
	onClick,
} ) {
	const perfectScore = checklist.every( item => item.score === "good" );

	return <Fragment>
		{ checklist.map( item => <AnalysisCheck key={ item.label } { ...item } /> ) }
		<br />
		{ ! perfectScore && <Root><Button variant="secondary" size="small" onClick={ onClick }>{ __( "Improve your post with Yoast SEO", "wordpress-seo" ) }</Button></Root> }
	</Fragment>;
}

AnalysisChecklist.propTypes = {
	checklist: PropTypes.array.isRequired,
	onClick: PropTypes.func.isRequired,
};
