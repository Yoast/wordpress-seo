import PropTypes from "prop-types";
import { __ } from "@wordpress/i18n";
import { Fragment } from "@wordpress/element";
import AnalysisCheck from "./AnalysisCheck";
import { Button } from "@yoast/components";

/**
 * Renders the analysis checklist.
 *
 * @returns {wp.Element} The PrePublish panel.
 */
export default function AnalysisChecklist( {
	checklist,
	intro,
	onClick,
} ) {
	const perfectScore = checklist.every( item => item.score === "good" );

	return <Fragment>
		{ ( intro !== "" ) && <p>{ intro }</p> }
		{ checklist.map( item => <AnalysisCheck key={ item.label } { ...item } /> ) }
		<br />
		{ ! perfectScore && <Button onClick={ onClick }>{ __( "Improve your post with Yoast SEO", "wordpress-seo" ) }</Button> }
	</Fragment>;
}

AnalysisChecklist.propTypes = {
	checklist: PropTypes.array.isRequired,
	intro: PropTypes.string,
	onClick: PropTypes.func.isRequired,
};

AnalysisChecklist.defaultProps = {
	intro: "",
};
